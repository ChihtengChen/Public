# 🎓 W18 期末考完整說明（學員版）

> **《機器學習》智工系二年級** ｜ 講師：陳志騰（Allen）、吳佩蓉
> 考試日期：W18 上午 09:10–11:20（130 分鐘）｜ 形式：個人實作 + **GenAI 全面開放協作**

---

## 0. 一句話定位

**這場考試不是 sklearn 比賽，是「讓沒寫過程式的廠長願意按你模型結果做決策」的測驗。**
技術只佔 25%，**敘事佔 75%**——前 17 週的累積，這 95 分鐘集中驗收。

---

## 1. 考試情境（背景故事）

某 PCB 廠 SMT 焊接產線，廠長想知道：

> 「下一批次到底會不會達標？哪個製程參數最該盯？」

你拿到 3,547 筆歷史批次資料（已切分 train 70% / test 30%），任務是訓練模型 + 做出讓廠長**5 秒看懂、30 秒下決定**的視覺報告。

> 💡 廠長角色設定：50 歲、不寫程式、討厭學術腔、最在意「漏判一個未達標批次的成本」。寫敘事時請設想是寫給他看。

---

## 2. 三檔繳交（**缺一檔當題零分**）

| 檔名格式 | 內容 | 大小限制 |
|---|---|---|
| `學號_姓名_W18Final.ipynb` | 完整 Notebook（EDA + 訓練 + 視覺化 + 結論 + **AI 對話引用**） | < 20 MB |
| `學號_姓名_W18Hero.png` | 一張首頁圖（≥ 1200×800 px，PNG） | < 3 MB |
| `學號_姓名_W18Slides.pdf` | 簡報 6 頁（**僅收 PDF**，避免 pptx/key 開不開的災難） | < 10 MB |

**上傳位置**：TronClass → 課程作業 → 「W18 期末考實作」(11:15 截止)
**範例**：`B12345678_王小明_W18Final.ipynb`

> ⚠️ 命名錯誤、副檔名錯、缺檔，TA 不另行通知，直接以該維度 0 分計入。

---

## 3. 時間表（130 分鐘）

| 時段 | 動作 | 時長 |
|---|---|---|
| 09:10–09:25 | 環境檢查、領題、**讀資料卡（必讀！）** | 15 min |
| 09:25–11:00 | **實作主體**（5 步驟，建議分配如下） | 95 min |
| 11:00–11:20 | 上傳檔案、TA 校驗檔名與完整性、不抽問 | 20 min |

### 95 分鐘建議節奏

```
EDA (15 分) → 預處理 (10) → 訓練 ≥2 模型 (15) → 比較與視覺化 (20)
→ 首頁圖 (15) → SCQA 敘事與簡報 (15) → 上傳緩衝 (5)
```

> 📌 **不要追求完美**：4 個模型不如 2 個寫透。寧可少訓練 1 個模型，也要留時間寫敘事。

---

## 4. 評分 Rubric（5 維度，總分 100）

| 維度 | 權重 | A (90+) | B (80-89) | C (70-79) | D (<70) |
|---|---|---|---|---|---|
| **K1 技術正確** | 25% | Pipeline 完整、預處理乾淨、評估指標 ≥3 個（含 recall） | 程式跑得動、指標 ≥2 個 | 只報 accuracy | 程式跑不動 |
| **K2 視覺編碼** | 20% | FT Vocabulary 用對、配色一致、無 chartjunk、軸標完整 | 1–2 處小問題 | 多處小問題 | 3D 圖、虹色畫類別 |
| **S1 「四個必畫」** | 15% | 4 張齊全且優化（資料分佈、相關、混淆、特徵重要性） | 缺 1 張或畫得粗糙 | 缺 2 張 | 缺 ≥3 張 |
| **S2 首頁圖** | 20% | 七原則全達 + **結論式標題** + annotation | 達 5–6 點 | 達 3–4 點 | 達 < 3 點 |
| **A 敘事 SCQA** | 20% | 4 階段完整、結構一致、廠長看得懂 | 4 階段在但結構亂 | 只有 1–2 階段 | 只列數據無敘事 |

> 🎯 **甜蜜點**：要拿 85+，「**首頁圖 + SCQA 敘事**」必須做好（合計 40%）；技術正確即可（25%），不必追求最高 accuracy。

---

## 5. 資料說明

