const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors'); 
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Enable CORS if frontend and backend are on different origins
app.use(express.json());

// Route to fetch weather data
app.get('/weather', async (req, res) => {
  const city = req.query.city; // Get city name from query parameters
  const apiKey = process.env.OPENWEATHER_API_KEY; 
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey
}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (response.ok) {
      res.json({
        city: data.name,
        temperature: data.main.temp,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
      });
    } else {
      res.status(400).json({ error: data.message });
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
