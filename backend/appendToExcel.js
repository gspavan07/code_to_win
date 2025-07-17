const ExcelJS = require("exceljs");
const path = require("path");
const fs = require("fs");
const { logger } = require("./utils");

const dirPath = path.join(__dirname, "OneDriveSync","Documents");
const filePath = path.join(dirPath, "CodeTracker_Student_Registration.xlsx");

async function appendToExcel(student) {
  const workbook = new ExcelJS.Workbook();

  try {
    await workbook.xlsx.readFile(filePath);
    logger.info("[EXCEL] Loaded existing Excel file.");
  } catch (err) {
    logger.warn("[EXCEL] Excel file not found. Creating a new one.");
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
    student.dept_name,
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
  const specificSheetName = `${student.dept_name}-${student.year}-${student.section}`;
  let specificSheet = workbook.getWorksheet(specificSheetName);
  if (!specificSheet) {
    specificSheet = workbook.addWorksheet(specificSheetName);
    specificSheet.addRow(headers);
  }
  specificSheet.addRow(row);

  // ========== 3) Save and Touch for OneDrive ==========
  await workbook.xlsx.writeFile(filePath);
  workbook.removeWorksheet("temp"); // optional if used
global.gc?.(); // force cleanup if GC is available

  fs.utimesSync(filePath, new Date(), new Date()); // force OneDrive to detect change

  logger.info(`[EXCEL] Added student ${student.stdId} to Excel and updated timestamp.`);

  return true;
}

module.exports = appendToExcel;