完整資料卡：`output/W18_exam_dataset/data_card.md`（**考試前必讀**）

**速記**：3,547 筆 × 18 欄 → train 2,482 / test 1,065 → `target_met` 達標率 62%（輕度不平衡）→ 主訊號是 `reflow_zone3_temp` 與 `prev_batch_defect_rate`。

**地雷**：
- `batch_id`、`production_date` 不可當特徵
- 7 個欄位有缺失值（0.5% ~ 5%），必須處理
- 只報 accuracy 直接扣 K1 分數

---

## 6. 五個必做步驟 × AI 鷹架 Prompts

> 🤖 **核心原則**：AI 是你的副駕駛，不是代駕。**你必須能解釋 AI 給的每一行程式碼**。
> 每個步驟附 1–2 個 Prompt 範本，你可以照抄、改寫、串接——但**對話紀錄要保留並貼到 Notebook 末尾的「AI 引用」cell**。

---

### Step 1 — EDA：15 分鐘看懂這份資料（15 min）

**目標**：3 件事——資料規模、缺失分佈、類別不平衡與主訊號驗證。

#### 🤖 AI 鷹架 Prompt #1（EDA 規劃）

```
我正在進行機器學習期末考實作，資料是某 PCB 廠 SMT 焊接良率資料：
- 規模：2,482 筆訓練資料 × 18 欄
- 目標欄：target_met（1=達標，0=未達標），分佈約 62:38
- 已知主訊號：reflow_zone3_temp（峰值區溫度）與 prev_batch_defect_rate
- 有 7 個欄位含缺失值（0.5%–5%）
- 不可當特徵：batch_id（PK）、production_date（時間欄）

請扮演「資料科學家」，幫我規劃一份「15 分鐘 EDA 速戰清單」，
列出我必須畫的 5 張圖：
(a) 圖表類型與 sklearn / seaborn API
(b) 用哪幾個欄位
(c) 預期能回答什麼決策問題
(d) 看到什麼結果該觸發什麼後續動作（例如「若缺失 > 10% 就丟欄」）

請以表格輸出。
```

#### 🤖 AI 鷹架 Prompt #2（EDA 收斂）

```
請彙整以上互動，提供「100 字內」的 EDA 結論摘要，
並列出 3 個我在預處理階段必須處理的問題。
```

---

### Step 2 — 預處理：把資料變成模型吃得下的格式（10 min）

**目標**：用 `ColumnTransformer + Pipeline` 一站式處理。

#### 🤖 AI 鷹架 Prompt #3（預處理樣板）

```
請扮演「資深 ML 工程師」，幫我寫一段 sklearn 預處理 Pipeline 程式碼。需求：

資料欄位分類：
- 數值欄（10 個）：reflow_zone1~4_temp, belt_speed_cm_per_min, humidity_pct,
  batch_size, operator_years, machine_age_yrs, days_since_maintenance, prev_batch_defect_rate
- 類別欄（4 個）：shift, line_id, solder_paste_type, supplier
- 排除欄：batch_id, production_date

處理需求：
- 數值欄：SimpleImputer(strategy='median') + StandardScaler
- 類別欄：SimpleImputer(strategy='most_frequent') + OneHotEncoder(handle_unknown='ignore')
- 用 ColumnTransformer 組合
- 最後用 Pipeline 接後續模型

請輸出可直接執行的程式碼，並用 # 註解逐行解釋這段 code 在做什麼，
讓我能口頭跟廠長解釋每個步驟。
```

---

### Step 3 — 模型訓練：至少 2 個模型 + 公平比較（15 min）

**目標**：訓練 ≥2 個（建議 KNN + DecisionTree 或 SVM + LogReg），用 **stratified K-Fold** 比較。

#### 🤖 AI 鷹架 Prompt #4（多模型訓練 + 比較）

```
延續上一段的預處理 Pipeline，請幫我訓練並比較 2 個分類模型：
1. KNeighborsClassifier(n_neighbors=5)
2. DecisionTreeClassifier(max_depth=5, random_state=42)

要求：
- 用 cross_val_score 做 stratified 5-fold CV
- 評估指標至少報 3 個：accuracy、recall（pos_label=0，未達標為正類）、f1
- 訓練完後也跑一次 test set，輸出 classification_report 與 confusion_matrix
- 額外輸出每個模型的 train_time（秒），方便我講「成本 vs 效益」

⚠️ 重要：本題情境是 SMT 良率預測，「漏判未達標批次」成本遠高於「誤判達標批次」。
所以 recall 要算 pos_label=0（未達標為 positive）才有意義，不要用 sklearn 預設！

請輸出程式碼，並在最後用一個表格摘要 2 個模型的 4 個指標。
```

