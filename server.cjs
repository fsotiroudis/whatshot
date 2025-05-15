const express = require('express');
const cors = require('cors');
const snowflake = require('snowflake-sdk');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get('/api/vessel-count', (req, res) => {
  const dayDate = req.query.dayDate || '2025-04-01';
  const vesselType = req.query.vesselType || 'Tanker';

  const connection = snowflake.createConnection({
    account: 'SIGNAL-WAREHOUSE',
    username: 'EVANGELOSDERVISIS',
    password: 'Cga4fzBLs3sMjD5',
    warehouse: 'DEVELOP_WH',
    database: 'DW_DATAMAX',
    schema: 'DATA',
  });

  connection.connect((err, conn) => {
    if (err) {
      console.error('Connection error:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    const sql = `
      select DAYDATE, VESSELTYPE, VESSELCLASS, CURRENTAREANAMELEVEL0, count(IMO) as VesselCount
      from DW_DATAMAX.DATA.VESSEL_COUNT 
      where DAYDATE >= ? 
        and VESSELCLASSID = CASE 
          WHEN ? = 'Tanker' THEN 86
          WHEN ? = 'Dry' THEN 70
          ELSE VESSELCLASSID
        END
        and CURRENTAREANAMELEVEL0 = CASE 
          WHEN ? = 'Tanker' THEN 'US Gulf'
          WHEN ? = 'Dry' THEN 'Australia West'
          ELSE CURRENTAREANAMELEVEL0
        END
      group by DAYDATE, VESSELTYPE, VESSELCLASS, CURRENTAREANAMELEVEL0
      order by VESSELTYPE, VESSELCLASS, CURRENTAREANAMELEVEL0, DAYDATE
    `;
    const binds = [dayDate, vesselType, vesselType, vesselType, vesselType];
    console.log('Vessel Count SQL:', sql);
    console.log('Vessel Count Binds:', binds);
    connection.execute({
      sqlText: sql,
      binds,
      complete: (err, stmt, rows) => {
        if (err) {
          console.error('Query error:', err);
          res.status(500).json({ error: err.message });
        } else {
          res.json(rows);
        }
        connection.destroy();
      }
    });
  });
});

app.get('/api/baltic-rate', (req, res) => {
  const dayDate = req.query.dayDate || '2025-04-01';
  const vesselType = req.query.vesselType || 'Tanker';

  const connection = snowflake.createConnection({
    account: 'SIGNAL-WAREHOUSE',
    username: 'EVANGELOSDERVISIS',
    password: 'Cga4fzBLs3sMjD5',
    warehouse: 'DEVELOP_WH',
    database: 'DW_DATAMAX',
    schema: 'DATA',
  });

  connection.connect((err, conn) => {
    if (err) {
      console.error('Connection error:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    const sql = `
      SELECT 
        vc.VESSELTYPE,
        vc.VESSELCLASS,
        ROUTEID,
        RATEDATE,
        RATE
      FROM DW_DATAMAX.DATA.BALTIC_RATES br
      LEFT JOIN DW_DATAMAX.DATA.VESSEL_CLASSES vc ON br.VESSELCLASSID = vc.VESSELCLASSID
      WHERE 
        VESSELTYPE = ?
        AND ROUTEID = CASE 
          WHEN ? = 'Tanker' THEN 'TD25'
          WHEN ? = 'Dry' THEN 'C5'
          ELSE ROUTEID
        END
        AND RATEDATE >= ?
      ORDER BY 
        vc.VESSELTYPE,
        vc.VESSELCLASS,
        ROUTEID,
        RATEDATE`;
    
    const binds = [vesselType, vesselType, vesselType, dayDate];
    console.log('Baltic Rate SQL:', sql);
    console.log('Baltic Rate Binds:', binds);
    connection.execute({
      sqlText: sql,
      binds,
      complete: (err, stmt, rows) => {
        if (err) {
          console.error('Query error:', err);
          res.status(500).json({ error: err.message });
        } else {
          res.json(rows);
        }
        connection.destroy();
      }
    });
  });
});

app.get('/api/congestion-vessel-count', (req, res) => {
  const dayDate = req.query.dayDate || '2025-04-01';
  const vesselType = req.query.vesselType || 'Tanker';

  const connection = snowflake.createConnection({
    account: 'SIGNAL-WAREHOUSE',
    username: 'EVANGELOSDERVISIS',
    password: 'Cga4fzBLs3sMjD5',
    warehouse: 'DEVELOP_WH',
    database: 'DW_DATAMAX',
    schema: 'DATA',
  });

  connection.connect((err, conn) => {
    if (err) {
      console.error('Connection error:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    const sql = `
      select DAYDATE, vc.VESSELTYPE, c.VESSELCLASS, PORTNAME, count(IMO) as CongestedVessels
      from DW_DATAMAX.DATA.CONGESTION_VESSEL_COUNT c
      left join DW_DATAMAX.DATA.VESSEL_CLASSES vc on c.VESSELCLASSID = vc.VESSELCLASSID
      where DAYDATE >= ? 
        and c.VESSELCLASSID = CASE 
          WHEN ? = 'Tanker' THEN 86
          WHEN ? = 'Dry' THEN 70
          ELSE c.VESSELCLASSID
        END
        and PORTNAME = CASE 
          WHEN ? = 'Tanker' THEN 'Rotterdam'
          WHEN ? = 'Dry' THEN 'Qingdao'
          ELSE PORTNAME
        END
      group by DAYDATE, vc.VESSELTYPE, c.VESSELCLASS, PORTNAME
      order by vc.VESSELTYPE, c.VESSELCLASS, PORTNAME, DAYDATE
    `;
    const binds = [dayDate, vesselType, vesselType, vesselType, vesselType];
    console.log('Congestion Vessel Count SQL:', sql);
    console.log('Congestion Vessel Count Binds:', binds);
    connection.execute({
      sqlText: sql,
      binds,
      complete: (err, stmt, rows) => {
        if (err) {
          console.error('Query error:', err);
          res.status(500).json({ error: err.message });
        } else {
          res.json(rows);
        }
        connection.destroy();
      }
    });
  });
});

app.get('/api/tonnage-supply', (req, res) => {
  const dayDate = req.query.dayDate || '2025-04-01';
  const vesselType = req.query.vesselType || 'Tanker';

  const connection = snowflake.createConnection({
    account: 'SIGNAL-WAREHOUSE',
    username: 'EVANGELOSDERVISIS',
    password: 'Cga4fzBLs3sMjD5',
    warehouse: 'DEVELOP_WH',
    database: 'DW_DATAMAX',
    schema: 'DATA',
  });

  connection.connect((err, conn) => {
    if (err) {
      console.error('Connection error:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    const sql = `
      select tl.DAYDATE, v.VESSELTYPE, v.VESSELCLASS, p.NAME as PORTNAME, count(tla.IMO) as Supply
      from DW_DATAMAX.DATA.TONNAGE_LIST_AVAILABILITY tl
      left join DW_DATAMAX.DATA.TONNAGE_LIST_AVAILABILITY_ETA tla on tl.IMO = tla.IMO and tl.DAYDATE = tla.DAYDATE
      left join DW_DATAMAX.DATA.VESSELS v on tl.IMO = v.IMO
      left join DW_DATAMAX.DATA.PORTS p on tla.PORTID = p.PORTID
      where tl.DAYDATE >= ? 
        and VESSELCLASSID = CASE 
          WHEN ? = 'Tanker' THEN 86
          WHEN ? = 'Dry' THEN 70
          ELSE VESSELCLASSID
        END
        and DATEDIFF(day, tla.DAYDATE, tla.ETAFROMOPENPOSITION) < CASE 
          WHEN ? = 'Tanker' THEN 10
          WHEN ? = 'Dry' THEN 15
          ELSE 10
        END
        and p.NAME = CASE 
          WHEN ? = 'Tanker' THEN 'Houston'
          WHEN ? = 'Dry' THEN 'Port Hedland'
          ELSE p.NAME
        END
      group by tl.DAYDATE, v.VESSELTYPE, v.VESSELCLASS, p.NAME
      order by v.VESSELTYPE, VESSELCLASS, NAME, DAYDATE
    `;
    const binds = [dayDate, vesselType, vesselType, vesselType, vesselType, vesselType, vesselType];
    console.log('Tonnage Supply SQL:', sql);
    console.log('Tonnage Supply Binds:', binds);
    connection.execute({
      sqlText: sql,
      binds,
      complete: (err, stmt, rows) => {
        if (err) {
          console.error('Query error:', err);
          res.status(500).json({ error: err.message });
        } else {
          res.json(rows);
        }
        connection.destroy();
      }
    });
  });
});

app.get('/api/voyages-demand', (req, res) => {
  const dayDate = req.query.dayDate || '2025-04-01';
  const vesselType = req.query.vesselType || 'Tanker';

  const connection = snowflake.createConnection({
    account: 'SIGNAL-WAREHOUSE',
    username: 'EVANGELOSDERVISIS',
    password: 'Cga4fzBLs3sMjD5',
    warehouse: 'DEVELOP_WH',
    database: 'DW_DATAMAX',
    schema: 'DATA',
  });

  connection.connect((err, conn) => {
    if (err) {
      console.error('Connection error:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    const sql = `
      select cast(FIRSTLOADARRIVALDATE as date) as DAYDATE, VESSELTYPE, VESSELCLASS, FIRSTLOADPORTLEVEL0AREANAME as AREANAME, sum(QUANTITY) as Demand
      from DW_DATAMAX.DATA.VOYAGES_CONDENSED
      where FIRSTLOADARRIVALDATE between ? and SYSDATE() 
        and VESSELCLASSID = CASE 
          WHEN ? = 'Tanker' THEN 86
          WHEN ? = 'Dry' THEN 70
          ELSE VESSELCLASSID
        END
        and FIRSTLOADPORTLEVEL0AREANAME = CASE 
          WHEN ? = 'Tanker' THEN 'US Gulf'
          WHEN ? = 'Dry' THEN 'Australia West'
          ELSE FIRSTLOADPORTLEVEL0AREANAME
        END
      group by DAYDATE, VESSELTYPE, VESSELCLASS, FIRSTLOADPORTLEVEL0AREANAME
      order by VESSELTYPE, VESSELCLASS, FIRSTLOADPORTLEVEL0AREANAME, DAYDATE
    `;
    const binds = [dayDate, vesselType, vesselType, vesselType, vesselType];
    console.log('Voyages Demand SQL:', sql);
    console.log('Voyages Demand Binds:', binds);
    connection.execute({
      sqlText: sql,
      binds,
      complete: (err, stmt, rows) => {
        if (err) {
          console.error('Query error:', err);
          res.status(500).json({ error: err.message });
        } else {
          res.json(rows);
        }
        connection.destroy();
      }
    });
  });
});

app.get('/api/congestion-port-days', (req, res) => {
  const dayDate = req.query.dayDate || '2025-04-01';
  const vesselType = req.query.vesselType || 'Tanker';

  const connection = snowflake.createConnection({
    account: 'SIGNAL-WAREHOUSE',
    username: 'EVANGELOSDERVISIS',
    password: 'Cga4fzBLs3sMjD5',
    warehouse: 'DEVELOP_WH',
    database: 'DW_DATAMAX',
    schema: 'DATA',
  });

  connection.connect((err, conn) => {
    if (err) {
      console.error('Connection error:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    const sql = `
      select DAYDATE, VESSELTYPE, pd.VESSELCLASS, PORTNAME, count(IMO) as CongestedVessels
      from DW_DATAMAX.DATA.CONGESTION_PORT_DAYS pd
      left join DW_DATAMAX.DATA.VESSEL_CLASSES vc on pd.VESSELCLASSID = vc.VESSELCLASSID
      where DAYDATE >= ? 
        and pd.VESSELCLASSID = CASE 
          WHEN ? = 'Tanker' THEN 86
          WHEN ? = 'Dry' THEN 70
          ELSE pd.VESSELCLASSID
        END
        and PORTNAME = CASE 
          WHEN ? = 'Tanker' THEN 'Rotterdam'
          WHEN ? = 'Dry' THEN 'Qingdao'
          ELSE PORTNAME
        END
      group by DAYDATE, VESSELTYPE, pd.VESSELCLASS, PORTNAME
      order by VESSELTYPE, pd.VESSELCLASS, PORTNAME, DAYDATE
    `;
    const binds = [dayDate, vesselType, vesselType, vesselType, vesselType];
    console.log('Congestion Port Days SQL:', sql);
    console.log('Congestion Port Days Binds:', binds);
    connection.execute({
      sqlText: sql,
      binds,
      complete: (err, stmt, rows) => {
        if (err) {
          console.error('Query error:', err);
          res.status(500).json({ error: err.message });
        } else {
          res.json(rows);
        }
        connection.destroy();
      }
    });
  });
});

// New endpoint for generating insights with logging
app.post('/api/generate-insights', async (req, res) => {
  const { metrics } = req.body;
  
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
             content: "You're a sharp, sarcastic shipping analyst with a sense of humor. Output only 2-3 bullet points. Each point is a one-liner — short, clever, tweet-style. Use shipping slang where it fits. No titles. No intros. No explanations. Just punchy market takes. Never exceed one line per bullet."



        },
        {
          role: "user",
  content: `Give me the quick scoop on these shipping metrics. Be snappy and fun:\n${JSON.stringify(metrics, null, 2)}`
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
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 