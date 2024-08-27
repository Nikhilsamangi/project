const express = require('express');
const { importExpenses , setBudgetLimit,exportData,userExpenses} = require('../controllers/expenseController'); 
const validateToken = require('../middleware/validateTokenHandler');


const router = express.Router();


router.post('/import', validateToken, importExpenses);
// router.get('/export', validateToken, exportExpenses)
router.get('/export', validateToken, exportData)

router.get("/userExpenses",validateToken,userExpenses)
router.post('/setBudgetLimit', validateToken, setBudgetLimit);

// Route to manually check if the budget limit is exceeded
router.post('/checkBudgetLimit', validateToken, async (req, res) => {
  const { totalExpenses } = req.body;
  const userId = req.user.id;
  
  try {
    await checkBudgetLimit(totalExpenses, userId);
    res.status(200).json({ message: 'Budget limit checked successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to check budget limit.' });
  }
});

module.exports = router;
