const express = require('express');
const { errorHandler } = require('./middleware/errorHandler');

const connectDb = require('./config/dbConnection');
const dotenv = require("dotenv").config()
const app = express();
const multer = require('multer');
app.use(multer().any())
const cors = require('cors');
app.use(cors());
app.use(express.json());


const port = process.env.PORT || 5000;



app.use("/api/users",require("./routes/userRoutes"))
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use(errorHandler)

app.listen(port, () =>
  console.log(`listening on http://localhost:${port}`)
);

connectDb()