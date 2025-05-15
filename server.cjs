const express = require('express');
const cors = require('cors');
const snowflake = require('snowflake-sdk');

const app = express();
app.use(cors());

app.get('/api/vessel-count', (req, res) => {
  const dayDate = req.query.dayDate || '2025-01-01';
  const vesselType = req.query.vesselType || 'Dry';

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
      select DAYDATE, VESSELTYPE, VESSELCLASS, currentareanamelevel0, VESSELTYPEID, count(IMO) as vessel_count
      from DW_DATAMAX.DATA.VESSEL_COUNT
      where DAYDATE >= ? and VESSELCLASS <> 'Small' and VESSELTYPE = ?
      group by DAYDATE, VESSELTYPE, VESSELCLASS, currentareanamelevel0, VESSELTYPEID
      order by VESSELTYPE, VESSELCLASS, currentareanamelevel0, DAYDATE
    `;
    console.log('Vessel Count SQL:', sql);
    console.log('Vessel Count Binds:', [dayDate, vesselType]);
    connection.execute({
      sqlText: sql,
      binds: [dayDate, vesselType],
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
  const vesselType = req.query.vesselType;
  let routeId = 'TD25';
  if (vesselType && vesselType.toLowerCase() === 'dry') {
    routeId = 'C5';
  }

  const connection = snowflake.createConnection({
    account: 'SIGNAL-WAREHOUSE',
    username: 'EVANGELOSDERVISIS',
    password: 'Cga4fzBLs3sMjD5',
    warehouse: 'DEVELOP_WH',
    database: 'DW_COMMON',
    schema: 'DATA',
  });

  connection.connect((err, conn) => {
    if (err) {
      console.error('Connection error:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    let sql = `
      select vc.VESSELTYPE, vc.VESSELCLASS, ROUTEID, RATEDATE, RATE
      from DW_DATAMAX.DATA.BALTIC_RATES br
      left join DW_DATAMAX.DATA.VESSEL_CLASSES vc on br.VESSELCLASSID = vc.VESSELCLASSID
      where ROUTEID = ? and RATEDATE >= ?`;
    const binds = [routeId, dayDate];
    if (vesselType) {
      sql += ' and vc.VESSELTYPE = ?';
      binds.push(vesselType);
    }
    sql += ' order by vc.VESSELTYPE, vc.VESSELCLASS, ROUTEID, RATEDATE';
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
  const portName = req.query.portName || 'Rotterdam';
  const vesselType = req.query.vesselType;

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
    let sql = `
      select DAYDATE, vc.VESSELTYPE, c.VESSELCLASS, PORTNAME, count(IMO) as CongestedVessels
      from DW_DATAMAX.DATA.CONGESTION_VESSEL_COUNT c
      left join DW_DATAMAX.DATA.VESSEL_CLASSES vc on c.VESSELCLASSID = vc.VESSELCLASSID
      where DAYDATE >= ? and PORTNAME = ?`;
    const binds = [dayDate, portName];
    if (vesselType) {
      sql += ' and vc.VESSELTYPE = ?';
      binds.push(vesselType);
    }
    sql += ' group by DAYDATE, vc.VESSELTYPE, c.VESSELCLASS, PORTNAME order by vc.VESSELTYPE, c.VESSELCLASS, PORTNAME, DAYDATE';
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
  const vesselType = req.query.vesselType;
  const portName = req.query.portName || 'Houston';

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
      where tl.DAYDATE >= ? and v.VESSELTYPE = ? and tl.MARKETDEPLOYMENT in ('Spot','Relet') and DATEDIFF(day, tla.DAYDATE, tla.ETAFROMOPENPOSITION) < 10 and p.NAME = ?
      group by tl.DAYDATE, v.VESSELTYPE, v.VESSELCLASS, p.NAME
      order by v.VESSELTYPE, VESSELCLASS, NAME, DAYDATE
    `;
    console.log('Tonnage Supply SQL:', sql);
    console.log('Tonnage Supply Binds:', [dayDate, vesselType, portName]);
    connection.execute({
      sqlText: sql,
      binds: [dayDate, vesselType, portName],
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
  const vesselType = req.query.vesselType;
  const areaName = req.query.areaName || 'US Gulf';

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
      where FIRSTLOADARRIVALDATE between ? and SYSDATE() and VESSELTYPE = ? and FIRSTLOADPORTLEVEL0AREANAME = ?
      group by DAYDATE, VESSELTYPE, VESSELCLASS, FIRSTLOADPORTLEVEL0AREANAME
      order by VESSELTYPE, VESSELCLASS, FIRSTLOADPORTLEVEL0AREANAME, DAYDATE
    `;
    console.log('Voyages Demand SQL:', sql);
    console.log('Voyages Demand Binds:', [dayDate, vesselType, areaName]);
    connection.execute({
      sqlText: sql,
      binds: [dayDate, vesselType, areaName],
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
  const portName = req.query.portName || 'Rotterdam';
  const vesselType = req.query.vesselType;

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
    let sql = `
      select DAYDATE, vc.VESSELTYPE, c.VESSELCLASS, PORTNAME, count(IMO) as CongestedVessels
      from DW_DATAMAX.DATA.CONGESTION_PORT_DAYS c
      left join DW_DATAMAX.DATA.VESSEL_CLASSES vc on c.VESSELCLASSID = vc.VESSELCLASSID
      where DAYDATE >= ? and PORTNAME = ?`;
    const binds = [dayDate, portName];
    if (vesselType) {
      sql += ' and vc.VESSELTYPE = ?';
      binds.push(vesselType);
    }
    sql += ' group by DAYDATE, vc.VESSELTYPE, c.VESSELCLASS, PORTNAME order by vc.VESSELTYPE, c.VESSELCLASS, PORTNAME, DAYDATE';
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

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 