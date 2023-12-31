const { readdirSync } = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5005;

// Database
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
  })
  .then(() => console.log('DB connected successfully!'))
  .catch((error) => console.log('DB connection error: ', error));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

// Routes
readdirSync('./routes').map((r) => {
  app.use('/', require(`./routes/${r}`));
});

// Start server
app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
