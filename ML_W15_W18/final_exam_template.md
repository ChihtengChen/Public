# 📝 W18 期末考 — Notebook 與簡報範本

> 學員直接複製此檔內容到自己的 `.ipynb`，依序填寫即可。
> **不必從零開始**——把 95 分鐘留給思考與敘事，不是排版與查 API。

---

## A. Notebook 8 Cell 骨架

複製下方每個 cell 區塊到 Jupyter Notebook，依序執行並填空。

---

### Cell 1 — Markdown：標題與情境（S）

```markdown
# W18 期末考實作 — SMT 焊接良率預測

**學號姓名**：B12345678 王小明
**考試日期**：W18

## S 情境（Situation）
某 PCB 廠 SMT 焊接產線，[填入 3,547 筆批次的背景描述]，
我們希望透過 ML 模型，協助廠長預測下一批次是否達標（target_met = 1）。
```

---

### Cell 2 — Code：套件 import 與環境設定

```python
import sys
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path

# 中文字型（Windows）
plt.rcParams['font.sans-serif'] = ['Microsoft JhengHei', '微軟正黑體', 'sans-serif']
plt.rcParams['axes.unicode_minus'] = False

# Allen 設計系統色票
PRIMARY   = '#E76F51'   # burnt sienna — 未達標 / 警示
SECONDARY = '#2A9D8F'   # persian green — 達標 / 正常
ACCENT    = '#E9C46A'   # saffron — 高亮

# 讀資料
train = pd.read_csv('train.csv')
test  = pd.read_csv('test.csv')
print(f"train: {train.shape} | test: {test.shape}")
print(f"target 分佈:\n{train['target_met'].value_counts(normalize=True)}")
```

---

### Cell 3 — Code：EDA 5 步驟 starter（直接跑就有圖）

```python
# === EDA Step 1: 看資料規模與型別 ===
print("=" * 60)
print("Step 1: 資料 schema")
print("=" * 60)
print(train.info())
print(f"\n缺失值統計:\n{train.isna().sum()[train.isna().sum() > 0]}")

# === EDA Step 2: 類別平衡度 ===
fig, ax = plt.subplots(figsize=(6, 4))
train['target_met'].value_counts().plot.bar(
    ax=ax, color=[SECONDARY, PRIMARY])
ax.set_xticklabels(['達標 (1)', '未達標 (0)'], rotation=0)
ax.set_title(f'類別分佈：達標 {train["target_met"].mean():.1%} vs 未達標 {1-train["target_met"].mean():.1%}',
             fontweight='bold')
ax.set_ylabel('批次數')
plt.tight_layout()
plt.savefig('eda_class_balance.png', dpi=120, bbox_inches='tight')
plt.show()

# === EDA Step 3: 主訊號驗證（zone3 溫度 by target）===
fig, ax = plt.subplots(figsize=(8, 5))
sns.boxplot(data=train, x='target_met', y='reflow_zone3_temp',
            palette={0: PRIMARY, 1: SECONDARY}, ax=ax)
ax.set_xticklabels(['未達標 (0)', '達標 (1)'])
ax.set_title('主訊號驗證：reflow_zone3_temp 在達標 vs 未達標的差異',
             fontweight='bold')
plt.tight_layout()
plt.show()

# === EDA Step 4: 數值欄相關熱圖 ===
numeric_cols = ['reflow_zone1_temp', 'reflow_zone2_temp', 'reflow_zone3_temp',
                'reflow_zone4_temp', 'belt_speed_cm_per_min', 'humidity_pct',
                'batch_size', 'operator_years', 'machine_age_yrs',
                'days_since_maintenance', 'prev_batch_defect_rate']
fig, ax = plt.subplots(figsize=(10, 8))
sns.heatmap(train[numeric_cols + ['target_met']].corr(),
            annot=True, fmt='.2f', cmap='RdBu_r', center=0,
            vmin=-1, vmax=1, ax=ax)
ax.set_title('特徵相關熱圖：看哪些欄位互相打架', fontweight='bold')
plt.tight_layout()
plt.show()

# === EDA Step 5: 類別欄 vs target（交叉表）===
for col in ['shift', 'line_id', 'solder_paste_type']:
    print(f"\n{col} × target_met 達標率:")
    print(train.groupby(col)['target_met'].mean().sort_values(ascending=False))
```

