const express = require("express");
const cors = require("cors");
const { Client } = require("pg"); // Assuming you're using pg for PostgreSQL connection

// Setup database connection
const client = new Client({
    connectionString: process.env.DATABASE_URL, // or your DB config details
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect();

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint to fetch GainersMA
app.get("/api/gainersMA", async (req, res) => {
  try {
    const queryResult = await client.query("SELECT * FROM GainersMA ORDER BY current_rank");
    res.json(queryResult.rows);
  } catch (error) {
    console.error("Error fetching GainersMA:", error.stack);
    res.status(500).send("Internal Server Error");
  }
});

// Endpoint to fetch LosersMA
app.get("/api/losersMA", async (req, res) => {
  try {
    const queryResult = await client.query("SELECT * FROM LosersMA ORDER BY current_rank");
    res.json(queryResult.rows);
  } catch (error) {
    console.error("Error fetching LosersMA:", error.stack);
    res.status(500).send("Internal Server Error");
  }
});

// Combined Endpoint for Market Activity
app.get("/api/marketActivity", async (req, res) => {
  try {
    const gainersResult = await client.query("SELECT * FROM GainersMA ORDER BY current_rank");
    const losersResult = await client.query("SELECT * FROM LosersMA ORDER BY current_rank");
    res.json({
      gainers: gainersResult.rows,
      losers: losersResult.rows
    });
  } catch (error) {
    console.error("Error fetching market activity:", error.stack);
    res.status(500).send("Internal Server Error");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});
