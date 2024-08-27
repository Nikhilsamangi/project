const express = require('express');
const router = express.Router();
const { registerUser, loginUser, currentUser ,addExpenses,allEmployee,updateRole,getUser} = require('../controllers/userController');
const validateToken = require('../middleware/validateTokenHandler');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/current', validateToken, currentUser);
router.get('/employees',validateToken,allEmployee)
router.put('/:id/role',validateToken, updateRole);
router.post("/expense",validateToken,addExpenses);
router.get("/:id/user",validateToken,getUser)


module.exports = router;