---

### Cell 4 — Markdown：C 衝突（從 EDA 寫出來）

```markdown
## C 衝突（Conflict）

從 EDA 我看到 3 個關鍵衝突點：

1. **[填入：類別不平衡的影響]**
   - 例：類別 62:38，若只看 accuracy 會誤判模型品質
2. **[填入：缺失值處理的選擇]**
   - 例：operator_years 缺 5%，丟欄會少 10% 樣本，補值要選 median 還是 mean
3. **[填入：成本不對稱]**
   - 例：漏判未達標（FN）的代價 = 整批材料報廢 ~8 萬元；
     誤判達標（FP）的代價 = 多做一次 QC ~1.5 萬元 → FN 成本是 FP 的 5 倍
```

---

### Cell 5 — Code：預處理 Pipeline（複製即可，只改欄位清單）

```python
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder

# 欄位分類
NUMERIC_COLS = [
    'reflow_zone1_temp', 'reflow_zone2_temp', 'reflow_zone3_temp',
    'reflow_zone4_temp', 'belt_speed_cm_per_min', 'humidity_pct',
    'batch_size', 'operator_years', 'machine_age_yrs',
    'days_since_maintenance', 'prev_batch_defect_rate',
]
CATEGORICAL_COLS = ['shift', 'line_id', 'solder_paste_type', 'supplier']
DROP_COLS = ['batch_id', 'production_date']  # ❌ 不可當特徵

# 數值欄：補中位數 + 標準化
numeric_pipe = Pipeline([
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler()),
])

# 類別欄：補眾數 + One-Hot
categorical_pipe = Pipeline([
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False)),
])

# 組合
preprocessor = ColumnTransformer([
    ('num', numeric_pipe, NUMERIC_COLS),
    ('cat', categorical_pipe, CATEGORICAL_COLS),
])

# 切 X / y
X_train = train.drop(columns=['target_met'] + DROP_COLS)
y_train = train['target_met']
X_test  = test.drop(columns=['target_met'] + DROP_COLS)
y_test  = test['target_met']

print(f"X_train shape: {X_train.shape}")
print(f"NUMERIC + CATEGORICAL = {len(NUMERIC_COLS)} + {len(CATEGORICAL_COLS)} = "
      f"{len(NUMERIC_COLS) + len(CATEGORICAL_COLS)} 欄餵入模型")
```

---

### Cell 6 — Code：訓練 2 模型 + 評估（必含 pos_label=0）

```python
import time
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import cross_val_score, StratifiedKFold
from sklearn.metrics import (accuracy_score, precision_score, recall_score,
                              f1_score, confusion_matrix, classification_report)

MODELS = {
    'KNN (k=5)': KNeighborsClassifier(n_neighbors=5),
    'DecisionTree (depth=5)': DecisionTreeClassifier(max_depth=5, random_state=42),
}

results = []
trained_models = {}

for name, clf in MODELS.items():
    pipe = Pipeline([('prep', preprocessor), ('clf', clf)])

    # 計時 + 訓練
    t0 = time.time()
    pipe.fit(X_train, y_train)
    train_sec = time.time() - t0

    # 預測
    y_pred = pipe.predict(X_test)

    # 指標（注意 pos_label=0 = 未達標為正類，業務上才有意義）
    metrics = {
        'model': name,
        'accuracy':         accuracy_score(y_test, y_pred),
        'recall(未達標)':    recall_score(y_test, y_pred, pos_label=0),
        'precision(未達標)': precision_score(y_test, y_pred, pos_label=0),
        'f1(未達標)':        f1_score(y_test, y_pred, pos_label=0),
        'train_sec':        train_sec,
    }
    results.append(metrics)
    trained_models[name] = pipe

    print(f"\n=== {name} ===")
    print(f"train_sec = {train_sec:.3f}")
    print(classification_report(y_test, y_pred,
                                 target_names=['未達標(0)', '達標(1)']))

# 摘要表
results_df = pd.DataFrame(results).set_index('model')
print("\n📊 模型比較摘要:")
print(results_df.round(3))
```

