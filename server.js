const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRjwiriCy6HqZJzlrzsjlop_Gr80pSX6B807W3Znpk8bsJcLXCq-71tVn6ZIdLUMlfk-wlBaD9AWNCm/pub?output=csv';

app.use(cors());
app.use(express.static('public'));

// Endpoint que lee el CSV de Google Sheets
app.get('/api/data', async (req, res) => {
  try {
    const response = await fetch(CSV_URL);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    
    const csv = await response.text();
    const lines = csv.trim().split('\n');
    const data = [];

    for (let i = 2; i < lines.length; i++) {
      if (!lines[i].trim()) continue;

      const values = lines[i].split(',').map(v => {
        v = v.trim();
        return v.replace(/\./g, '').replace(',', '.');
      });

      if (!values[1]) continue;
      if (values[1].toLowerCase().includes('total')) break;

      const parseNum = (val) => {
        if (!val) return 0;
        return parseFloat(String(val).trim().replace(/\./g, '').replace(',', '.')) || 0;
      };

      data.push({
        nombre: values[1],
        ppto: parseNum(values[3]),
        pptoAbr: parseNum(values[4]),
        real: parseNum(values[5]),
        jun: parseNum(values[6]),
        jul: parseNum(values[7]),
        ago: parseNum(values[8]),
        sep: parseNum(values[9]),
        oct: parseNum(values[10]),
        nov: parseNum(values[11]),
        dic: parseNum(values[12]),
        ene: parseNum(values[13]),
        feb: parseNum(values[14]),
        mar: parseNum(values[15]),
        abr: parseNum(values[16]),
      });
    }

    res.json({ success: true, data, updatedAt: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
