const puppeteer = require('puppeteer');
const config = require('./config');

async function login(page) {
  await page.goto('https://www.amazon.co.jp/ap/signin?_encoding=UTF8&ignoreAuthState=1&openid.assoc_handle=jpflex&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.mode=checkid_setup&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.ns.pape=http%3A%2F%2Fspecs.openid.net%2Fextensions%2Fpape%2F1.0&openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.co.jp%2FAmazon%25E3%2582%25AE%25E3%2583%2595%25E3%2583%2588%25E5%2588%25B8-1_JP_Email-Amazon%25E3%2582%25AE%25E3%2583%2595%25E3%2583%2588%25E5%2588%25B8-E%25E3%2583%25A1%25E3%2583%25BC%25E3%2583%25AB%25E3%2582%25BF%25E3%2582%25A4%25E3%2583%2597-Amazon%25E3%2583%2599%25E3%2583%25BC%25E3%2582%25B7%25E3%2583%2583%25E3%2582%25AF%2Fdp%2FB004N3APGO%2Fref%3Dnav_signin%3Fs%3Dgift-cards%26ie%3DUTF8%26qid%3D1552790096%26sr%3D1-1&switch_account=')
  await page.type('input[id="ap_email"]', config.AMAZON_EMAIL);
  await page.click('#continue');
  await page.waitForNavigation({timeout: 60000, waitUntil: "domcontentloaded"});
  await page.type('input[id="ap_password"]', config.AMAZON_PW);
  await page.click('#signInSubmit');
  await page.waitForNavigation({timeout: 60000, waitUntil: "domcontentloaded"});
}


(async () => {
  // ブラウザを表示させるモードで起動させる
	const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  // ログインページへ遷移
  await login(page);
  
  // Amazonギフト券のページへ遷移
  for (var i = 0; i < 1; i++){
    console.log('購入開始：', i);
    await page.goto('https://www.amazon.co.jp/Amazon%E3%82%AE%E3%83%95%E3%83%88%E5%88%B8-1_JP_Email-Amazon%E3%82%AE%E3%83%95%E3%83%88%E5%88%B8-E%E3%83%A1%E3%83%BC%E3%83%AB%E3%82%BF%E3%82%A4%E3%83%97-Amazon%E3%83%99%E3%83%BC%E3%82%B7%E3%83%83%E3%82%AF/dp/B004N3APGO/ref=lp_3131877051_1_1?s=gift-cards&ie=UTF8&qid=1552790096&sr=1-1');
    await page.waitForTimeout(5000);

    // 金額入力、送り先指定、今すぐ購入
    await page.type('input[id="gc-order-form-custom-amount"]', '100');
    await page.type('textarea[id="gc-order-form-recipients"]', config.AMAZON_EMAIL);
    await page.click('#gc-buy-box-bn');
    await page.waitForTimeout(5000);

    // 購入確認
    await page.click('#continue-top');
    await page.waitForTimeout(5000);

    // 購入確定
    await page.click('.place-your-order-button');
    console.log('購入完了：', i);

    await page.waitForTimeout(8000);
  }
  await browser.close();
})();
