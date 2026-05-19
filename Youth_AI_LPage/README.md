# 智慧物流人才培育專案 · 廣宣 Landing

> 工研院服務系統科技中心 × 臺中科大 AIBILA Lab. · 強化服務業人才韌性 115-116 年度計畫
> 整合「廠商說明會」與「招生說明會」兩個對外說明場景的單頁站點

---

## 🌐 線上網址（已部署）

**https://chihtengchen.github.io/Public/Youth_AI_LPage/**

本站以子路徑形式部署於既有的 `ChihtengChen/Public` repo，透過該 repo 已啟用的 GitHub Pages（`main` 分支 / root）對外發布。可直接用此網址對外宣傳。

---

## 📂 目錄結構

```
Public/                                ← github.com/ChihtengChen/Public（公開 repo，已開 Pages）
└── Youth_AI_LPage/                    ← 本站根目錄（線上對應 /Public/Youth_AI_LPage/）
    ├── index.html                     ← 整合主檔（首頁 + 廠商頁籤 + 招生頁籤）
    ├── README.md                      ← 本檔（部署 / 維護指南）
    ├── .nojekyll                      ← 關閉 Jekyll，確保資源原樣輸出
    ├── assets/
    │   └── logo.svg
    ├── deploy/
    │   └── 部署到D槽_步驟.md
    └── forms/
        ├── 01_廠商說明會表單規格.md   ← 廠商 Google Form 欄位逐項規格
        └── 02_招生說明會表單規格.md   ← 學員 Google Form 欄位逐項規格
```

---

## 🧩 三個頁籤的內容架構

### Tab 1 · 首頁 · 育合用好（核心理念）
- ITRI 服務系統科技中心 DNA 宣言 — **從技術輔導輸出,到人才培育、技術落地、產業升級的統合進化，成為育合用好的智慧生態系推手**
- **育 → 合 → 用 → 好 四階段飛輪**：每階段明列「主導方」與「產出」
- **三方角色矩陣**：用人廠商 × 有志學員 × 培育單位（ITRI / AIBILA Lab.）各自帶入與帶走
- **智慧營運優化小組誕生路徑**：廠商說明會 → 招生 → 培育 → 媒合 → 內部小組 五步驟時間軸
- 雙 CTA：跳至廠商頁籤 / 跳至招生頁籤

### Tab 2 · 廠商合作說明
- Hero（廠商說明會主視覺）
- 4W（為何學 / 學什麼 / 如何學 / 學完如何發揮）
- 兩個缺口（有「用」才是價值 + AI 人才 ≠ 物流人才）
- 工研院 DNA 三證據（執行主體 / 方法論傳統 / 業界專案）
- 廠商說明會場次（兩場）
- **廠商說明會報名 / 合作意願表**（Google Form 嵌入位置）

### Tab 3 · 招生培育說明
- Hero（招生說明會主視覺 + slogan「結業即就業 · 擺脫不自信」）
- 四問（決定你適不適合走進這間教室）
- 誰適合 / 誰不適合
- 獎勵與薪資（5 萬獎勵金 + 媒合 +1 萬／月 + 媒合率 ≥ 75%）
- 課程架構 VMDA + 八週進化軸
- FAQ
- 招生說明會場次（兩場）
- **招生說明會 / 學員報名表**（Google Form 嵌入位置）

---

## 🚀 部署現況與更新流程

### ✅ 階段 1：已部署（現況）

本站**已上線**，採「放入既有公開 repo 子路徑」方式，而非另建獨立 repo：

