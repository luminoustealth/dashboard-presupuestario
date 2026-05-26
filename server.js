const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

const SHEET_ID = '1SPKF4fXDGXj76NEZWeKGLQ2_wPOzdy8oHm0-_c6W4wk';
const API_KEY = 'AIzaSyDAo6rY4dkM8XOznCgowu04ULIWKtAMBb0';
const RANGE = 'Hoja1!A1:S20';

app.use(cors());
app.use(express.static('public'));

app.get('/api/data', async (req, res) => {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || `HTTP Error: ${response.status}`);
    }
    
    const result = await response.json();
    const rows = result.values || [];

    const parseNum = (val) => {
      if (!val) return 0;
      val = String(val).trim().replace(/\./g, '').replace(',', '.');
      return parseFloat(val) || 0;
    };

    const data = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      // Buscar filas que tengan "GASTOS" en columna C (índice 2)
      if (!row[2] || !row[2].includes('GASTOS')) continue;
      if (!row[1] || row[1].toLowerCase().includes('total')) continue;

      data.push({
        nombre: row[1] || '',
        ppto: parseNum(row[3]),
        pptoAbr: parseNum(row[4]),
        real: parseNum(row[5]),
        jun: parseNum(row[6]),
        jul: parseNum(row[7]),
        ago: parseNum(row[8]),
        sep: parseNum(row[9]),
        oct: parseNum(row[10]),
        nov: parseNum(row[11]),
        dic: parseNum(row[12]),
        ene: parseNum(row[13]),
        feb: parseNum(row[14]),
        mar: parseNum(row[15]),
        abr: parseNum(row[16]),
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
