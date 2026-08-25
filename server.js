const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "Bangalore Pincode Explorer API is running",
    status: "success",
  });
});

// Search by pincode
app.get("/api/pincode/:pincode", async (req, res) => {
  try {
    const { pincode } = req.params;

    if (!/^\d{6}$/.test(pincode)) {
      return res.status(400).json({
        status: "error",
        message: "Pincode must be exactly 6 digits",
      });
    }

    const response = await fetch(
      `https://api.postalpincode.in/pincode/${pincode}`
    );

    const data = await response.json();

    if (
      !data ||
      !data[0] ||
      data[0].Status !== "Success"
    ) {
      return res.status(404).json({
        status: "error",
        message: "No post offices found",
      });
    }

    res.json({
      status: "success",
      data: data[0].PostOffice || [],
    });
  } catch (error) {
    console.error("Pincode API error:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to fetch postal information",
    });
  }
});

// Search by area name
app.get("/api/postoffice/:area", async (req, res) => {
  try {
    const { area } = req.params;

    if (!area || area.trim().length < 2) {
      return res.status(400).json({
        status: "error",
        message: "Please provide a valid area name",
      });
    }

    const response = await fetch(
      `https://api.postalpincode.in/postoffice/${encodeURIComponent(
        area
      )}`
    );

    const data = await response.json();

    if (
      !data ||
      !data[0] ||
      data[0].Status !== "Success"
    ) {
      return res.status(404).json({
        status: "error",
        message: "No post offices found",
      });
    }

    res.json({
      status: "success",
      data: data[0].PostOffice || [],
    });
  } catch (error) {
    console.error("Area API error:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to fetch postal information",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});