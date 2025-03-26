function buscarOrcid() {
    const orcidId = document.getElementById('orcidInput').value;
    if (!orcidId) {
        alert("Por favor, insira um ORCID ID.");
        return;
    }

    fetch(`http://localhost:3000/orcid/${orcidId}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                document.getElementById('resultado').innerHTML = `<p style="color:red">${data.error}</p>`;
                return;
            }

            let html = `<h3>${data.nome} ${data.sobrenome}</h3>`;

            if (data.trabalhos.length > 0) {
                html += "<h4>Últimos Trabalhos:</h4><ul>";
                data.trabalhos.forEach(trabalho => {
                    html += `<li>${trabalho.titulo}</li>`;
                });
                html += "</ul>";
            }

            if (data.empregos.length > 0) {
                html += "<h4>Histórico de Empregos:</h4><ul>";
                data.empregos.forEach(emprego => {
                    html += `<li>${emprego.instituicao} (${emprego.inicio} - ${emprego.fim})</li>`;
                });
                html += "</ul>";
            }

            document.getElementById('resultado').innerHTML = html;
        })
        .catch(error => {
            document.getElementById('resultado').innerHTML = `<p style="color:red">Erro ao buscar dados.</p>`;
            console.error("Erro:", error);
        });
}
