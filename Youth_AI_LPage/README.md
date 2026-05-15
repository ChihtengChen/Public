# 智慧物流人才培育專案 · 廣宣 Landing

> 工研院服科中心 × 臺中科大 AIBILA Lab. · 經濟部商業發展署 115-116 年度計畫
> 整合「廠商說明會」與「招生說明會」兩個對外說明場景的單頁站點

---

## 📂 目錄結構

```
07_OutreachLanding/
├── index.html                         ← 整合主檔（首頁 + 廠商頁籤 + 招生頁籤）
├── README.md                          ← 本檔（部署指南）
├── CNAME                              ← GitHub Pages 綁自有子網域用（部署時建）
└── forms/
    ├── 01_廠商說明會表單規格.md       ← 廠商 Google Form 欄位逐項規格
    └── 02_招生說明會表單規格.md       ← 學員 Google Form 欄位逐項規格
```

---

## 🧩 三個頁籤的內容架構

### Tab 1 · 首頁 · 育合用好（核心理念）
- ITRI 服科中心 DNA 宣言 — **從技術輔導輸出,到人才培育、技術落地、產業升級的統合進化，成為育合用好的智慧生態系推手**
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

## 🚀 GitHub Pages 部署完整流程

> **D:\ 端執行**：本專案採「OneDrive = 內容工坊 / D:\AI-Code = git 部署管線」雙軸架構。所有 git 操作在 `D:\AI-Code\youth-ai-coursesite\` 進行，本資料夾（OneDrive 端）為 source of truth。
>
> 📖 **完整 D:\ 部署 SOP**：`deploy/部署到D槽_步驟.md`（10 個 step、含雷區 checklist、複製貼上即可執行）

### 階段 1：建立 GitHub Repository

#### 1.1 在 GitHub 建新 repo
1. 登入 https://github.com → 右上 `+` → `New repository`
2. **Repository name**：建議 `youth-ai-logistics-landing`（全小寫、連字號）
3. **Description**：`青年 AI 實戰養成班 · 智慧物流班 — 廠商與招生說明會整合 Landing`
4. **Public**（GitHub Pages 免費版需要 public）
5. **不要勾**：Add a README / .gitignore / license（之後從本地推上去）
6. 按 `Create repository`

#### 1.2 本地上傳檔案
打開 PowerShell，切到本目錄：

```powershell
cd "C:\Users\chenc\OneDrive\Claude\Claude_Pj\Youth_AI\07_OutreachLanding"

# 初始化 git
git init
git add .
git commit -m "初版：整合廠商說明會 + 招生說明會 Landing"

# 連結遠端（YOUR_USERNAME 換成你的 GitHub 帳號）
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/youth-ai-logistics-landing.git
git push -u origin main
```

> ⚠️ **PS 5.1 BOM 雷**：commit message 含中文時請用 `git commit -m "..."` 一行指令直接送，**不要**先 `Out-File commit_msg.txt -Encoding utf8` 再 `git commit -F commit_msg.txt`，會被加 UTF-8 BOM。

---

### 階段 2：開啟 GitHub Pages

1. 進入 repo → `Settings` 分頁
2. 左側選單 → `Pages`
3. **Source**：選 `Deploy from a branch`
4. **Branch**：選 `main` + `/ (root)` → `Save`
5. 等 1–2 分鐘，頁面頂端會顯示 `Your site is live at https://YOUR_USERNAME.github.io/youth-ai-logistics-landing/`
6. 點進去確認頁面能跑、tab 切換正常

> 此時你已有一個可公開瀏覽的網址，可先用此網址做說明會宣傳。

---

### 階段 3：綁自有子網域（建議 `outreach.ctone.com.tw` 或 `join.ctone.com.tw`）

> 因為 ctone.com.tw 已在 Cloudflare 管理（參見 memory `reference_infra_ids.md`），這裡用 Cloudflare DNS 接到 GitHub Pages。

#### 3.1 建立 CNAME 檔案

在 repo 根目錄建一個檔案 `CNAME`（無副檔名）內容就是子網域：

```
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
| 改文案 | 直接編輯 `index.html`，`git push` 後 1-2 分鐘上線 |
| 換場次日期 | 搜尋「SESSION 1」「SESSION 2」逐字改 |
| 加第三個說明會場次 | 複製 `.sched-card` 整塊 div 改字 |
| 改表單欄位 | 直接編 Google Form，前端不用動 |
| 看回覆 | Google Form 的「回覆」分頁 / 連動的 Google Sheet |

---

## 📌 雷區提醒（從既有專案經驗萃取）

1. **Google Form 檔案上傳強制 Google 登入**：若有廠商 / 學員沒 Google 帳號，需在說明文字註明可改寄 Email
2. **GitHub Pages 首次部署有 cache**：改完 push 後若沒看到變化，先按 Ctrl+F5 強制重整
3. **Cloudflare 橘雲 vs 灰雲**：第一次驗證 SSL 時必須灰雲，否則 GitHub 那邊憑證簽不出來
4. **CNAME 大小寫**：`outreach.ctone.com.tw` 全小寫，不能寫 `Outreach`
5. **commit message 中文**：用 `git commit -m "..."` 一行送，**不要**先寫成 file 再 `-F`，PS 5.1 會加 BOM

---

## 🎯 上線時程建議

| 時程 | 工作 |
| --- | --- |
| Day 0 | repo 建好 + 推上去 + 看見 `username.github.io/...` 跑起來 |
| Day 1 | 兩份 Google Form 建完 + 內部測試填一遍 |
| Day 1 | 表單 ID 貼回 index.html + push |
| Day 2 | Cloudflare DNS 設好 + 等 HTTPS 簽完 |
| Day 3 | 開啟 Cloudflare proxy + 確認分析 |
| Day 3+ | 開始對外發布網址（FB / 公會 / Email） |

---

## 👥 製作

- **內容主撰**：Allen 老師（AIBILA 團隊）
- **整合設計**：採廠商版深藍金色基底 + 招生版青色點綴
- **產出日期**：2026-05-15

> 本檔為對外廣宣 Landing 站點，與 `learn.ctone.com.tw`（教材站）職責分離。
