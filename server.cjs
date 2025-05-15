const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Mock data generator functions
const generateMockVesselCount = (dayDate, vesselType) => {
  return [
    {
      DAYDATE: dayDate,
      VESSELTYPE: vesselType,
      VESSELCLASS: 'Panamax',
      CURRENTAREANAMELEVEL0: 'Pacific',
      VESSEL_COUNT: Math.floor(Math.random() * 100) + 200
    },
    {
      DAYDATE: new Date(new Date(dayDate).getTime() - 86400000).toISOString().split('T')[0],
      VESSELTYPE: vesselType,
      VESSELCLASS: 'Panamax',
      CURRENTAREANAMELEVEL0: 'Pacific',
      VESSEL_COUNT: Math.floor(Math.random() * 100) + 200
    }
  ];
};

const generateMockBalticRate = (dayDate, vesselType) => {
  const routeId = vesselType === 'Dry' ? 'C5' : 'TD25';
  return [
    {
      RATEDATE: dayDate,
      ROUTEID: routeId,
      RATE: Math.floor(Math.random() * 1000) + 5000,
      VESSELTYPE: vesselType,
      VESSELCLASS: 'Panamax'
    },
    {
      RATEDATE: new Date(new Date(dayDate).getTime() - 86400000).toISOString().split('T')[0],
      ROUTEID: routeId,
      RATE: Math.floor(Math.random() * 1000) + 5000,
      VESSELTYPE: vesselType,
      VESSELCLASS: 'Panamax'
    }
  ];
};

const generateMockCongestionData = (dayDate, portName, vesselType) => {
  return [
    {
      DAYDATE: dayDate,
      VESSELTYPE: vesselType,
      VESSELCLASS: 'Panamax',
      PORTNAME: portName,
      CONGESTEDVESSELS: Math.floor(Math.random() * 20) + 10
    },
    {
      DAYDATE: new Date(new Date(dayDate).getTime() - 86400000).toISOString().split('T')[0],
      VESSELTYPE: vesselType,
      VESSELCLASS: 'Panamax',
      PORTNAME: portName,
      CONGESTEDVESSELS: Math.floor(Math.random() * 20) + 10
    }
  ];
};

const generateMockTonnageSupply = (dayDate, vesselType, portName) => {
  return [
    {
      DAYDATE: dayDate,
      VESSELTYPE: vesselType,
      VESSELCLASS: 'Panamax',
      PORTNAME: portName,
      SUPPLY: Math.floor(Math.random() * 50) + 30
    },
    {
      DAYDATE: new Date(new Date(dayDate).getTime() - 86400000).toISOString().split('T')[0],
      VESSELTYPE: vesselType,
      VESSELCLASS: 'Panamax',
      PORTNAME: portName,
      SUPPLY: Math.floor(Math.random() * 50) + 30
    }
  ];
};

const generateMockVoyagesDemand = (dayDate, vesselType, areaName) => {
  return [
    {
      DAYDATE: dayDate,
      VESSELTYPE: vesselType,
      VESSELCLASS: 'Panamax',
      AREANAME: areaName,
      DEMAND: Math.floor(Math.random() * 100000) + 50000
    },
    {
      DAYDATE: new Date(new Date(dayDate).getTime() - 86400000).toISOString().split('T')[0],
      VESSELTYPE: vesselType,
      VESSELCLASS: 'Panamax',
      AREANAME: areaName,
      DEMAND: Math.floor(Math.random() * 100000) + 50000
    }
  ];
};

// API endpoints
app.get('/api/vessel-count', (req, res) => {
  const { dayDate, vesselType } = req.query;
  res.json(generateMockVesselCount(dayDate, vesselType));
});

app.get('/api/baltic-rate', (req, res) => {
  const { dayDate, vesselType } = req.query;
  res.json(generateMockBalticRate(dayDate, vesselType));
});

app.get('/api/congestion-vessel-count', (req, res) => {
  const { dayDate, portName, vesselType } = req.query;
  res.json(generateMockCongestionData(dayDate, portName, vesselType));
});

app.get('/api/congestion-port-days', (req, res) => {
  const { dayDate, portName, vesselType } = req.query;
  res.json(generateMockCongestionData(dayDate, portName, vesselType));
});

app.get('/api/tonnage-supply', (req, res) => {
  const { dayDate, vesselType, portName } = req.query;
  res.json(generateMockTonnageSupply(dayDate, vesselType, portName));
});

app.get('/api/voyages-demand', (req, res) => {
  const { dayDate, vesselType, areaName } = req.query;
  res.json(generateMockVoyagesDemand(dayDate, vesselType, areaName));
});

// New endpoint for generating insights with logging
app.post('/api/generate-insights', async (req, res) => {
  const { metrics } = req.body;
  
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You're a savvy shipping analyst with a knack for spotting trends. Keep it super brief and snappy but funny - one line per insight - bullet! Use industry lingo naturally, and focus on what matters to charterers and owners. Think tweet-length insights that pack a punch. No titles"
        },
        {
          role: "user",
          content: `What's the quick scoop on these shipping metrics? Give me 2-3 quick hits:\n${JSON.stringify(metrics, null, 2)}`
        }
      ],
      temperature: 0.7,
      max_tokens: 250
    });

    const insights = completion.choices[0].message.content
      .split('\n')
      .filter(insight => insight.trim().length > 0);

    res.json({ insights });
  } catch (error) {
    console.error('OpenAI API Error:', {
      message: error.message,
      response: error.response?.data,
      stack: error.stack
    });
    res.status(500).json({ error: 'Failed to generate insights' });
  }
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Mock server running on port ${PORT}`));