| 項目 | 實際值 |
| --- | --- |
| Repo | [`ChihtengChen/Public`](https://github.com/ChihtengChen/Public)（公開） |
| 分支 / 路徑 | `main` 分支，站點位於 `Youth_AI_LPage/` 子目錄 |
| GitHub Pages | 該 repo **已啟用**（Source：Deploy from a branch，`main` / root） |
| 線上網址 | **<https://chihtengchen.github.io/Public/Youth_AI_LPage/>** |
| 本地路徑 | `d:\AI-Code\Public\Youth_AI_LPage\` |

> 📜 原獨立 repo（`init` + deploy SOP 兩個 local commit、無遠端）的歷史已備份為 git bundle 存於 `%TEMP%\Youth_AI_LPage_history.bundle`，需要時可 `git clone` 還原。

### ✅ 階段 2：GitHub Pages 已啟用

Pages 在 `ChihtengChen/Public` repo 上**早已開啟**（`main` / root），因此本站 push 後會**自動重建**，無需再到 Settings → Pages 做任何設定。首次部署已驗證 build = `built`、網址回應 HTTP 200。

### 🔄 日常更新流程

改文案後，於 **`d:\AI-Code\Public`**（注意是 Public repo 根、不是子目錄）執行：

```powershell
cd d:\AI-Code\Public
git add Youth_AI_LPage
git commit -m "Youth_AI_LPage: 更新文案"
git pull --rebase origin main   # 先同步遠端，避免 push 被拒
git push origin main
```

push 後 1–2 分鐘 GitHub Pages 自動重新部署。若沒看到變化，按 `Ctrl+F5` 強制重整（首次部署有 cache）。

> ⚠️ **PS 5.1 BOM 雷**：commit message 含中文時請用 `git commit -m "..."` 一行指令直接送，**不要**先 `Out-File commit_msg.txt -Encoding utf8` 再 `git commit -F commit_msg.txt`，會被加 UTF-8 BOM。

---

### 階段 3（可選 · 未啟用）：綁自有子網域

> 目前對外用 `chihtengchen.github.io/Public/Youth_AI_LPage/` 即可。以下為「日後若要改用自有網域」的備查步驟——**注意**：自有網域 CNAME 是綁定**整個 repo**，會把 `ChihtengChen/Public` 全站接到該網域，不適合只給本子站用。若真的要走自有網域，建議改成另建獨立 repo（可用上方備份的 bundle 還原歷史），再依下列設定。

#### 3.1 建立 CNAME 檔案

在（獨立）repo 根目錄建一個檔案 `CNAME`（無副檔名）內容就是子網域：

```text
outreach.ctone.com.tw
```

提交：

```powershell
git add CNAME
git commit -m "add CNAME for outreach.ctone.com.tw"
git push
```

> 也可在 GitHub 介面 → Settings → Pages → `Custom domain` 直接打進去，按 `Save`，GitHub 會自動 commit CNAME 到 repo。

#### 3.2 Cloudflare DNS 設定

到 Cloudflare → ctone.com.tw zone → `DNS` → `Records` → `Add record`：

| Type | Name | Target | Proxy status | TTL |
| --- | --- | --- | --- | --- |
| CNAME | outreach | YOUR_USERNAME.github.io | **DNS only**（橘色雲關掉，第一次驗證時必須） | Auto |

> ⚠️ Cloudflare proxy（橘雲）打開會讓 GitHub Pages 的 HTTPS 憑證驗證失敗。**第一次設定請維持 DNS only（灰雲）**，等 GitHub 那邊把 HTTPS 簽好後（看 Settings → Pages 顯示 "Your site is published at https://outreach.ctone.com.tw"），再回 Cloudflare 把橘雲打開。

#### 3.3 等候 + 驗證

- DNS 通常 5-15 分鐘生效
- 回 GitHub Settings → Pages，往下捲到 `Custom domain` → 確認 `DNS check successful`
- 勾選 `Enforce HTTPS`（GitHub 會自動向 Let's Encrypt 申請憑證，需 5-30 分鐘）
- 瀏覽器試 `https://outreach.ctone.com.tw/`

---

### 階段 4：建立兩份 Google Form 並嵌入

#### 4.1 建表

依序按 `forms/01_廠商說明會表單規格.md` 與 `forms/02_招生說明會表單規格.md` 在 Google Forms 建表。

> Tip：兩份表單建議用同一個 Google 帳號管理（建議由課程行政 elinor@itri.org.tw 或建一個專案專用 Gmail），方便集中管理回覆 Sheet 並接收通知信。

#### 4.2 取得 embed URL

1. 表單編輯介面右上 → `傳送`（Send）
2. 切到 `<>` 嵌入分頁
3. 複製 `<iframe src="..."` 的 src 完整網址
4. 從中抓出 `https://docs.google.com/forms/d/e/FAIpQLS.../viewform?embedded=true`
5. 那段 `FAIpQLS...` 就是表單 ID

#### 4.3 替換 index.html 內的 placeholder

打開 `index.html`，找：

```html
<iframe src="https://docs.google.com/forms/d/e/REPLACE_WITH_VENDOR_FORM_ID/viewform?embedded=true"
```

把 `REPLACE_WITH_VENDOR_FORM_ID` 換成廠商表單 ID。
同理把 `REPLACE_WITH_STUDENT_FORM_ID` 換成招生表單 ID。

#### 4.4 把表單區塊顯示出來

找到兩處：

```html
<div class="form-wrap" style="display:none;" id="vendor-form-wrap">
```

把 `style="display:none;"` 拿掉。
同時把同層的 `<div class="form-placeholder" id="vendor-form-placeholder">` 整個 div 刪掉或加 `style="display:none;"`。

招生那邊同樣處理。

#### 4.5 推上 GitHub

```powershell
git add index.html
git commit -m "嵌入 Google Forms 兩份"
git push
```

1-2 分鐘後 GitHub Pages 自動重新部署。

---

### 階段 5（可選）：高級設定

#### 5.1 啟用 OG / 分享預覽圖

`index.html` 內 `<meta property="og:image" content="...">` 還沒設。建議：
- 用 Figma / Canva 做一張 1200×630 的分享圖（含 logo + slogan）
- 存成 `assets/og-image.png` 放 repo
- 加 `<meta property="og:image" content="https://outreach.ctone.com.tw/assets/og-image.png">`

#### 5.2 開啟 Cloudflare proxy（橘雲）取得 Web Analytics

`outreach.ctone.com.tw` HTTPS 簽好後，可回 Cloudflare → DNS → 把該 CNAME 的橘雲打開。打開後可享：
- Cloudflare CDN 加速
- Cloudflare Web Analytics（無 cookie 的訪客統計）
- Bot 防護

#### 5.3 加 favicon
建 `assets/favicon.svg`，於 `<head>` 加：

```html
<link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
```

---

## 🔁 後續維護

| 場景 | 操作 |
| --- | --- |
| 改文案 | 編輯 `Youth_AI_LPage/index.html`，於 `d:\AI-Code\Public` 走「日常更新流程」push 後 1-2 分鐘上線 |
| 換場次日期 | 搜尋「SESSION 1」「SESSION 2」逐字改 |
| 加第三個說明會場次 | 複製 `.sched-card` 整塊 div 改字 |
| 改表單欄位 | 直接編 Google Form，前端不用動 |
| 看回覆 | Google Form 的「回覆」分頁 / 連動的 Google Sheet |

---

## 📌 雷區提醒（從既有專案經驗萃取）

1. **Google Form 檔案上傳強制 Google 登入**：若有廠商 / 學員沒 Google 帳號，需在說明文字註明可改寄 Email
2. **GitHub Pages 首次部署有 cache**：改完 push 後若沒看到變化，先按 Ctrl+F5 強制重整
3. **push 前先 rebase**：本站與 Public repo 共用 `main`，push 前務必 `git pull --rebase origin main`，否則會被「tip is behind」擋下
4. **路徑別搞錯**：git 操作在 `d:\AI-Code\Public`（repo 根），不是 `Youth_AI_LPage\` 子目錄
5. **commit message 中文**：用 `git commit -m "..."` 一行送，**不要**先寫成 file 再 `-F`，PS 5.1 會加 BOM
6. **Cloudflare 橘雲 vs 灰雲**（僅自有網域時）：第一次驗證 SSL 時必須灰雲，否則 GitHub 那邊憑證簽不出來

---

## 🎯 上線時程建議

| 時程 | 工作 | 狀態 |
| --- | --- | --- |
| Day 0 | 推上 `ChihtengChen/Public` + GitHub Pages 跑起來（`chihtengchen.github.io/Public/Youth_AI_LPage/`） | ✅ 已完成（2026-05-15） |
| Day 1 | 兩份 Google Form 建完 + 內部測試填一遍 | ⬜ 待辦 |
| Day 1 | 表單 ID 貼回 index.html + push | ⬜ 待辦 |
| Day 2+ | （可選）改用自有網域：另建獨立 repo + Cloudflare DNS + 等 HTTPS 簽完 | ⬜ 可選 |
| 隨時 | 開始對外發布網址（FB / 公會 / Email） | 🟢 現網址即可用 |

---

## 👥 製作

- **內容主撰**：Allen 老師（AIBILA 團隊）
- **整合設計**：採廠商版深藍金色基底 + 招生版青色點綴
- **產出日期**：2026-05-15

> 本檔為對外廣宣 Landing 站點，與 `learn.ctone.com.tw`（教材站）職責分離。
