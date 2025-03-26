import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static('public')); // Servir o front-end

// Rota para buscar os dados do ORCID
app.get('/orcid/:id', async (req, res) => {
    const orcidId = req.params.id;
    const url = `https://pub.orcid.org/v3.0/${orcidId}`;
    
    try {
        const response = await fetch(url, { headers: { 'Accept': 'application/json' } });
        if (!response.ok) return res.status(response.status).json({ error: "Erro ao buscar ORCID" });

        const data = await response.json();
        
        const nome = data.person?.name?.['given-names']?.value || "Desconhecido";
        const sobrenome = data.person?.name?.['family-name']?.value || "";
        
        // Últimos trabalhos
        const trabalhos = (data['activities-summary']?.works?.group || []).slice(0, 5).map(trabalho => ({
            titulo: trabalho['work-summary']?.[0]?.title?.title?.value || "Título desconhecido"
        }));

        // Histórico de empregos
        const empregos = (data['activities-summary']?.employments?.['employment-summary'] || []).map(emprego => ({
            instituicao: emprego['organization']?.name || "Instituição desconhecida",
            inicio: emprego['start-date'] ? `${emprego['start-date'].year?.value}` : "Desconhecido",
            fim: emprego['end-date'] ? `${emprego['end-date'].year?.value}` : "Atualmente"
        }));

        res.json({ nome, sobrenome, trabalhos, empregos });
    } catch (error) {
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

// Iniciando o servidor
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
