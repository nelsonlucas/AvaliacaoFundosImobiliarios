import axios from "axios";
import { writeFileSync } from "fs";
import _ from "lodash";
import querystring from "querystring";
import stats from "wink-statistics";

let startDate = "2021-03-01";
let endDate = "2022-04-26";
let indiceCode = "";
let filter = "";

// busca os dados no statusInvest
console.log(`Buscando dados...`);
let getFundos = await axios.get(
  `https://statusinvest.com.br/fii/getearnings?IndiceCode=${indiceCode}&Filter=${filter}&Start=${startDate}&End=${endDate}`,
  {
    headers: {
      Accept: "application/json",
    },
  }
);

const listFundos = getFundos?.data?.dateCom;

//  agrupamento
let fundos = _.groupBy(listFundos, "code");

// saldo
let saldoInvestimento = 10000;
/**
 * Fator minimo de rentabilidade
 * Esse fator é responsavel por definir quanto o ativo devera retornar ao mes. Ex: 1% ao mes do valor investido
 */
let fatorRetornoMes = 0.01;

let valorMinimoAceitavel = parseFloat(
  parseFloat(saldoInvestimento * fatorRetornoMes).toFixed(2)
);

let ticker = [];
for (const fundo in fundos) {
  console.log(`Pesquisando codigo ${fundo}`);

  let result = await axios.post(
    "https://statusinvest.com.br/fii/tickerprice",
    querystring.stringify({
      ticker: fundo,
      type: "1",
    }),
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  // so ira calcular se existir no minimo 12 meses de pagamento
  if (fundos[fundo].length >= 12) {
    //

    // array tratado e com determinaods valores convertidos
    let fundoTratado = fundos[fundo].map(o => {
      o.dy = parseFloat(o.dy.replace(",", "."));
      o.resultAbsoluteValue = parseFloat(
        o.resultAbsoluteValue.replace(",", ".")
      );
      return o;
    });

    //   recupera sempre o ultimo preco salvo
    let precoQuota = result?.data?.[0]?.prices?.[0]?.price;

    if (precoQuota) {
      // recebe o valor do preco medio
      let vlrMedioRendimentoAbsoluto = stats.data.median(
        fundoTratado,
        "resultAbsoluteValue"
      );
      let valorMedioDY = stats.data.median(fundoTratado, "dy");

      // Calcular qtd de quotas e possivel adquirir com o saldo bancario. O arredondamento sera sempre para BAIXO
      let qtdQuota = Math.floor(saldoInvestimento / precoQuota);

      // valor rendimento mensal baseado na media
      let rendimentoMensal = Math.floor(qtdQuota * vlrMedioRendimentoAbsoluto);

      ticker.push({
        code: fundo,
        qtdQuotaNecessaria: qtdQuota,
        precoQuota: precoQuota,
        rendimentoMensal: rendimentoMensal,
        valorMinimoAceitavel: valorMinimoAceitavel,
      });
    }
  }
}

await writeFileSync(
  "output.json",
  JSON.stringify(
    _.orderBy(ticker, "rendimentoMensal", "asc").filter(
      o => o.rendimentoMensal >= valorMinimoAceitavel
    )
  )
);

/*
conando para buscar todos os tickers 
url: https://statusinvest.com.br/fii/getearnings?IndiceCode=&Filter=&Start=2021-03-01&End=2022-04-26
method: GET
*/

/* comando para buscar o preco do ticker 

url: https://statusinvest.com.br/fii/tickerprice
method: POST
body: {
    type: x-www-form-urlencoded
    ticker: codigo do ticker
    type: {
        -1 => Preco no intervalor de um dia ou ultimo dia  util;
        0 = Preco no intervalo de 5 dias
        1 = Preco no intervalo de 30 dias
        2 = Preco no intervalo de 6 meses
        3 = Preco no intervalo de 1 ano
        4 = Preco no intervalo de 5 anos
    }
}
*/
