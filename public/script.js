async function carregarConsultas() {
  const lista = document.getElementById('listaConsultas');
  lista.innerHTML = '';

  try {
    const resposta = await fetch('/api/consultas');
    const consultas = await resposta.json();

    consultas.forEach(c => {
      const li = document.createElement('li');
      li.textContent = `${c.data} às ${c.hora} - ${c.nomePaciente} com Dr(a). ${c.nomeMedico}`;

      const botao = document.createElement('button');
      botao.textContent = 'Excluir';
      botao.onclick = async () => {
        await fetch('/api/consultas/' + c.id, { method: 'DELETE' });
        carregarConsultas();
      };

      li.appendChild(botao);
      lista.appendChild(li);
    });
  } catch (err) {
    console.error('Erro ao carregar consultas:', err);
  }
}

document.getElementById('formAgendamento').addEventListener('submit', async function (e) {
  e.preventDefault();

  const nomePaciente = document.getElementById('nomePaciente').value;
  const nomeMedico = document.getElementById('nomeMedico').value;
  const data = document.getElementById('data').value;
  const hora = document.getElementById('hora').value;

  const dadosConsulta = { nomePaciente, nomeMedico, data, hora };

  try {
    const resposta = await fetch('/api/consultas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dadosConsulta)
    });

    if (resposta.ok) {
      document.getElementById('mensagem').textContent = 'Consulta agendada com sucesso!';
      document.getElementById('formAgendamento').reset();
      carregarConsultas();
    } else {
      document.getElementById('mensagem').textContent = 'Erro ao agendar consulta.';
    }
  } catch (erro) {
    console.error('Erro:', erro);
    document.getElementById('mensagem').textContent = 'Erro na comunicação com o servidor.';
  }
});

window.onload = carregarConsultas;
