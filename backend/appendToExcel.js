const getGraphClient = require("./excelClient");

async function appendToExcel(student) {
  const client = await getGraphClient();
  const filePath = "/Documents/CodeTracker_Student_Registration.xlsx";

  const row = [
    student.stdId, student.name, student.email, student.gender,
    student.degree, student.dept, student.year, student.section,
    student.leetcode, student.codechef, student.hackerrank, student.geeksforgeeks
  ];

  const masterSheet = "AllRegistrations";
  const tableName = "Table1";

  try {
    console.log("Adding to master sheet...");
    await client
      .api(`/drive/root:${filePath}:/workbook/worksheets('${masterSheet}')/tables('${tableName}')/rows/add`)
      .post({ values: [row] });
    console.log("Added to master sheet.");
  } catch (err) {
    console.error("Error adding to master sheet:", JSON.stringify(err, null, 2));
    throw err;
  }

  const specificSheet = `${student.dept}-${student.year}-${student.section}`;

  try {
    console.log(`Adding to specific sheet ${specificSheet}...`);
    await client
      .api(`/drive/root:${filePath}:/workbook/worksheets('${specificSheet}')/tables('${tableName}')/rows/add`)
      .post({ values: [row] });
    console.log(`Added to ${specificSheet}.`);
  } catch (err) {
    if (err.statusCode === 404) {
      console.log(`Sheet ${specificSheet} not found. Creating...`);
      try {
        await client
          .api(`/drive/root:${filePath}:/workbook/worksheets/add`)
          .post({ name: specificSheet });
        console.log(`Created sheet ${specificSheet}.`);

        await client
          .api(`/drive/root:${filePath}:/workbook/worksheets('${specificSheet}')/tables/add`)
          .post({
            address: "A1:L1",
            hasHeaders: true
          });
        console.log(`Created table in ${specificSheet}.`);

        await client
          .api(`/drive/root:${filePath}:/workbook/worksheets('${specificSheet}')/tables('${tableName}')/rows/add`)
          .post({ values: [row] });
        console.log(`Added data to new sheet ${specificSheet}.`);
      } catch (innerErr) {
        console.error(`Failed creating sheet/table or inserting data:`, JSON.stringify(innerErr, null, 2));
        throw innerErr;
      }
    } else {
      console.error(`Failed inserting into existing sheet:`, JSON.stringify(err, null, 2));
      throw err;
    }
  }
}

module.exports = appendToExcel;
