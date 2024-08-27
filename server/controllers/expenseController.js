const multer = require('multer');
const csvtojson = require('csvtojson');
const Expense = require('../models/addExpenses'); // Adjust the path to your Expense model
const XLSX = require('xlsx');

const User = require('../models/userModel');
const BudgetLimit=require("../models/budgetLimit")
const ExcelJS = require('exceljs');
const { parse } = require('csv-parse/sync');

const { Parser } = require('json2csv');

const upload = multer({ storage: multer.memoryStorage() });

const csvParser = require('csv-parser'); // Install csv-parser with npm or yarn
const { Readable } = require('stream');

const parseCSV = async (buffer) => {
  try {
    const results = [];
    const stream = Readable.from(buffer.toString());

    await new Promise((resolve, reject) => {
      stream
        .pipe(csvParser())
        .on('data', (row) => {
          results.push({
            date: row.date,
            amount: parseFloat(row.amount),
            payee: row.payee,
            description: row.description,
            category: row.category,
            receipt: row.receipt === '' ? null : row.receipt,
            added_by: row.added_by,
            // createdAt: row.createdAt,
            // updatedAt: row.updatedAt
          });
        })
        .on('end', resolve)
        .on('error', reject);
    });

    return results;
  } catch (error) {
    console.log(error)
    throw new Error('Error parsing CSV file: ' + error.message);
  }
};

const parseExcel = async (buffer) => {
  try {
    // Load workbook
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]; // Assuming data is in the first sheet
    const jsonArray = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    

    const parseAmount = (amountString) => {
      const amount = parseFloat(amountString);
      return isNaN(amount) ? null : amount;
    };

    return jsonArray.slice(1).map((row, index) => {
      if (!row[0] || !row[1]) {
        console.error(`Missing data in row ${index + 2}`);
        return null;
      }
      return {
        date:row[0],
        amount: parseAmount(row[1]),
        payee: row[2],
        description: row[3],
        category: row[4],
        receipt: row[5] === 'null' || row[5] === '' ? null : row[5],
        added_by: row[6],
      };
    }).filter(row => row !== null);
  } catch (error) {
    throw new Error('Error parsing Excel file: ' + error.message);
  }
};


const importExpenses = async (req, res) => {
  const file = req.files?.[0] // Assuming single file upload
  const userId = req.user.id;
  
  if (!file) {
    return res.status(400).json({ message: 'Please upload a file' });
  }

  let jsonArray;

  try {
    if (file.mimetype === 'text/csv') {
      jsonArray = await parseCSV(file.buffer);
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.mimetype === 'application/vnd.ms-excel') {
      jsonArray = await parseExcel(file.buffer);
    } else {
      return res.status(400).json({ message: 'Unsupported file format' });
    }

    
     // Validate and transform data
     const expenses = jsonArray.map(expense => {
      if (!expense.date || !expense.amount) {
        throw new Error('Invalid data: missing date or amount');
      }
      return {
        userId: userId,
        date: expense.date,
        amount: expense.amount,
        payee: expense.payee,
        description: expense.description,
        category: expense.category,
        receipt: expense.receipt === 'null' || expense.receipt === '' ? null : expense.receipt,
        added_by: expense.added_by,
       
      };
    });

    // Insert expenses into the database
    await Expense.insertMany(expenses);

    res.status(200).json({ message: 'Expenses imported successfully' });
  } catch (error) {
    console.error('Error importing expenses:', error);
    res.status(500).json({ message: 'Failed to import expenses', error: error.message });
  }
};


