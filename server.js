const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Usa a porta do ambiente (Render), ou 3001 localmente
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let consultas = [];

app.post('/api/consultas', (req, res) => {
  const { nomePaciente, nomeMedico, data, hora } = req.body;

  if (!nomePaciente || !nomeMedico || !data || !hora) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
  }

  const novaConsulta = {
    id: Date.now(),
    nomePaciente,
    nomeMedico,
    data,
    hora
  };

  consultas.push(novaConsulta);
  res.status(201).json(novaConsulta);
});

app.get('/api/consultas', (req, res) => {
  res.json(consultas);
});

app.delete('/api/consultas/:id', (req, res) => {
  const { id } = req.params;
  const index = consultas.findIndex(c => c.id == id);
  if (index !== -1) {
    consultas.splice(index, 1);
    return res.status(200).json({ mensagem: 'Consulta excluída.' });
  }
  res.status(404).json({ erro: 'Consulta não encontrada.' });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
