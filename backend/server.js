const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());

// Serve os arquivos estáticos da pasta frontend (que fica um nível acima do backend)
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Rota de fallback: qualquer caminho não encontrado devolve o index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor iniciado na porta ${PORT}`);
});