---

### Cell 7 — Code：四個必畫 + 首頁圖

```python
# === 必畫 #1 已在 Cell 3 完成（boxplot + heatmap）===

# === 必畫 #3：混淆矩陣（挑表現較好的模型）===
best_model_name = results_df['recall(未達標)'].idxmax()
best_pipe = trained_models[best_model_name]
y_pred_best = best_pipe.predict(X_test)

cm = confusion_matrix(y_test, y_pred_best, labels=[0, 1])
cm_T = cm.T  # 交換軸：True→X, Predicted→Y（Allen 偏好）
FN = cm[0, 1]  # 真未達標 → 預測達標 = 漏判
FP = cm[1, 0]  # 真達標 → 預測未達標 = 誤判

fig, ax = plt.subplots(figsize=(7, 6))
sns.heatmap(cm_T, annot=True, fmt='d', cmap='Reds',
            xticklabels=['未達標', '達標'],
            yticklabels=['未達標', '達標'],
            cbar=False, annot_kws={'fontsize': 22, 'fontweight': 'bold'},
            linewidths=0.5, linecolor='white', ax=ax)
ax.set_xlabel('True label (實際)', fontweight='bold')
ax.set_ylabel('Predicted label (預測)', fontweight='bold')
ax.set_title(
    f'{best_model_name} 混淆矩陣 ｜ 漏判 {FN} 個未達標批次 (FN)\n'
    f'每漏判一批 ≈ 8 萬元損失 → 總風險 {FN*8} 萬元',
    fontweight='bold', pad=12,
)
ax.text(1.02, -0.12,
        f'n_test={len(y_test)} | stratified 70:30 | seed=2026 | pos_label=0',
        transform=ax.transAxes, ha='right', va='top',
        fontsize=8, color='gray', style='italic')
plt.tight_layout()
plt.savefig('B12345678_王小明_W18Hero.png', dpi=150, bbox_inches='tight')  # ← 首頁圖
plt.show()

# === 必畫 #4：特徵重要性（Decision Tree）===
tree_pipe = trained_models.get('DecisionTree (depth=5)')
if tree_pipe is not None:
    feature_names = (NUMERIC_COLS +
                     list(tree_pipe.named_steps['prep']
                          .named_transformers_['cat']
                          .named_steps['onehot']
                          .get_feature_names_out(CATEGORICAL_COLS)))
    importances = pd.Series(
        tree_pipe.named_steps['clf'].feature_importances_,
        index=feature_names
    ).nlargest(10).sort_values()

    fig, ax = plt.subplots(figsize=(9, 5))
    ax.barh(importances.index, importances.values, color=PRIMARY, alpha=0.85)
    ax.set_title('Top 10 特徵重要性：模型靠這些變數做決策', fontweight='bold')
    for i, v in enumerate(importances.values):
        ax.text(v + 0.005, i, f'{v:.3f}', va='center', fontsize=9)
    plt.tight_layout()
    plt.show()
```

---

### Cell 8 — Markdown：A 答案（SCQA 結論段）

```markdown
## A 答案（Answer）— 給廠長的決策建議

[替換以下範本內容]

### 一句話結論
**建議部署 [模型名稱]，並將決策閾值調至 0.4，預估每月可減少 [X] 萬元良率損失。**

### 短期動作（本週執行）
1. [填入：threshold 從 0.5 調至 0.4，FN 預估從 X 降到 Y]
2. [填入：盯緊 reflow_zone3_temp < 245°C 的批次，現場手動複檢]

### 中期動作（本月執行）
1. [填入：D 線最舊，建議優先排保養]
2. [填入：夜班達標率低 5%，安排教育訓練]

### 長期動作（下季規劃）
1. [填入：補 200 筆「未達標 + 高溫」邊界樣本，重訓模型]
2. [填入：上線 MLOps 監控，每週重新評估 threshold]

---

## AI 協作紀錄

| # | 用途 | 工具 | 關鍵 prompt 摘要 | 我如何改寫 |
|---|---|---|---|---|
| 1 | EDA 規劃 | Claude | （Prompt #1 全文或摘要） | 把 5 張改成 4 張，加了 boxplot by line_id |
| 2 | 預處理 code | ChatGPT | （Prompt #3） | 把 strategy 從 'mean' 改成 'median' |
| 3 | 首頁圖標題 | Claude | （Prompt #7） | 加上「總風險 8 萬元」的金額換算 |
| ... | | | | |
```

