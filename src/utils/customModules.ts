import dotenv from "dotenv";
import moment from "moment";
import { Worksheet } from "exceljs";
import fetch from "node-fetch";

// Load environment variables from .env file
dotenv.config();


interface CertificateData {
  lastUpdate: string;
  approveDate?: string;
}

// Function to get aggregated details month-wise
const _getAggregatedCertsDetails = async (
  data: CertificateData[],
  year: number,
  type: number
): Promise<{ month: number; count: number }[]> => {
  // Function to extract year from a date field
  const getYear = (dateStr: string): number => {
    const date = moment(dateStr);
    return date.year();
  };

  // Filter data for the specified year
  const dataYear = data.filter((entry) => {
    const entryYear = getYear(entry.lastUpdate);
    return entryYear === year;
  });

  // Count occurrences of each month
  const monthCounts: { [key: number]: number } = {};
  if (type === 2) {
    dataYear.forEach((entry) => {
      const month = moment(entry.lastUpdate).month() + 1; // Adding 1 because moment.js months are 0-indexed
      monthCounts[month] = (monthCounts[month] || 0) + 1;
    });
  } else {
    dataYear.forEach((entry) => {
      const month = moment(entry.approveDate || "").month() + 1; // Adding 1 because moment.js months are 0-indexed
      monthCounts[month] = (monthCounts[month] || 0) + 1;
    });
  }

  // Create array with counts for all months in the specified year
  const monthCountsArray = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    count: monthCounts[i + 1] || 0,
  }));

  return monthCountsArray;
};

// Function to add a heading row in an Excel worksheet
const addHeading = async (text: string, worksheet: Worksheet): Promise<void> => {
  const row = worksheet.addRow([text]);

  row.alignment = { horizontal: "center" };

  for (let i = 1; i <= 6; i++) {
    const cell = row.getCell(i);
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFFF033" }, // Yellow color
    };
  }

  worksheet.mergeCells(`A${row.number}:F${row.number}`);
  row.font = { bold: true, size: 15 };
};

// Function to generate a bar chart image using QuickChart API
const generateChartImage = async (data: {
  withpdfreactivate: number;
  withpdfrevoke: number;
  withpdfrenew: number;
  withpdf: number;
  withoutpdfreactivate: number;
  withoutpdfrevoke: number;
  withoutpdfrenew: number;
  withoutpdf: number;
  batchreactivate: number;
  batchrevoke: number;
  batchrenew: number;
  batchfetch: number;
  dynamicreactivate: number;
  dynamicrevoke: number;
  dynamicrenew: number;
  dynamicfetch: number;
  dynamicbatchreactivate: number;
  dynamicbatchrevoke: number;
  dynamicbatchrenew: number;
  dynamicbatchfetch: number;
}): Promise<Buffer> => {
  const chartConfig = {
    type: "bar",
    data: {
      labels: ["Reactivate", "Revoke", "Renew", "Issued"],
      datasets: [
        {
          label: "With PDF",
          data: [
            data.withpdfreactivate,
            data.withpdfrevoke,
            data.withpdfrenew,
            data.withpdf,
          ],
          backgroundColor: "rgba(247, 232, 131, 1)",
        },
        {
          label: "Without PDF",
          data: [
            data.withoutpdfreactivate,
            data.withoutpdfrevoke,
            data.withoutpdfrenew,
            data.withoutpdf,
          ],
          backgroundColor: "rgba(247, 182, 2, 0.8)",
        },
        {
          label: "Batch",
          data: [
            data.batchreactivate,
            data.batchrevoke,
            data.batchrenew,
            data.batchfetch,
          ],
          backgroundColor: "rgba(255, 211, 15, 1)",
        },
        {
          label: "Dynamic",
          data: [
            data.dynamicreactivate,
            data.dynamicrevoke,
            data.dynamicrenew,
            data.dynamicfetch,
          ],
          backgroundColor: "rgba(173, 142, 0, 1)",
        },
        {
          label: "Dynamic Batch",
          data: [
            data.dynamicbatchreactivate,
            data.dynamicbatchrevoke,
            data.dynamicbatchrenew,
            data.dynamicbatchfetch,
          ],
          backgroundColor: "rgba(242, 166, 65, 1)",
        },
      ],
    },
    options: {
      scales: {
        x: {
          ticks: {
            font: {
              weight: "bold", // Make x-axis labels bold
            },
          },
          grid: {
            borderWidth: 2, // Make x-axis border line thicker
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            font: {
              weight: "bold", // Make y-axis labels bold
            },
          },
          grid: {
            borderWidth: 2, // Make y-axis border line thicker
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            font: {
              weight: "bold", // Make legend labels bold
            },
          },
        },
      },
    },
  };

  const chartUrl = `https://quickchart.io/chart?c=${encodeURIComponent(
    JSON.stringify(chartConfig)
  )}`;
  const response = await fetch(chartUrl);
  const buffer = await response.buffer();

  return buffer; // Return the image as binary data
};

export {
  _getAggregatedCertsDetails,
  addHeading,
  generateChartImage,
};
