const express = require("express");
const client = require("./db");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Database connection
client.connect(err => {
  if (err) throw err;
  console.log("Connected to the database!");
});

// API endpoints
app.get("/api/gainers", async (req, res) => {
  try {
    const gainersResult = await client.query("SELECT * FROM Gainers");
    res.json(gainersResult.rows);
  } catch (err) {
    console.error("Error fetching Gainers data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

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
// API endpoint for retrieving Losers
app.get("/api/losers", async (req, res) => {
  try {
    // Fetch data from Losers table
    const losersResult = await client.query("SELECT * FROM Losers");

    // Send the data as JSON
    res.json(losersResult.rows);
  } catch (err) {
    console.error("Error fetching Losers data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



// Start the server
const port = 3000; // Adjust the port number as needed
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});