---

### Step 4 — 視覺化：四個必畫 + 模型比較圖（20 min）

**目標**：W15 的四個必畫 + W16 的 facet 或雷達。

#### 🤖 AI 鷹架 Prompt #5（四個必畫快速產出）

```
請用 matplotlib + seaborn 幫我寫程式，產出 SMT 良率資料的「四個必畫」：

1. 資料分佈圖：reflow_zone3_temp、prev_batch_defect_rate、humidity_pct、belt_speed_cm_per_min
   四個關鍵特徵的 pairplot，按 target_met 上色
2. 特徵相關熱圖：所有數值欄位的相關矩陣
3. 混淆矩陣：用我剛才表現較好的那個模型，True 在 X 軸、Predicted 在 Y 軸
4. 特徵重要性：DecisionTree 的 feature_importances_ Top 10

配色要求：
- 達標（target_met=1）：persian green #2A9D8F
- 未達標（target_met=0）：burnt sienna #E76F51
- 全部圖標題寫「結論式標題」（例：「KNN 漏判 23 個未達標批次（FN=23）」）
- 全部圖右下角加資料來源註記（n_test=1065, stratified split, random_state=2026）
- 不要 3D、不要陰影
```

#### 🤖 AI 鷹架 Prompt #6（模型比較圖）

```
我用 KNN 與 DecisionTree 兩個模型跑出以下 4 個指標：
（貼上你的表格）

請扮演「資料視覺化教練」，幫我用 matplotlib 畫一張「模型比較圖」，
要能讓廠長 5 秒看懂「哪個模型在哪個指標贏」。

請建議 2 種畫法（並排 bar chart 或雷達圖），各畫一張讓我選。
y 軸範圍要設在 0.85–1.0 把差異放大，並在圖上明確標示「y 軸已縮放」。
```

---

### Step 5 — 首頁圖 + SCQA 敘事 + 簡報（30 min）

**目標**：首頁圖七原則齊全 + 簡報 6 頁固定結構。

#### 🤖 AI 鷹架 Prompt #7（首頁圖優化）

```
我選了「混淆矩陣」當首頁圖，內容是：KNN 模型在測試集 1,065 筆中，
漏判 56 個未達標批次（FN=56），誤判 23 個達標批次（FP=23）。
recall(未達標)=0.86, precision(未達標)=0.92。

請扮演「資料視覺化稽核師」，按 Allen 老師的「首頁圖七原則」逐條檢核：
(1) 一張圖回答一個問題 (2) 結論式標題 (3) 顏色語意一致 (4) 去除 chartjunk
(5) 標出關鍵點 (6) 比較對象明確 (7) 資料來源在右下

並針對每個未達標點，給我「具體該怎麼修」的指令，
最後幫我寫一個能放在圖上方的「結論式標題」與一個 30 字內的副標題。
```

#### 🤖 AI 鷹架 Prompt #8（SCQA 敘事生成）

```
請扮演「SCQA 敘事顧問」，幫我以「廠長視角」寫一段 300 字內的 SCQA 結論段落。

材料：
- S 情境：3,547 筆 SMT 焊接批次資料，過去達標率 62%
- C 衝突：模型雖然 accuracy 0.92，但漏判了 56 個未達標批次（FN=56）。
  每漏判一個批次大約損失 8 萬元材料費，這個錯誤代價遠高於誤判
- Q 問題：要降低 FN，是調 threshold、換模型、還是補資料？
- A 答案：建議短期調 threshold 把陽性門檻降到 0.4，預估 FN 從 56 降到 30，
  代價是 FP 從 23 升到 45（每個誤判成本 1.5 萬，仍划算）

風格要求：
- 不要學術腔（不要用「綜上所述」「值得注意的是」）
- 每段 ≤ 80 字，廠長能 30 秒讀完
- 數字直接寫，不要說「相當顯著」這種模糊詞
- 結尾要有一個「下一步建議」的具體動作

請輸出完整段落 + 一個能放在簡報結論頁的「一句話結論」。
```

