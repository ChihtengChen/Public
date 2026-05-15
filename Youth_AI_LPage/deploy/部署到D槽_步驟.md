# 部署到 D:\AI-Code\Public\Youth_AI_LPage\ 完整步驟

> 對應 memory 架構：OneDrive = 內容工坊 / 源檔；D:\AI-Code = git repo / 部署管線
>
> **本檔放在 OneDrive 端 (`07_OutreachLanding/deploy/`)，但所有命令在 D:\ 端 PowerShell 執行。**

---

## 🚨 2026-05-15 事故修正（務必先讀）

舊版本檔把 `07_OutreachLanding` 用 **`robocopy /MIR`** 灌進 **課程教材 repo** `D:\AI-Code\youth-ai-coursesite\`。`/MIR` 是鏡像模式 —— 會**刪掉目標端源端沒有的一切**；因 `07_OutreachLanding` 沒有 `CourseSite/`，整個課程教材站被清空（188 檔，git commit `3e270bd`）。

**修正後的鐵則：**

1. landing 與課程站是**兩個獨立 repo**，部署目標分開：
   - landing → `D:\AI-Code\Public\Youth_AI_LPage\`（本檔對象）
   - 課程站 → `D:\AI-Code\youth-ai-coursesite\`（**本檔絕不碰**）
2. 一律用 **`/E`（只複製新增/更新，不鏡像刪除）**，**永不再用 `/MIR`**。
3. robocopy 前有路徑防呆，目標若不是 `...\Youth_AI_LPage` 直接中止。

---

## 🎯 目標

把 `C:\Users\chenc\OneDrive\Claude\Claude_Pj\Youth_AI\07_OutreachLanding\` 的內容同步到 `D:\AI-Code\Public\Youth_AI_LPage\`，推上 GitHub，開啟 GitHub Pages。

> 現況：`D:\AI-Code\Public\Youth_AI_LPage\` 已建立、git 已 init、已有首次 commit（`e94747c`）。
> 因此 STEP 3 / STEP 4 多數情況可跳過，直接從 STEP 5（建 GitHub repo）接續；
> 日常維護走 STEP 10。

---

## STEP 0 · 開新的 D:\ 端 PowerShell（不是 cowork）

在 Windows 開 PowerShell（建議 PowerShell 7，PS 5.1 也行但要注意編碼）。先設好 UTF-8 console 避免中文亂碼：

```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
chcp 65001
```

---

## STEP 1 · 同步源檔（安全版 robocopy /E + 防呆）

```powershell
$src = "C:\Users\chenc\OneDrive\Claude\Claude_Pj\Youth_AI\07_OutreachLanding"
$dst = "D:\AI-Code\Public\Youth_AI_LPage"

# ── 防呆 1：目標必須是 landing repo（路徑結尾 Youth_AI_LPage）──
if ($dst -notmatch '\\Youth_AI_LPage\\?$') {
    Write-Host "中止：目標路徑不是 Youth_AI_LPage → $dst" -ForegroundColor Red; return
}
# ── 防呆 2：絕不可指向課程 repo ──
if ($dst -match 'youth-ai-coursesite') {
    Write-Host "嚴重中止：目標是課程教材 repo，會重演 2026-05-15 事故" -ForegroundColor Red; return
}

New-Item -Path $dst -ItemType Directory -Force | Out-Null

# /E = 複製含子目錄(不刪除目標端多出來的)。永不用 /MIR。
# /XD 排除 .git 等；/XF 排除 .gitignore(由 repo 管理，不被 OneDrive 覆蓋)與 OS 殘留
robocopy $src $dst /E /XD .git node_modules .vscode /XF .gitignore Desktop.ini Thumbs.db .DS_Store /NFL /NDL /NJH /NJS /NC /NS

if ($LASTEXITCODE -le 7) { Write-Host "Copy OK (exit $LASTEXITCODE)" -ForegroundColor Green }
else { Write-Host "Copy FAILED (exit $LASTEXITCODE)" -ForegroundColor Red }
```

> robocopy 結束碼：0=沒檔案複製、1=有複製、2=有額外目標檔（**/E 不會刪，只列出**）、3=兩者皆是、>=8=錯誤。
> **`/E` 不會刪除目標端多出來的檔案**（與 `/MIR` 的關鍵差異）。若 OneDrive 端真的刪了某檔要同步刪除，請**手動**在 repo 端 `git rm` 該檔，不要靠鏡像。

---

## STEP 2 · 切到 D:\ 並驗證內容

```powershell
cd D:\AI-Code\Public\Youth_AI_LPage

