import Imap from 'node-imap';
import { simpleParser, ParsedMail } from 'mailparser';
import SupportEmail from '../models/supportMail';

const imapConfig = {
  user: process.env.EMAIL || '',
  password: process.env.PASSWORD || '',
  host: process.env.HOST || '',
  port: 993,
  tls: true,
  tlsOptions: {
    rejectUnauthorized: false, // Disable self-signed certificate validation
  },
};

const imap = new Imap(imapConfig);

let processedEmails: any[] = [];

// Function to open the inbox
function openInbox(callback: (err: Error | null, box: Imap.Box) => void): void {
  imap.openBox('INBOX', false, callback);
}

function fetchAndProcessEmails(): void {
  // Search for unread emails
  imap.search(['UNSEEN'], async (err, results) => {
    if (err) {
      console.error('Error searching for emails:', err);
      console.log('Closing the connection...');
      imap.end(); // Close the connection if no unseen emails are found
      return;
    }

    if (!results.length) {
      console.log('No unseen emails found.');
      return;
    }
    const fetch = imap.fetch(results, {
      bodies: ['HEADER.FIELDS (FROM SUBJECT DATE)', 'TEXT'],
    });

    // Array to track email processing promises
    let emailProcessingPromises: Promise<void>[] = [];

    fetch.on('message', (msg, seqno) => {
      // Pushing email promise to emailProcessingPromises
      emailProcessingPromises.push(
        new Promise<void>((resolve, reject) => {
          let emailData = '';

          msg.on('body', (stream) => {
            stream.on('data', (chunk) => {
              emailData += chunk.toString();
            });
          });

          msg.on('end', async () => {
            try {
              // Parse the email body
              const parsed: ParsedMail = await simpleParser(emailData);
              const email = parseEmailDetails(String(parsed.text));
              processedEmails.push({ seqno, ...email });
              // Resolving the promise
              resolve();
            } catch (err) {
              console.error(`Error while parsing the email ${seqno}: `, err);
              // Rejecting the promise
              reject();
            }
          });

          msg.once('attributes', (attrs) => {
            const { uid } = attrs;
            imap.addFlags(uid, '\\Seen', (err) => {
              if (err) {
                console.log(
                  `Error while marking email #${seqno} as read.`,
                  err
                );
              } else {
                console.log(`Marked email #${seqno} as read.`);
              }
            });
          });
        })
      );
    });

    fetch.on('end', async () => {
      console.log('Finished processing fetched emails.');
      try {
        // Wait for all email processing promises to resolve
        await Promise.all(emailProcessingPromises);
        console.log('All emails have been processed.');
        await storeEmailsToDB(processedEmails);
        emailProcessingPromises = [];
      } catch (err) {
        console.log('fetch end: ', err);
      }
    });
  });
}

// Function to connect and process unread emails
export async function connectMailServer(): Promise<void> {
  imap.connect();

  imap.once('ready', () => {
    console.log('Server connected successfully!');
    openInbox((err, box) => {
      if (err) {
        console.error('Error opening inbox:', err);
        return;
      }

      fetchAndProcessEmails();

      // Listen for new mail
      imap.on('mail', (newMailCount) => {
        console.log(`${newMailCount} new email(s) detected!`);
        fetchAndProcessEmails();
      });
    });
  });

  imap.once('error', (err) => {
    console.error('IMAP connection error:', err);
  });

  imap.once('end', () => {
    console.log('Server disconnected successfully!');
    // Attempting connection after closing it
    console.log('Reestablisting the connection...');
    connectMailServer();
  });
}

// Constructing the email object
function parseEmailDetails(emailText: string): {
  textBody: string;
  htmlBody: string;
  subject: string;
  from: string;
  date: string;
} {
  // Extract Subject
  const subjectMatch = emailText.match(/Subject: (.+)/);
  const subject = subjectMatch ? subjectMatch[1].trim() : 'No Subject';

  // Extract From
  const fromMatch = emailText.match(/From: (.+)/);
  const from = fromMatch ? fromMatch[1].trim() : 'No Sender';

  // Extract Date
  const dateMatch = emailText.match(/Date: (.+)/);
  const date = dateMatch ? dateMatch[1].trim() : 'No Date';

  // Extract HTML Body
  const htmlMatch = emailText.match(/<html>([\s\S]*?)<\/html>/);
  const htmlBody = htmlMatch ? htmlMatch[0].trim() : 'No HTML Content';

  // Extract Text Body (Plain text part above the HTML header if present)
  const textBodyMatch = emailText.split('--')[0].trim();
  const textBody = textBodyMatch || 'No Text Body';

  return {
    textBody,
    htmlBody,
    subject,
    from,
    date,
  };
}

// Adding email object array to db
async function storeEmailsToDB(emails: any[]): Promise<void> {
  try {
    // DB stroing logic
    console.log(emails);
    await SupportEmail.insertMany(emails, { ordered: false });
    console.log(`Entries entered to db`);
    // processedEmails = [];
  } catch (err) {
    console.log('DB Error: ', err);
  }
}
