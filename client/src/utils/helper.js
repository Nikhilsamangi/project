
const importantCategories = [
  "Rent or Lease Payments",
  "Electricity Bill",
  "Salaries and Wages",
  "Insurance (Health, Liability, Property, Workers' Compensation)",
  "Legal and Accounting Fees",
  "Professional Services (Consulting, IT Support)",
  "Travel and Entertainment",
  "Training and Development",
  "Inventory",
  "Equipment and Technology",
  "Depreciation",
  "Loan Interest",
  "Taxes (Corporate, Payroll, Property)"
];

const commonCategories = [
  "Utilities (Water, Gas, Internet)",
  "Office Supplies (Stationery, Printer Ink, Paper)",
  "Maintenance and Repairs",
  "Advertising and Marketing",
  "Shipping and Delivery",
  "Bank Fees",
  "Subscriptions and Memberships",
  "Employee Benefits",
  "Miscellaneous Expenses",
  "Research and Development (R&D)",
  "Quality Control",
  "Licensing and Regulatory Fees"
];
export function calculateTotalAmount(expenses) {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
}



//to calculate avg expense
export function avgExpensePerCategory(expenses) {
  // Create a map to store the total amounts and counts per category
  const categorySums = {};
  const categoryCounts = {};

  expenses.forEach(expense => {
    const { category, amount } = expense;

    if (!categorySums[category]) {
      categorySums[category] = 0;
      categoryCounts[category] = 0;
    }

    categorySums[category] += amount;
    categoryCounts[category] += 1;
  });

  // Calculate the average for each category
  let totalAverage = 0;
  let categoriesCount = 0;

  for (const category in categorySums) {
    const categoryAverage = categorySums[category] / categoryCounts[category];
    totalAverage += categoryAverage;
    categoriesCount += 1;
  }

  // Calculate the overall average expense per category
  const overallAverage = totalAverage / categoriesCount;

  // Return the overall average without decimal points
  return Math.floor(overallAverage); // or Math.round(overallAverage)
}


//piedata
// List of important and common categories


export function generatePieData(expenses) {
  // Create a map to store the total amount per category
  const categoryTotals = {};
  // const otherTotal = 0;

  expenses.forEach(expense => {
    const { category, amount } = expense;

    if (importantCategories.includes(category) || commonCategories.includes(category)) {
      if (!categoryTotals[category]) {
        categoryTotals[category] = 0;
      }

      categoryTotals[category] += amount;
    } else {
      if (!categoryTotals['Other']) {
        categoryTotals['Other'] = 0;
      }

      categoryTotals['Other'] += amount;
    }
  });

  // Extract labels and data arrays
  const labels = Object.keys(categoryTotals);
  const data = Object.values(categoryTotals);

  // Define colors for the pie chart (example colors; adjust as needed)
  const backgroundColor = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)'
  ];
  
  const borderColor = [
    'rgba(255, 99, 132, 21)',
    'rgba(54, 162, 235, 21)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)'
  ];

  // Return pieData object
  return {
    labels,
    datasets: [
      {
        label: 'Expenses by Categories',
        data,
        backgroundColor: backgroundColor.slice(0, labels.length), // Adjust colors based on number of categories
        borderColor: borderColor.slice(0, labels.length), // Adjust colors based on number of categories
        borderWidth: 1,
      }
    ],
  };
}



export function generateLineData(expenses, startMonth = 0, endMonth = 11) {
  // Initialize the months and the expense data for each month
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthlyTotals = Array(12).fill(0); // Array to hold total expenses for each month

  // Process each expense
  expenses.forEach(expense => {
    const { date, amount } = expense;
    const expenseDate = new Date(date);
    const month = expenseDate.getMonth(); // Get the month (0-11)
    
    // Filter by month range
    if (month >= startMonth && month <= endMonth) {
      // Add the amount to the corresponding month
      monthlyTotals[month] += amount;
    }
  });

  // Create the lineData object
  const lineData = {
    labels: months,
    datasets: [
      {
        label: 'Total Expense',
        data: monthlyTotals,
        fill: false,
        backgroundColor: 'rgb(14, 73, 73)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  return lineData;
}

export function generateBarData(expenses) {
  // Initialize weeks and the expense data for each week
  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  const weeklyTotals = Array(4).fill(0); // Array to hold total expenses for each week

  // Helper function to determine the week number of the month
  const getWeekNumber = (date) => {
    const dayOfMonth = date.getDate();
    return Math.ceil(dayOfMonth / 7); // Week number based on 7 days per week
  };

  // Process each expense
  expenses.forEach(expense => {
    const { date, amount } = expense;
    const expenseDate = new Date(date);
    const weekNumber = getWeekNumber(expenseDate) - 1; // Convert to 0-based index

    if (weekNumber >= 0 && weekNumber < 4) {
      // Add the amount to the corresponding week
      weeklyTotals[weekNumber] += amount;
    }
  });

  // Create the barData object
  const barData = {
    labels: weeks,
    datasets: [
      {
        label: 'Expenses of Time Periods',
        data: weeklyTotals,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  return barData;
}
