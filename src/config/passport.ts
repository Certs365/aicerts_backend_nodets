import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';

// Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value ?? 'No email provided';
        return done(null, { email });
      } catch (error) {
        return done(error);
      }
    }
  )
);

// LinkedIn OAuth strategy
passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
      callbackURL: process.env.LINKEDIN_CALLBACK_URL!,
      scope: ['r_liteprofile', 'r_emailaddress'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value ?? 'No email provided';
        return done(null, { email });
      } catch (error) {
        console.log(error);
        return done(error);
      }
    }
  )
);

// This is to ensure the user object will be available in requests
passport.serializeUser((user: any, done: Function) => {
  done(null, user);
});

passport.deserializeUser((user: any, done: Function) => {
  done(null, user);
});
