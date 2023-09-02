const { readdirSync } = require('fs');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5005;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
readdirSync('./routes').map((r) => {
  app.use('/api', require(`./routes/${r}`));
});

// Start server
app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
