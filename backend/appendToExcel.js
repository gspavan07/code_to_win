const ExcelJS = require("exceljs");
const path = require("path");
const { logger } = require("./utils");

const filePath = path.join(
  __dirname,
  "OneDriveSync",
  "CodeTracker_Student_Registration.xlsx"
);

async function appendToExcel(student) {
  const workbook = new ExcelJS.Workbook();

  // Try to load existing file, or create new
  try {
    await workbook.xlsx.readFile(filePath);
    logger.info("[EXCEL] Loaded existing Excel file.");
  } catch (err) {
    logger.error("[EXCEL] Excel file not found. Creating a new one.");
  }

  const headers = [
    "Student ID",
    "Name",
    "Email",
    "Gender",
    "Degree",
    "Branch",
    "Year",
    "Section",
    "LeetCode ID",
    "CodeChef ID",
    "HackerRank ID",
    "GeeksForGeeks ID",
  ];

  const row = [
    student.stdId,
    student.name,
    student.email,
    student.gender,
    student.degree,
    student.dept,
    student.year,
    student.section,
    student.leetcode || "",
    student.codechef || "",
    student.hackerrank || "",
    student.geeksforgeeks || "",
  ];

  // ========== 1) Master sheet ==========
  let masterSheet = workbook.getWorksheet("AllRegistrations");
  if (!masterSheet) {
    masterSheet = workbook.addWorksheet("AllRegistrations");
    masterSheet.addRow(headers);
  }
  masterSheet.addRow(row);

  // ========== 2) Branch-Year-Section sheet ==========
  const specificSheetName = `${student.dept}-${student.year}-${student.section}`;
  let specificSheet = workbook.getWorksheet(specificSheetName);
  if (!specificSheet) {
    specificSheet = workbook.addWorksheet(specificSheetName);
    specificSheet.addRow(headers);
  }
  specificSheet.addRow(row);

  // ========== Save file ==========
  await workbook.xlsx.writeFile(filePath);
  logger.info(`[EXCEL] Added student ${student.stdId} to Excel.`);

  return true;
}

module.exports = appendToExcel;
