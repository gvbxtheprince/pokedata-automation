import fs from 'node:fs/promises';
import fetch from 'node-fetch';

const POKEMON_TEAM = ['reuniclus', 'tyranitar', 'garchomp', 'rotom-wash'];
const FILE_NAME = 'TEAM_STATS.md';

async function getPokeData(name) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const data = await response.json();
    
    return {
        name: data.name.toUpperCase(),
        types: data.types.map(t => t.type.name).join(' / '),
        stats: data.stats.map(s => `${s.stat.name}: ${s.base_stat}`).join(' | ')
    };
}

async function generateReport() {
    try {
        console.log("⏳ Coletando dados da equipe...");
        const teamData = await Promise.all(POKEMON_TEAM.map(getPokeData));

        let content = `# ⚔️ VGC Team Analysis\n\nGenerated on: ${new Date().toLocaleDateString()}\n\n`;
        
        teamData.forEach(p => {
            content += `### 👾 ${p.name}\n- **Types:** ${p.types}\n- **Base Stats:** ${p.stats}\n\n---\n`;
        });

        await fs.writeFile(FILE_NAME, content);
        console.log(`✅ Relatório "${FILE_NAME}" gerado com sucesso!`);
    } catch (error) {
        console.error("❌ Erro na automação:", error);
    }
}

generateReport();