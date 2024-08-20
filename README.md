# Serv00 - 控制面板自動登入腳本
## 使用方法
　　在 GitHub 倉庫中，進入右上角 `Settings`，在側邊欄找到 `Secrets and variables`，點擊展開選擇 `Actions`，點擊 `New repository secret`，然後創建一個名為 `ACCOUNTS_JSON` 的 `Secret`，將 JSON 格式的帳號密碼字串作為它的值，如下格式：  
```
[  
  { "username": "qinshihuang", "password": "linux.do", "panelnum": "0" },  
  { "username": "zhaogao", "password": "daqinzhonggong", "panelnum": "2" },  
  { "username": "heiheihei", "password": "shaibopengke", "panelnum": "3" }  
]
```
> 其中 `panelnum` 參數為面板編號，即為你所收到註冊郵件的 `panel*.serv00.com` 中的 `*` 數值。