const fs = require('fs');
const puppeteer = require('puppeteer');

function formatToISO(date) {
  return date.toISOString().replace('T', ' ').replace('Z', '').replace(/\.\d{3}Z/, '');
}

async function delayTime(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  // 讀取 accounts.json 中的 JSON 字串
  const accountsJson = fs.readFileSync('accounts.json', 'utf-8');
  const accounts = JSON.parse(accountsJson);

  for (const account of accounts) {
    const { username, password, panelnum } = account;

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    let url = `https://panel${panelnum}.serv00.com/login/?next=/`;

    try {
      // 修改網址為新的登入頁面
      await page.goto(url);

      // 清空使用者名輸入框的原有值
      const usernameInput = await page.$('#id_username');
      if (usernameInput) {
        await usernameInput.click({ clickCount: 3 }); // 選中輸入框的內容
        await usernameInput.press('Backspace'); // 刪除原來的值
      }

      // 輸入實際的帳號和密碼
      await page.type('#id_username', username);
      await page.type('#id_password', password);

      // 提交登入表單
      const loginButton = await page.$('#submit');
      if (loginButton) {
        await loginButton.click();
      } else {
        throw new Error('無法找到登入按鈕');
      }

      // 等待登入成功（如果有跳轉頁面的話）
      await page.waitForNavigation();

      // 判斷是否登入成功
      const isLoggedIn = await page.evaluate(() => {
        const logoutButton = document.querySelector('a[href="/logout/"]');
        return logoutButton !== null;
      });

      if (isLoggedIn) {
        // 取得目前的 UTC 時間和台北時間
        const nowUtc = formatToISO(new Date());// UTC時間
        const nowBeijing = formatToISO(new Date(new Date().getTime() + 8 * 60 * 60 * 1000)); // 台北時間東8區，用算術來搞
        console.log(`帳號 ${username} 於台北時間 ${nowBeijing}（UTC 時間 ${nowUtc}）登入成功！`);
      } else {
        console.error(`帳號 ${username} 登入失敗，請檢查帳號和密碼是否正確。`);
      }
    } catch (error) {
      console.error(`帳號 ${username} 登入時出現錯誤: ${error}`);
    } finally {
      // 關閉頁面和瀏覽器
      await page.close();
      await browser.close();

      // 使用者之間新增隨機延時
      const delay = Math.floor(Math.random() * 8000) + 1000; // 隨機延時1秒到8秒之間
      await delayTime(delay);
    }
  }

  console.log('所有帳號登入完成！');
})();

// 自訂延時函式
function delayTime(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