const exportData = async (req, res) => {
 
  const userId = req.user.id;
  const userRole = req.user.role
  // Function to format date
  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  try {
    const { format, startDate, endDate } = req.query; // Retrieve format and date range from query parameters

    // Validate date parameters
    if (!startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'Start date and end date are required' });
    }

    // Convert date strings to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid date format' });
    }

    // Fetch all expense data and filter by date range
    let queryConditions = {
      date: {
        $gte: start,
        $lte: end,
      },
    };

    if (userRole === 'employee') {
      queryConditions.userId = userId; // Only fetch data for the logged-in user if they are an employee
    }
     // Fetch expense data based on query conditions
     const ExpenseData = await Expense.find(queryConditions);
    const users = ExpenseData.map(element => ({
      date: formatDate(element.date),
      amount: element.amount,
      payee: element.payee,
      description: element.description,
      category: element.category,
      receipt: element.receipt,
      added_by: element.added_by,
    }));

    if (format === 'csv') {
      // Convert data to CSV
      const csvFields = ["date", "amount", "payee", "description", "category", "receipt", "added_by"];
      const json2csvParser = new Parser({ fields: csvFields });
      const csvData = json2csvParser.parse(users);

      // Set headers for CSV download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment;filename=expenses.csv');
      res.status(200).send(csvData);

    } else if (format === 'excel') {
      // Convert data to Excel
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Expenses');

      // Define columns
      worksheet.columns = [
        { header: 'date', key: 'date', width: 15 },
        { header: 'amount', key: 'amount', width: 15 },
        { header: 'payee', key: 'payee', width: 20 },
        { header: 'description', key: 'description', width: 30 },
        { header: 'category', key: 'category', width: 20 },
        { header: 'receipt', key: 'receipt', width: 15 },
        { header: 'added By', key: 'added_by', width: 15 },
      ];

      // Add rows to worksheet
      users.forEach(user => {
        worksheet.addRow(user);
      });

      // Set headers for Excel download
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=expenses.xlsx');

      // Send the Excel file
      await workbook.xlsx.write(res);
      res.send();

    } else {
      res.status(400).json({ success: false, message: 'Invalid format specified' });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const userExpenses = async (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;

  // Function to format date
  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  try {
    const { startDate, endDate } = req.query; // Retrieve date range from query parameters

    // Determine query conditions based on presence of date parameters and user role
    let queryConditions = {};

    if (startDate && endDate) {
      // Validate date parameters
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({ success: false, message: 'Invalid date format' });
      }

      // Set date range filter
      queryConditions.date = {
        $gte: start,
        $lte: end,
      };
    }

    // Apply user-specific filter if the user is an employee
    if (userRole === 'employee') {
      queryConditions.userId = userId; // Only fetch data for the logged-in user if they are an employee
    }

    // Fetch expense data based on query conditions
    const ExpenseData = await Expense.find(queryConditions);
    const users = ExpenseData.map(element => ({
      date: formatDate(element.date),
      amount: element.amount,
      payee: element.payee,
      description: element.description,
      category: element.category,
      receipt: element.receipt,
      added_by: element.added_by,
    }));

    // Return data as JSON response
    res.status(200).json({ success: true, data: users });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
const setBudgetLimit = async (req, res) => {
  const { limit } = req.body;
  const userId = req.user.id; // Assuming user ID is stored in req.user

  try {
    // Validate user existence
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Find or create budget limit entry
    let budget = await BudgetLimit.findOne({ user: userId });
    if (budget) {
      budget.limit = limit;
    } else {
      budget = new BudgetLimit({ user: userId, limit });
    }
    
    await budget.save();
    res.status(200).json({ message: 'Budget limit updated successfully.' });
  } catch (error) {
    console.error('Error setting budget limit:', error);
    res.status(500).json({ message: 'Failed to update budget limit.' });
  }
};

// Function to check if expenses exceed the limit and send notifications
const checkBudgetLimit = async (totalExpenses, userId) => {
  try {
    const budget = await BudgetLimit.findOne({ user: userId });
    
    if (budget && totalExpenses > budget.limit) {
      const message = `Expense limit exceeded! Your limit is ${budget.limit}, and your expenses are ${totalExpenses}.`;
      budget.notifications.push({ message });
      await budget.save();
      
      // Implement notification logic as needed (e.g., email, in-app notification)
      console.log(message);
    }
  } catch (error) {
    console.error('Error checking budget limit:', error);
  }
};

// Export functions to be used in routes
module.exports = {
  importExpenses,
  
  exportData,
  userExpenses,
  setBudgetLimit,
  checkBudgetLimit,
};


