import puppeteer from "puppeteer";

export const getSegmentoTicker = async ticker => {
  //

  let url = `https://statusinvest.com.br/fundos-imobiliarios/${ticker}`;

  try {
    // iniicaliza
    const browser = await puppeteer.launch({ headless: true });

    // abre nova pagina ( aba )
    const page = await browser.newPage();

    // linha necessaria para utilizar o puperteer modo invisivel
    //https://lifesaver.codes/answer/headless-mode-is-not-working-1766
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36"
    );

    // vai para pagina
    await page.goto(url);

    // aguarda o selector
    const selector =
      "#fund-section > div > div > div.card.bg-main-gd-h.white-text.rounded.pt-1.pb-1 > div";
    await page.waitForSelector(selector);

    let selectOptions = await page.$$eval(selector, r => {
      return r.map(o => o.textContent.trim()).slice(0, 10);
    });

    // fecha o navegador
    await browser.close();

    selectOptions = selectOptions?.[0]?.split("\n").filter(o => o);

    let data = {
      [`${selectOptions[0]}`]: selectOptions[1],
      [`${selectOptions[3]}`]: selectOptions[4],
      [`${selectOptions[5]}`]: selectOptions[6],
    };

    return data;
  } catch (error) {
    console.log(`Erro ao buscar os dados ${error}`);
  }
};
