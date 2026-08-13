const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Servidor do CarControle está rodando com sucesso!');
});

app.listen(PORT, () => {
    console.log(`Servidor iniciado na porta ${PORT}`);
});