#### 🤖 AI 鷹架 Prompt #9（簡報結構檢查）

```
我的簡報 6 頁結構如下：
P1 封面｜P2 情境 S｜P3 衝突 C｜P4 模型比較｜P5 首頁圖｜P6 結論 A

請扮演「報告教練」，幫我檢查：
(a) 6 頁的邏輯流是否符合 SCQA × 見識謀斷？
(b) 每頁該放什麼圖、什麼字？
(c) 我說 5 分鐘簡報的話，每頁該停留幾秒？
(d) 哪一頁最容易讓廠長走神？為什麼？

請以表格輸出。
```

---

## 7. AI 使用守則（必讀）

### ✅ 可以做

- 用 AI 產生程式碼、debug、解釋概念
- 用 AI 寫 SCQA 草稿，自己改寫成最終版
- 用 AI 檢核圖表是否符合 Allen 七原則
- 用 AI 翻譯英文文件、找 sklearn API 用法
- 截圖你的圖請 AI 點評

### ❌ 不可以做

- 把整份題本直接貼給 AI 說「幫我寫完」（這會在 Notebook 引用區暴露，TA 一眼看穿）
- 跟同學共用同一個 AI 對話 session（會產生高度相似答案，視為作弊）
- 把同學的 .ipynb 整份貼給 AI 改寫（同上）
- 在 Notebook 留下「以下程式碼由 AI 產生，我看不懂」這類自白（K1 直接扣到 D）

### 📋 引用規範（強制）

Notebook 最末必須有一個 markdown cell，格式如下：

```markdown
## AI 協作紀錄

| # | 用途 | 工具 | 關鍵 prompt 摘要 | 我如何改寫 |
|---|---|---|---|---|
| 1 | EDA 規劃 | ChatGPT/Claude | （Prompt #1 全文或摘要） | 把 5 張改成 4 張，加了 boxplot by line_id |
| 2 | 預處理 code | Claude | （Prompt #3） | 把 strategy 從 'mean' 改成 'median' |
| ... | | | | |
```

> 💡 **這份紀錄佔 A 敘事維度的隱性 5 分**：寫得清楚會加分（顯示你能反思 AI），完全不寫會扣分（視為隱瞞使用）。

---

## 8. 違規與零分情境

| 情境 | 後果 |
|---|---|
| 缺任一檔案 | 對應維度 0 分 |
| 檔名不符規範 | TA 不另行通知，視為缺檔 |
| Notebook 跑不動（語法錯、套件缺） | K1 維度 0 分 |
| 完全未寫敘事文字 | A 維度 0 分（最多拿 80 分） |
| 兩人以上 SCQA 文字 95% 相同 | 全題 0 分，送學務處 |
| 整份程式碼跟 AI 一字不差且無註解改寫 | K1 維度 0 分 |

---

## 9. 考前 48 小時自查清單

考前兩天請完成以下檢查（每項打勾，截圖傳 TronClass「W18 考前確認」欄位）：

- [ ] 我的 Python 環境能 `import sklearn, pandas, numpy, matplotlib, seaborn`
- [ ] 我下載並能讀取 `train.csv` 和 `test.csv`（從 TronClass 取得）
- [ ] 我的 GenAI 工具能正常登入並對話（ChatGPT / Claude / Gemini 任一）
- [ ] 我跑過一次 W15 demo 確認 matplotlib 中文不會變方塊
- [ ] 我能把 matplotlib 圖存成 PNG 並開啟確認檔案可讀
- [ ] 我能把 .ipynb 上傳到 TronClass 測試格（測試完請刪除）
- [ ] 我重看過 W17 「首頁圖七原則」與「SCQA 對照表」

---

## 10. 一頁帶走

> 🎯 **記住三件事就好**
>
> 1. **75% 的分數在敘事**——拼 accuracy 沒用，拼結論式標題才有用。
> 2. **首頁圖只能有一張**——它佔 20%，其餘 11 頁是輔助。
> 3. **AI 是副駕駛**——你要能解釋每一行 code 在做什麼，否則 K1 0 分。

---

_文件版本：v1.0 ｜ 發布：W17 第二堂 ｜ 講師：陳志騰、吳佩蓉_
_配套文件：`final_exam_template.md`（Notebook + 簡報骨架）、`output/W18_exam_dataset/data_card.md`（資料卡）_