ls
# 應看到：index.html, README.md, .gitignore, .nojekyll, assets\, forms\, deploy\
```

確認看到 `index.html` 與 `assets\logo.svg` 才往下做。

---

## STEP 3 · 初始化 git repo（已完成，通常跳過）

> 本 repo 已 `git init` 並有首次 commit（`e94747c`）。僅在全新環境重建時才需要：

```powershell
git init
git branch -M main
git config core.autocrlf true
git config i18n.commitEncoding utf-8
git config i18n.logOutputEncoding utf-8
```

---

## STEP 4 · 提交變更

**避開 PS 5.1 commit message BOM 雷區（見 memory `feedback_ps_outfile_utf8_bom.md`）— 用一行 `git commit -m` 直接送，不要寫進檔案再 -F。**

```powershell
git add .
git status   # 確認改了什麼

git commit -m "update: <英文摘要，或先 chcp 65001 再用中文>"
```

> 第一次 commit 已用英文完成。後續中文 commit 訊息在 PS 5.1 跑請先確認 `chcp 65001`。

---

## STEP 5 · 在 GitHub 建 repo（瀏覽器操作）

1. 登入 https://github.com → 右上 `+` → `New repository`
2. **Repository name**：`youth-ai-landing`
   ⚠️ **不可**用 `youth-ai-coursesite`（那是課程教材站的 repo，會撞名）
3. **Visibility**：Public（GitHub Pages 免費版需公開）
4. **不要勾**：Add a README / .gitignore / license（已在本機有）
5. 按 `Create repository`
6. 複製建好頁面顯示的 `git remote add origin …` URL 待會用

---

## STEP 6 · 連結遠端並推上去

回到 PS（仍在 `D:\AI-Code\Public\Youth_AI_LPage\`）：

```powershell
# 把 YOUR_USERNAME 換成你的 GitHub 帳號
git remote add origin https://github.com/YOUR_USERNAME/youth-ai-landing.git

git push -u origin main
```

> 第一次 push 可能跳瀏覽器要 GitHub 帳密 / PAT。已設 GitHub CLI / Git Credential Manager 則直接過。

---

## STEP 7 · 開啟 GitHub Pages

1. GitHub repo 頁面 → `Settings`
2. 左側 → `Pages`
3. **Source**：`Deploy from a branch`
4. **Branch**：`main` + `/ (root)` → `Save`
5. 等 1-2 分鐘，頂端顯示 `Your site is live at https://YOUR_USERNAME.github.io/youth-ai-landing/`
6. **複製這個網址** — 下一步回填進 index.html footer

---

## STEP 8 · 把網址回填到 footer 的「專案網站: 待定」

```powershell
code D:\AI-Code\Public\Youth_AI_LPage\index.html
# 或 notepad D:\AI-Code\Public\Youth_AI_LPage\index.html
```

搜尋 `專案網站:`，找到：

```html
<li>專案網站:<span style="color:rgba(255,255,255,.5);">待定</span></li>
```

替換為（網址換成你剛拿到的）：

```html
<li>專案網站:<a href="https://YOUR_USERNAME.github.io/youth-ai-landing/" target="_blank" rel="noopener">YOUR_USERNAME.github.io/youth-ai-landing</a></li>
```

存檔後：

```powershell
git add index.html
git commit -m "footer: fill in github pages url"
git push
```

> ⚠️ 這次是少數「直接在 D:\ 端改檔」的例外。改完記得把同樣修改回寫 OneDrive 端 `07_OutreachLanding\index.html`，否則下次 STEP 1 同步（`/E` 不覆蓋較舊… 實際 robocopy 預設較新覆蓋舊）會造成兩端不一致。最穩做法：footer 網址直接改在 OneDrive 源檔，再跑 STEP 1。

1-2 分鐘後網站自動重新部署。

---

## STEP 9（可選，將來才做）· 綁自有子網域

當決定用 `outreach.ctone.com.tw` 或 `join.ctone.com.tw` 等子網域時：

### 9a 建 CNAME 檔案
```powershell
"outreach.ctone.com.tw" | Out-File -FilePath "D:\AI-Code\Public\Youth_AI_LPage\CNAME" -Encoding ASCII -NoNewline
git add CNAME
git commit -m "add CNAME for outreach.ctone.com.tw"
git push
```

> 用 `-Encoding ASCII` 避免 PS 5.1 加 BOM；CNAME 絕不能有 BOM 否則 GitHub Pages 拒絕。
> CNAME 也要在 STEP 1 的 robocopy 後保住 — 它不在 OneDrive 源，但 `/E` 不刪除目標端多出檔，安全；若擔心可加進 `/XF` 清單。

### 9b Cloudflare DNS

Cloudflare → ctone.com.tw → DNS → Add record：

