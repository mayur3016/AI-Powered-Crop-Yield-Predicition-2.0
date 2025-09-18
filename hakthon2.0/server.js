const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Serve static files (HTML, CSS, etc.) from the project directory
// This allows you to run the whole app from http://localhost:5000
app.use(express.static(__dirname));

// Chat Bot Endpoint
app.post('/chat', (req, res) => {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required.' });
    }
    // TODO: Replace with real AI logic. This is a simple keyword-based mock response.
    const lowerCaseMessage = message.toLowerCase();
    let reply;

    if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi')) {
        reply = "Hello! How can I help you with crop yield information today?";
    } else if (lowerCaseMessage.includes('yield') || lowerCaseMessage.includes('predict')) {
        reply = "You can get a crop yield prediction on our 'Prediction' page.";
    } else if (lowerCaseMessage.includes('about')) {
        reply = "We are AI Crop Yield, a project to help farmers estimate their crop yields using modern technology.";
    } else {
        reply = "I'm a demo bot. I don't have real AI capabilities yet. You said: " + message;
    }
    res.json({ reply });
});

// Prediction Endpoint
app.post('/predict', async (req, res) => {
    const { crop, area, soil, rain, fertilizer } = req.body;
    const areaNum = Number(area);
    const rainNum = Number(rain);
    const fertilizerNum = Number(fertilizer);

    if (
        !crop || !soil ||
        isNaN(areaNum) || isNaN(rainNum) || isNaN(fertilizerNum) ||
        areaNum <= 0 || rainNum < 0 || fertilizerNum < 0
    ) {
        return res.status(400).json({ error: 'All fields are required. Numeric inputs must be valid and non-negative.' });
    }

    // Simulate model processing time to make it feel more realistic
    await new Promise(resolve => setTimeout(resolve, 750));

    // This is a mock formula using all inputs to simulate a more realistic prediction.
    const cropFactors = { 'Wheat': 1.1, 'Corn': 1.3, 'Rice': 1.2, 'Soybean': 1.0 };
    const soilFactors = { 'Loam': 1.1, 'Clay': 0.9, 'Sandy': 0.8, 'Silt': 1.0 };

    // Format inputs to match keys (e.g., 'wheat' becomes 'Wheat')
    const formattedCrop = crop.charAt(0).toUpperCase() + crop.slice(1).toLowerCase();
    const formattedSoil = soil.charAt(0).toUpperCase() + soil.slice(1).toLowerCase();

    const cropFactor = cropFactors[formattedCrop] || 1.0;
    const soilFactor = soilFactors[formattedSoil] || 1.0;

    // Simulate a more complex interaction between variables
    const baseYield = areaNum * cropFactor * soilFactor;
    const rainEffect = (rainNum / 500); // Assuming 500mm is a baseline
    const fertilizerEffect = fertilizerNum * 0.05;

    let estimatedYield = (baseYield + rainEffect + fertilizerEffect + (Math.random() * 0.5));
    estimatedYield = Math.max(0, estimatedYield).toFixed(2);

    res.json({
        result: `Estimated Yield: ${estimatedYield} tons per hectare`,
        chartData: {
            yourField: estimatedYield,
            avgRegion: (estimatedYield * 0.85 + Math.random() * 0.1).toFixed(2) // Simulate regional average
        }
    });
});

// Health check endpoint
app.get('/', (req, res) => {
    res.send('AI Crop Yield Backend is running!');
});

// Error handler (optional, for catching unexpected errors)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});