---

## B. 簡報 6 頁固定結構

| 頁次 | 標題 | 內容元素 | 停留時間 |
|---|---|---|---|
| **P1 封面** | W18 期末考實作 — SMT 焊接良率預測 | 學號姓名 + 一句話總結（例：「將漏判從 56 降至 30 的決策建議」） | 5 秒 |
| **P2 S 情境** | 為什麼要做這個分析？ | 1 張：類別分佈 bar + 商業背景 50 字 | 30 秒 |
| **P3 C 衝突** | 資料告訴我們的 3 個衝突 | 1 張：相關熱圖 + 3 個 bullet（不平衡、缺失、成本不對稱） | 45 秒 |
| **P4 模型比較** | 2 個模型怎麼挑？ | 1 張：並排 bar 或雷達 + 「KNN vs Tree」摘要表 | 30 秒 |
| **P5 首頁圖** | **核心發現** | 1 張：你的 Hero 圖（混淆矩陣 + annotation） | 60 秒 |
| **P6 A 答案** | 我的建議 | 短期 / 中期 / 長期 3 個 bullet + 一句話結論 | 30 秒 |

**總時長**：3 分鐘（簡報不口頭報，僅評分 PDF）
**字體**：標題 ≥ 28pt，內文 ≥ 18pt，標籤 ≥ 14pt（評分時 TA 縮圖看 PDF，太小會看不清）

---

## C. 首頁圖七原則自評勾選表

完成首頁圖後逐條打勾，達 6 點以上才算合格：

- [ ] **(1) 一張圖回答一個問題**：我這張圖在回答「________」這個問題（寫得出來才算）
- [ ] **(2) 結論式標題**：標題本身就是答案，不是「實驗結果」「混淆矩陣」這類描述
- [ ] **(3) 顏色語意一致**：紅色 = 未達標/警示，綠色 = 達標/正常，沒有亂用
- [ ] **(4) 去除 chartjunk**：沒有 3D、沒有陰影、沒有過多格線、沒有花俏底色
- [ ] **(5) 標出關鍵點**：用箭頭/方框/註解直接指出讀者該看的位置
- [ ] **(6) 比較對象明確**：圖中有「對照基準」（例：兩個模型並排、達標 vs 未達標）
- [ ] **(7) 資料來源在右下**：n、切分方法、隨機種子、pos_label 都註明

**達 6 點以上 → S2 維度 17–20 分；達 4–5 點 → 12–16 分；達 < 4 點 → < 12 分。**

---

## D. SCQA 敘事填空表（每張圖三層字）

每張上稿的圖都用此表格自查：

| 圖編號 | 標題（結論） | 圖（視覺證據） | 註記（背景脈絡） |
|---|---|---|---|
| Hero | _填入結論式標題_ | _圖檔名_ | n=__, seed=__, pos_label=__ |
| Fig 1 | | | |
| Fig 2 | | | |

> 💡 **三層缺一者，建議刪掉這張圖**——半成品比沒有更扣分。

---

## E. 繳交前最後 5 分鐘檢查

- [ ] 三檔命名格式正確：`學號_姓名_W18Final.ipynb` / `_W18Hero.png` / `_W18Slides.pdf`
- [ ] Notebook 從頭跑到尾無錯誤（**Restart Kernel → Run All** 確認）
- [ ] AI 協作紀錄 cell 已填寫
- [ ] 首頁圖打開可讀（不是黑塊或亂碼）
- [ ] 簡報 PDF 字體沒被切掉
- [ ] 三檔已上傳到 TronClass「W18 期末考實作」欄位（截圖留證）

---

_範本版本：v1.0 ｜ 配套文件：`final_exam_practical_brief.md`（題本）、`final_exam_pre_check.md`（考前自查）_