| Type | Name | Target | Proxy |
| --- | --- | --- | --- |
| CNAME | outreach | YOUR_USERNAME.github.io | **DNS only（灰雲）** |

> ⚠️ 第一次設定務必灰雲。等 GitHub 端 HTTPS 簽好後再切回橘雲。

### 9c 等 + 驗證
- DNS 5-15 分鐘生效
- GitHub Settings → Pages → 確認 "DNS check successful"
- 勾 `Enforce HTTPS`，等 5-30 分鐘 Let's Encrypt 簽完憑證

---

## STEP 10 · 後續維護循環

源檔仍在 OneDrive `07_OutreachLanding\`，每次改完要部署：

```powershell
$src = "C:\Users\chenc\OneDrive\Claude\Claude_Pj\Youth_AI\07_OutreachLanding"
$dst = "D:\AI-Code\Public\Youth_AI_LPage"
if ($dst -notmatch '\\Youth_AI_LPage\\?$' -or $dst -match 'youth-ai-coursesite') {
    Write-Host "中止：目標路徑不安全 → $dst" -ForegroundColor Red; return
}

# 永遠 /E，永不 /MIR
robocopy $src $dst /E /XD .git node_modules .vscode /XF .gitignore Desktop.ini Thumbs.db /NFL /NDL /NJH /NJS /NC /NS

cd $dst
git status
git add .
git commit -m "update: <英文摘要 或先 chcp 65001>"
git push
```

> `/E` 只新增/更新，**不會刪除目標端多出來的檔案**。OneDrive 端刪檔不會自動同步刪除 — 需在 repo 端手動 `git rm`。這正是用來換掉會誤刪整個 repo 的 `/MIR`。

---

## ⚠️ 雷區 checklist

| 風險 | 怎麼避 |
| --- | --- |
| **robocopy /MIR 跨產品誤刪（2026-05-15 事故）** | **永不用 /MIR；一律 /E；跑前路徑防呆，目標非 Youth_AI_LPage 即中止** |
| 目標誤指課程 repo | 防呆 2：`$dst -match 'youth-ai-coursesite'` 即中止 |
| .gitignore 被 OneDrive 覆蓋 | robocopy `/XF .gitignore`（repo 管理，不從源同步）|
| PS 5.1 commit msg BOM | 用 `git commit -m "..."` 一行 inline，不寫檔再 -F |
| PS 5.1 中文 .ps1 cp950 讀錯 | 本檔不寫 .ps1，PS 命令以 .md 複製貼上提供 |
| 中文 commit msg 亂碼 | 第一次用英文；之後要中文先 `chcp 65001` |
| CNAME 大小寫 | 全小寫 `outreach.ctone.com.tw` |
| CNAME BOM | 用 `-Encoding ASCII -NoNewline`，絕不用 `-Encoding utf8` |
| Cloudflare 橘雲 | 第一次驗證 SSL 必須灰雲 |

---

## 📋 預期狀態（檢驗用）

- ✅ `D:\AI-Code\Public\Youth_AI_LPage\` 內含：`index.html` / `README.md` / `.gitignore` / `.nojekyll` / `assets/` / `forms/` / `deploy/`
- ✅ GitHub repo `YOUR_USERNAME/youth-ai-landing` public 可看（**非** youth-ai-coursesite）
- ✅ `https://YOUR_USERNAME.github.io/youth-ai-landing/` 可開、tab 切換正常、LOGO 顯示
- ✅ Footer 「專案網站」欄已填上 github.io 網址
- ✅ 課程 repo `D:\AI-Code\youth-ai-coursesite\` 完全未被本流程觸碰

---

## 🆘 如果某步卡關

| 症狀 | 排查 |
| --- | --- |
| `git: command not found` | 沒裝 Git for Windows → git-scm.com 下載 |
| `robocopy` 失敗 | 確認 OneDrive 沒在同步那資料夾（暫停 OneDrive）|
| `git push` 跳 auth | 安裝 Git Credential Manager 或 `gh auth login` |
| GitHub Pages 沒上線 | Settings → Pages 看 build 狀態；強制 Ctrl+F5 重整 |
| LOGO 顯示破圖 | 檢查 `assets/logo.svg` 是否有 push（`git ls-files | Select-String logo`）|
| 改檔後沒更新 | Pages build 需 1-2 分鐘；本機 hard refresh Ctrl+F5 |
| 兩端內容不一致 | 一律以 OneDrive `07_OutreachLanding` 為準，改源檔後重跑 STEP 1 |

---

**完成時間預估**：流暢執行約 25 分鐘（含 GitHub 建 repo 與等 Pages build）
