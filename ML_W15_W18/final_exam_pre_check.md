# ✅ W18 期末考 — 考前自查清單

> 焦慮的來源是「考場第一分鐘還在裝套件」。把這份清單做完，你考試當天可以多睡 2 小時。

---

## 🗓️ T-48 小時（考前兩天）

完成後請**截圖上傳 TronClass「W18 考前確認」欄位**（每項一張，共 7 張）。
**未繳交者考試當天若環境出問題，恕無法臨場處理。**

### ✅ Python 環境

- [ ] **#1 套件 import 測試**
  打開你平常用的 Jupyter / VS Code，新建 cell 跑：
  ```python
  import sys, sklearn, pandas, numpy, matplotlib, seaborn
  print(f"Python: {sys.version.split()[0]}")
  print(f"sklearn: {sklearn.__version__}  (需 >= 1.0)")
  print(f"pandas: {pandas.__version__}  (需 >= 1.5)")
  print(f"numpy:  {numpy.__version__}")
  ```
  > 任一個套件 ImportError → 終端機跑 `pip install -U <套件名> --break-system-packages`

- [ ] **#2 中文字型測試**
  ```python
  import matplotlib.pyplot as plt
  plt.rcParams['font.sans-serif'] = ['Microsoft JhengHei', '微軟正黑體', 'sans-serif']
  plt.rcParams['axes.unicode_minus'] = False
  fig, ax = plt.subplots()
  ax.set_title('測試中文 — 達標率 62%')
  ax.bar(['達標', '未達標'], [62, 38])
  plt.savefig('font_test.png', dpi=120)
  plt.show()
  ```
  > 標題出現中文 = 通過。出現方塊「□□」= 字型沒裝，請改用 `Noto Sans CJK TC` 或 `PingFang TC`

### ✅ 資料就緒

- [ ] **#3 資料下載與讀取**
  從 TronClass 下載 `train.csv` / `test.csv` / `data_card.md` 三檔。確認讀取正常：
  ```python
  import pandas as pd
  train = pd.read_csv('train.csv')
  test  = pd.read_csv('test.csv')
  print(train.shape, test.shape)  # 預期 (2482, 18) (1065, 18)
  ```

- [ ] **#4 資料卡已讀過至少一遍**
  特別注意：(a) `target_met` 不平衡 62:38 (b) 7 欄有缺失 (c) `batch_id` / `production_date` 不可當特徵 (d) `pos_label=0` = 未達標為正類

### ✅ AI 工具就緒

- [ ] **#5 GenAI 工具登入測試**
  你打算用哪一個？ **____________**（ChatGPT / Claude / Gemini / Copilot 任選）
  確認當天能正常登入、能上傳圖片、有對話額度。

  > ⚠️ 建議**準備備援**：主用 ChatGPT，備援 Claude（或反之）。考試當天若一個爆掉你不會慌。

### ✅ 繳交流程就緒

- [ ] **#6 TronClass 上傳測試**
  上傳 `font_test.png`（隨便檔）到「W18 期末考實作」測試格 → 確認上傳成功 → **記得刪除**

- [ ] **#7 三個檔名範本已寫好**
  考試當天直接複製貼上，避免手忙腳亂打錯：
  ```
  學號姓名_W18Final.ipynb
  學號姓名_W18Hero.png
  學號姓名_W18Slides.pdf
  ```
  替換成你的真實學號姓名後存到桌面便利貼／記事本。

---

## ☀️ 考試當天 09:00（考前 10 分鐘）

進考場前，最後 5 個動作：

| # | 動作 | 為什麼 |
|---|---|---|
| 1 | 把 W17 講義「首頁圖七原則 + SCQA 對照表」**列印** 或開分頁 | 你會在 15 分鐘後忘記 |
| 2 | 開好 `final_exam_template.md` 一個分頁 | 不要從零開始打字 |
| 3 | 開好 `data_card.md` 一個分頁 | 隨時對照欄位定義 |
| 4 | 開好你選的 GenAI 工具 + 一個空白對話 session | 不要跟昨天的對話混在一起 |
| 5 | 確認桌面有 `train.csv` / `test.csv` 兩檔 | 考場可能無法下載 |

---

## 🚨 考試中緊急狀況處理

### 環境炸鍋（套件 ImportError、kernel 死掉）
1. **不要 reinstall**（時間不夠）
2. 改用 **Google Colab**（免費、瀏覽器即跑）：
   - 上傳 `train.csv` `test.csv` 到 Colab
   - `!pip install scikit-learn==1.3` 一行解決
3. 5 分鐘內仍無法解 → 舉手請 TA

### 時間不夠（已到 10:30，模型還沒比較完）
**砍掉 1 個模型，保留敘事**——只訓練 1 個模型完整跑完，比 2 個半成品好。
寧可在簡報寫「考量時間限制，本次僅完成 KNN，DecisionTree 為下一步」，**也不要交一份跑不動的 Notebook**。

### 首頁圖畫不出來（matplotlib 報錯）
退而求其次：直接截圖 Cell 7 的混淆矩陣，**用小畫家加上結論式標題**，存成 PNG。
**有圖 > 沒圖**，醜一點不會 0 分，缺檔才會 0 分。

### AI 對話到一半被限制（GPT-4 額度滿了）
1. 切換到備援工具（你 #5 設好的那個）
2. 把目前進度貼到新對話，請 AI 接續：
   ```
   我正在進行 ML 期末考，已完成以下進度：[貼程式碼片段]
   接下來請幫我 [下一步任務]
   ```

---

## 📋 11:00 收卷前 5 分鐘最終檢查

按順序執行：

- [ ] **#1 Restart Kernel → Run All**：Notebook 從頭跑到尾無錯
- [ ] **#2 三檔命名正確**（學號姓名拼字對、副檔名對）
- [ ] **#3 三檔大小符合限制**（ipynb < 20MB、PNG < 3MB、PDF < 10MB）
- [ ] **#4 AI 引用 cell 已填寫**（至少 3 列）
- [ ] **#5 上傳 TronClass + 截圖留證**（手機拍螢幕也可）

---

## 🎯 一頁帶走

> **「環境不是技術問題，是心態問題。」**
>
> 考場炸鍋的 80% 案例不是 sklearn 不會，是 **matplotlib 中文變方塊、檔名打錯、上傳超時**。
> 這些都不會考你的程度，卻會吃你的分數——所以**今天就把它解決**。

---

_自查清單版本：v1.0 ｜ 配套文件：`final_exam_practical_brief.md`（題本）、`final_exam_template.md`（範本）_
