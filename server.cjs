const express = require('express');
const cors = require('cors');
const snowflake = require('snowflake-sdk');
const fs = require('fs');
const path = require('path');

const app = express();

// Configure CORS with specific options
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:4173'], // Allow both dev and preview
  methods: ['GET'],
  credentials: true
}));

// Configure Snowflake logging
snowflake.configure({
  logLevel: 'DEBUG',
  logPath: path.join(__dirname, 'snowflake.log')
});

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

app.get('/api/vessel-count', (req, res) => {
  console.log('Received request for vessel-count');
  
  const connection = snowflake.createConnection({
    account: 'signal-warehouse.eu-central-1',
    username: 'EVANGELOSDERVISIS',
    password: 'Cga4fzBLs3sMjD5',
    warehouse: 'DEVELOP_WH',
    database: 'DW_DATAMAX',
    schema: 'DATA',
    clientSessionKeepAlive: true,
    validateDefaultParameters: true
  });

  connection.connect((err, conn) => {
    if (err) {
      console.error('Snowflake connection error:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    
    console.log('Connected to Snowflake successfully');
    
    const sql = `
      select DAYDATE, VESSELTYPE, VESSELCLASS, currentareanamelevel0, count(IMO) as vessel_count
      from DW_DATAMAX.DATA.VESSEL_COUNT
      where DAYDATE >= '2025-05-01' and VESSELCLASS <> 'Small' and vesseltypeid=1
      group by DAYDATE, VESSELTYPE, VESSELCLASS, currentareanamelevel0
      order by VESSELTYPE, VESSELCLASS, currentareanamelevel0, DAYDATE
    `;
    
    connection.execute({
      sqlText: sql,
      complete: (err, stmt, rows) => {
        if (err) {
          console.error('Snowflake query error:', err);
          res.status(500).json({ error: err.message });
        } else {
          console.log(`Query completed successfully, returned ${rows?.length || 0} rows`);
          res.json(rows);
        }
        connection.destroy((err) => {
          if (err) {
            console.error('Error destroying connection:', err);
          }
        });
      }
    });
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Allowed origins:', ['http://localhost:5173', 'http://localhost:4173']);
});