const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors()); // Foarte important pentru ca React să poată vorbi cu Node
app.use(express.json());

// Date de test (Mock data)
const carStatus = {
    brand: "Dacia Logan",
    itp: "Expiră în 15 zile",
    rca: "Valid până la 12.12.2026",
    oilChange: "Peste 3500 km"
};

app.get('/api/car-info', (req, res) => {
    res.json(carStatus);
});

app.listen(PORT, () => {
    console.log(`[Server] Poruncile sunt primite pe portul ${PORT}`);
});