# 部署 / 維護步驟 — Youth_AI_LPage

> **現況（2026-05-15 起）**：本站直接住在 `d:\AI-Code\Public\Youth_AI_LPage\`，
> 是公開 repo [`ChihtengChen/Public`](https://github.com/ChihtengChen/Public)
> 的一個子目錄，透過該 repo **已啟用**的 GitHub Pages 對外發布。
>
> **線上網址**：<https://chihtengchen.github.io/Public/Youth_AI_LPage/>

---

## 🗑️ 舊流程已作廢（務必先讀）

本檔早期描述的流程**已全部停用**，不要再照做：

| 舊流程（已廢） | 為何廢 / 現在怎麼做 |
| --- | --- |
| OneDrive `07_OutreachLanding` ─robocopy→ D:\ 雙軸同步 | **不再用 robocopy**。直接在 `d:\AI-Code\Public\Youth_AI_LPage\` 編輯即可，這裡就是唯一 source of truth |
| 另建獨立 repo `youth-ai-landing` | **不另建 repo**。已併入既有 `ChihtengChen/Public` 子路徑 |
| `git init` / 設遠端 / 首次 push | 已完成且已移除巢狀 `.git`，改由 Public repo 統一版控（原獨立 repo 歷史已備份成 bundle，見下） |
| 手動到 Settings → Pages 開 Pages | Public repo **早已啟用** Pages（`main`/root），push 後自動重建 |

> 📜 **歷史備份**：原 `Youth_AI_LPage` 獨立 repo（`init` + deploy SOP 修正兩個 local commit、無遠端）已 `git bundle` 備份於
> `%TEMP%\Youth_AI_LPage_history.bundle`，需要時 `git clone <bundle>` 可還原。

### ⚠️ 2026-05-15 robocopy /MIR 事故（保留作為鐵則由來）

舊版曾用 **`robocopy /MIR`**（鏡像模式，會刪掉目標端源端沒有的一切）把 landing 灌進
**課程教材 repo** `D:\AI-Code\youth-ai-coursesite\`，導致整個課程站被清空（188 檔，commit `3e270bd`）。

**由此確立、至今仍有效的鐵則：**

1. landing 與課程站是**兩個獨立目標**，本檔**絕不碰** `D:\AI-Code\youth-ai-coursesite\`。
2. **永不使用 `/MIR` 或任何鏡像刪除**。現在根本不跑 robocopy，風險已從源頭移除。

---

## 🎯 目前唯一要做的事：改檔 → 推上線

### STEP 0 · 開 PowerShell，設好 UTF-8（中文 commit 必要）

```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
chcp 65001
```

### STEP 1 · 直接編輯站點檔案

站點根目錄就是 `d:\AI-Code\Public\Youth_AI_LPage\`，直接改：

```powershell
code d:\AI-Code\Public\Youth_AI_LPage\index.html
```

常見改動位置：

| 場景 | 操作 |
| --- | --- |
| 改文案 | 直接編輯 `index.html` |
| 換場次日期 | 搜尋「SESSION 1」「SESSION 2」逐字改 |
| 加說明會場次 | 複製 `.sched-card` 整塊 div 改字 |
| 嵌入 Google Form | 把 `REPLACE_WITH_VENDOR_FORM_ID` / `REPLACE_WITH_STUDENT_FORM_ID` 換成表單 ID（細節見 `../README.md` 階段 4）|

> footer「專案網站」要填的話，直接填本站正式網址
> `https://chihtengchen.github.io/Public/Youth_AI_LPage/`。

### STEP 2 · 從 Public repo 根目錄提交並推上去

⚠️ **git 操作在 `d:\AI-Code\Public`（repo 根），不是 `Youth_AI_LPage\` 子目錄。**

```powershell
cd d:\AI-Code\Public

git add Youth_AI_LPage
git status                       # 確認改了什麼

git commit -m "Youth_AI_LPage: <英文摘要，或已 chcp 65001 後用中文>"

