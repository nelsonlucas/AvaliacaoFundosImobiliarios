# 📊 Análise de Fundos Imobiliários (FIIs)

Este projeto realiza uma análise automatizada de **Fundos Imobiliários (FIIs)**, utilizando dados da plataforma [StatusInvest](https://statusinvest.com.br/) para avaliar oportunidades com base no rendimento médio mensal, dividend yield (DY), preço justo e segmento de atuação de cada fundo.

## 🚀 Objetivo

Auxiliar investidores na tomada de decisão, identificando FIIs com potencial de retorno acima de um valor mínimo mensal, com base em dados históricos de distribuição de rendimentos e preços médios.

## 🛠️ Tecnologias Utilizadas

- [Node.js](https://nodejs.org/)
- [Axios](https://github.com/axios/axios)
- [Lodash](https://lodash.com/)
- [Moment.js](https://momentjs.com/)
- [Wink-Statistics](https://www.npmjs.com/package/wink-statistics)
- [StatusInvest (scraping/API)](https://statusinvest.com.br/)

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/analise-fiis.git
cd analise-fiis

# Instale as dependências
npm install
⚙️ Como Funciona
Busca todos os FIIs listados no período de 1 ano.

Agrupa os rendimentos mensais por ticker.

Para cada fundo:

Calcula o DY médio e o valor médio de rendimento absoluto.

Estima o preço médio da cota.

Simula o número de cotas adquiridas com R$10.000.

Estima o rendimento mensal com base nas médias históricas.

Verifica se o rendimento supera o mínimo esperado (1% ao mês).

Realiza scraping para obter o segmento do fundo.

Gera um arquivo output.json com os FIIs classificados por segmento.

📈 Exemplo de Saída
json
Copy
Edit
{
  "Lajes Corporativas": [
    {
      "code": "XPPR11",
      "qtdQuotaNecessaria": 88,
      "precoMedioQuota": 113.6,
      "rendimentoMensal": 104,
      "valorMedioDY": 0.89,
      "precoMedioJustoPorQuota": 113,
      "Segmento": "Lajes Corporativas"
    }
  ],
  "Logística": [
    ...
  ]
}
📂 Estrutura
index.js: Código principal de análise.

scraping/statusInvest.js: Função auxiliar para obter o segmento de cada FII via scraping.

output.json: Resultado final com os FIIs filtrados e ordenados.

🔧 Parâmetros
Você pode ajustar alguns parâmetros diretamente no código:

js
Copy
Edit
let saldoInvestimento = 10000; // Valor simulado para investir
let fatorRetornoMes = 0.01;    // Percentual mínimo de retorno mensal (1%)
🧠 Lógica de Filtragem
Apenas são considerados FIIs que:

Possuem pelo menos 12 meses de dados históricos.

Apresentam um rendimento mensal simulado igual ou superior ao retorno mínimo aceitável.

Têm dados de preço disponíveis via StatusInvest.

⚠️ Aviso
Este projeto é apenas para fins educacionais e experimentais. Não representa recomendação de investimento.
