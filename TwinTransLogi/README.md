# 倉儲與運輸管理 — 互動簡介網站　（TwinTransLogi）

> 《倉儲與運輸管理：以系統思維邁向雙軸轉型》（Allen 老師　陳志騰著　AIBILA 研究室）的互動式書籍簡介，提供首頁特色 + 三篇頁籤 + 後記，每章呈現章前對話情境 + 全景架構圖 + 200 字簡述。

## 線上版

GitHub Pages： https://chihtengchen.github.io/Public/TwinTransLogi/

## 本機開發

直接以瀏覽器開啟 `index.html` 即可——無需 build step、無需 server。
若您要修改內容，編輯 `scripts/data.js` 即可全站更新。

## 檔案結構

```
TwinTransLogi/
├── index.html              主頁面（HTML 結構）
├── styles/
│   └── main.css            全站樣式（DX/SX 色票 + 響應式）
├── scripts/
│   ├── data.js             14 章資料（對話 / 簡述 / KRI / 試讀題）
│   └── app.js              互動邏輯（tabs / search / lightbox / dark mode）
├── assets/
│   └── figures/
│       ├── ch01.png ~ ch14.png  各章招牌圖（14 張）
└── README.md
```

## 功能對照（P0–P3）

| 級別 | 功能 | 狀態 |
|-----|------|------|
| P0 | 4 篇頁籤導覽（首頁／核心思維／倉儲／運輸／後記） | ✅ |
| P0 | 章節三件套（對話氣泡 + 招牌圖 + 200 字簡述） | ✅ |
| P0 | DX/SX 雙軸視覺語言 + 五大特色 | ✅ |
| P1 | 章節 sub-nav + IntersectionObserver 高亮 | ✅ |
| P1 | 圖片 lightbox（zoom + ESC） | ✅ |
| P1 | 三色聊天氣泡（Allen 紫 / Ware 藍 / Route 綠） | ✅ |
| P2 | 鍵盤快捷（1234/／搜尋/Esc） | ✅ |
| P2 | 全文搜尋（章名／術語／KRI／對話） | ✅ |
| P2 | 列印模式（Ctrl+P 自動展開） | ✅ |
| P2 | 章節進度標 ✅ 已交付 | ✅ |
| P3 | DX/SX filter chips（每篇可篩） | ✅ |
| P3 | 三角色名言輪播 | ✅ |
| P3 | 章末試讀題（4 章樣本） | ✅ |
| P3 | 暗色模式（依系統偏好） | ✅ |

## 鍵盤快捷

- `1` ~ `5`：切換頁籤（首頁／核心思維／倉儲／運輸／後記）
- `／`：開啟搜尋框
- `Esc`：關閉搜尋／lightbox

## 部署到 GitHub Pages

本資料夾位於 `ChihtengChen/Public` repo 的 `TwinTransLogi/` 子目錄。
GitHub Pages 設定（Repo Settings → Pages）：
- Source: Deploy from branch
- Branch: `main`
- Folder: `/ (root)`

部署後可從以下網址開啟：
```
https://chihtengchen.github.io/Public/TwinTransLogi/
```

## 內容更新工作流

修改任何章節內容時，只需編輯 `scripts/data.js` 中對應 `chapters.chXX` 物件：
- `dialogue`：對話陣列，`who` 為 A/W/R/N（Allen/Ware/Route/Narrator）
- `summary`：200 字章節簡述
- `kri`：3-4 個關鍵 KRI／詞彙標籤
- `axes`：DX 與／或 SX 標籤

修改後直接重整瀏覽器即可看到變化，無需 rebuild。

## 圖片來源

每章招牌圖來自《倉儲與運輸管理》各章 Fig X-1（三層分工流程圖）或代表性圖示，源檔位於：
- `Book_WM-TM/TALM_倉儲與運輸管理教科書新版/ChXX/`

圖檔已轉存至本 repo `assets/figures/chXX.png`。

## 授權

© 2026 AIBILA 研究室　Allen 老師（陳志騰）　保留所有權利。
本互動簡介內容僅供書籍展示用途；書籍完整內容請參閱出版實體書／PDF。
