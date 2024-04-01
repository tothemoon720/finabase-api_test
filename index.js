process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const express = require("express");
const client = require("./db");
const cors = require("cors"); // Add this line to import the 'cors' package

const app = express();
app.use(express.json()); // Add this line to parse JSON data in requests

// Add the cors middleware to allow access from any origin
app.use(cors());

// Database connection
client.connect((err, client) => {
  if (err) throw err;
  console.log("Connected to the database!");
});

// API endpoint for retrieving Gainers
app.get("/api/gainers", async (req, res) => {
  try {
    // Fetch data from Gainers table
    const gainersResult = await client.query("SELECT * FROM Gainers");

    // Send the data as JSON
    res.json(gainersResult.rows);
  } catch (err) {
    console.error("Error fetching Gainers data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API endpoint for retrieving GainersMA
app.get("/api/gainersMA", async (req, res) => {
  try {
    // Fetch data from Gainers table
    const gainersResult = await client.query(
      "SELECT * FROM MA WHERE real_change>=0 ORDER BY real_change DESC"
    );

    // Send the data as JSON
    res.json(gainersResult.rows);
  } catch (err) {
    console.error("Error fetching GainersMA data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API endpoint for retrieving GainersMA
app.get("/api/losersMA", async (req, res) => {
  try {
    // Fetch data from Gainers table
    const gainersResult = await client.query(
      "SELECT * FROM MA WHERE real_change<0 ORDER BY real_change"
    );

    // Send the data as JSON
    res.json(gainersResult.rows);
  } catch (err) {
    console.error("Error fetching GainersMA data:", err);
    res.status(500).json({ error: "Internal Server Error" });
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


// Combined API endpoint for retrieving both GainersMA and LosersMA
app.get("/api/marketActivity", async (req, res) => {
  try {
    // Fetch gainers data from MA table
    const gainersResult = await client.query(
      "SELECT * FROM MA WHERE real_change>=0 ORDER BY real_change DESC"
    );
    const gainers = gainersResult.rows;

    // Fetch losers data from MA table
    const losersResult = await client.query(
      "SELECT * FROM MA WHERE real_change<0 ORDER BY real_change"
    );
    const losers = losersResult.rows;

    // Send both gainers and losers data as JSON
    res.json({ gainers, losers });
  } catch (err) {
    console.error("Error fetching market activity data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Start the server
const port = 3000; // Adjust the port number as needed
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
