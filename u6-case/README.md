# U6 中科扣件案例 · 整合網頁

## 內容
整合「學員導讀」與「案例背景」為單一網頁（雙頁籤），供淨零碳管理實作 U6 案例使用。

## 檔案
- `index.html` — 主網頁（含兩個頁籤：學員導讀 / 案例背景）
- `U6_廠區配置圖_中科扣件台中廠.png` — 廠區平面配置圖
- `U6_生命週期階段圖_Cradle-to-Gate.png` — 產品生命週期階段圖

## 部署至 GitHub Pages

### 方式 1：推送到 `Public` repo 的 `u6-case/` 子資料夾

```bash
# 1. 將此整個 u6-case/ 資料夾複製到本地 clone 好的 Public repo 中
cp -r u6-case/ ~/path/to/Public/

# 2. 進入 repo 目錄
cd ~/path/to/Public

# 3. 提交並推送
git add u6-case/
git commit -m "U6 中科扣件案例整合網頁"
git push origin main
```

### 啟用 GitHub Pages

1. 前往 https://github.com/ChihtengChen/Public/settings/pages
2. **Source** 選擇 `Deploy from a branch`
3. **Branch** 選擇 `main` + `/(root)`，按 **Save**
4. 等 1-2 分鐘即可訪問：

### 最終網址

**https://chihtengchen.github.io/Public/u6-case/**

## 頁籤結構

- **📖 學員導讀**：平易敘事版，W12 課前預習用
- **📋 案例背景**：技術性參考資料，含數據、係數、分配邏輯等

## 修訂歷程
- v1.0 (2026-04-17)：初版建立