git pull --rebase origin main    # 必做：本站與 Public 共用 main，先同步免得 push 被拒
git push origin main
```

push 後 1–2 分鐘 GitHub Pages 自動重新部署。

### STEP 3 · 驗證

- 開 <https://chihtengchen.github.io/Public/Youth_AI_LPage/>
- 沒看到變化先 `Ctrl+F5` 強制重整（Pages 首次/CDN cache）
- 確認 tab 切換正常、LOGO（`assets/logo.svg`）顯示正常

---

## STEP 4（可選 · 未啟用）· 自有子網域

目前用 `chihtengchen.github.io/Public/Youth_AI_LPage/` 已足夠。

⚠️ **重要限制**：GitHub Pages 的 `CNAME` / 自有網域是綁定**整個 repo**。在 `ChihtengChen/Public`
加 `CNAME` 會把**整個 Public 站**接到該網域，不適合只給本子站用。
若真的要走自有網域（如 `outreach.ctone.com.tw`），應**改成另建獨立 repo**
（可用上面備份的 bundle 還原歷史），再做：

1. 獨立 repo 根目錄建 `CNAME`（無 BOM）：
   ```powershell
   "outreach.ctone.com.tw" | Out-File -FilePath CNAME -Encoding ASCII -NoNewline
   git add CNAME; git commit -m "add CNAME"; git push
   ```
2. Cloudflare → ctone.com.tw → DNS → Add record：`CNAME outreach → chihtengchen.github.io`，
   **第一次務必 DNS only（灰雲）**，等 GitHub HTTPS 簽好後再切橘雲。
3. GitHub Settings → Pages 確認 "DNS check successful" → 勾 `Enforce HTTPS`（Let's Encrypt 5–30 分鐘）。

---

## ⚠️ 雷區 checklist

| 風險 | 怎麼避 |
| --- | --- |
| **誤用 robocopy /MIR 跨產品誤刪（2026-05-15 事故）** | 現流程**不跑 robocopy**；永不用 /MIR；絕不碰 `youth-ai-coursesite` |
| **push 被「tip is behind」擋下** | push 前一定 `git pull --rebase origin main`（與 Public repo 共用 main）|
| **git 路徑搞錯** | 在 `d:\AI-Code\Public`（repo 根）操作，不是 `Youth_AI_LPage\` 子目錄 |
| **PS 5.1 commit msg BOM** | 用 `git commit -m "..."` 一行 inline，不寫檔再 `-F` |
| **中文 commit msg 亂碼** | 先 `chcp 65001`，或直接用英文摘要 |
| **改完沒上線** | Pages build 需 1–2 分鐘；`Ctrl+F5` hard refresh |
| **誤在 Public 加 CNAME** | CNAME 綁整個 repo；要自有網域請改另建獨立 repo（見 STEP 4）|

---

## 📋 預期狀態（檢驗用）

- ✅ 站點檔案在 `d:\AI-Code\Public\Youth_AI_LPage\`：`index.html` / `README.md` / `.gitignore` / `.nojekyll` / `assets/` / `forms/` / `deploy/`
- ✅ 已 push 到 `ChihtengChen/Public` 的 `main`，**非** `youth-ai-coursesite`、**非**獨立 `youth-ai-landing`
- ✅ <https://chihtengchen.github.io/Public/Youth_AI_LPage/> 可開、tab 切換正常、LOGO 顯示
- ✅ 課程 repo `D:\AI-Code\youth-ai-coursesite\` 完全未被觸碰

---

## 🆘 卡關排查

| 症狀 | 排查 |
| --- | --- |
| `git push` 跳 auth | Git Credential Manager 已存 `ChihtengChen` 的 token；若失效重新登入 GitHub |
| `git push` 被 reject (non-fast-forward) | 先 `git pull --rebase origin main` 再 push |
| GitHub Pages 沒更新 | repo Settings → Pages 看 build 狀態；`Ctrl+F5` 強制重整 |
| LOGO 破圖 | 確認 `assets/logo.svg` 有被追蹤：`git ls-files Youth_AI_LPage \| Select-String logo` |

---

> 本檔為 Youth_AI_LPage 對外廣宣站的部署/維護 SOP，與課程教材站（`youth-ai-coursesite`）職責分離。
> 內容流程同步見同層 `../README.md`。
