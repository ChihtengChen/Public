#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
W18 期末考實作 — 資料集生成器

產出 final_exam_practical_brief.md 中宣告的 SMT 焊接良率預測資料集:
  - 3,547 筆 × 18 欄
  - target_met 達標率約 62% (輕度不平衡)
  - 已切分 train (70%) / test (30%) stratified

執行:
    cd D:\\AI_Code\\Allen_Courses\\ML_W15_W18
    python W18_exam_dataset_generator.py

產出 (output/W18_exam_dataset/):
  - smt_yield_dataset_W18.csv   (完整 3,547 筆)
  - train.csv                   (學員拿到的訓練集)
  - test.csv                    (學員拿到的測試集)
  - data_card.md                (資料卡, 講義中提到的「資料卡」)

備註:
- 這是模擬資料 (合成), 已設計合理的特徵-標籤關聯讓 ML 模型有得學
- 主要訊號:reflow_zone3_temp ≥ 245°C, prev_batch_defect_rate 低 → 達標機率高
- 加入故意的缺失值 (見資料卡), 訓練學員處理 missingness 的能力
"""

import sys
import numpy as np
import pandas as pd
from pathlib import Path

for _s in (sys.stdout, sys.stderr):
    try:
        _s.reconfigure(encoding='utf-8')
    except (AttributeError, ValueError):
        pass

OUT_DIR = Path(__file__).resolve().parent / "output" / "W18_exam_dataset"
OUT_DIR.mkdir(parents=True, exist_ok=True)

SEED = 2026
N = 3547
TARGET_RATE = 0.62

rng = np.random.default_rng(SEED)


# ============================================================================
# Step 1: 先生成 target_met (達標標籤), 之後再根據 target 生成各特徵
# ============================================================================
target_met = rng.binomial(1, TARGET_RATE, N)
n_pass = int(target_met.sum())
n_fail = N - n_pass
print(f"資料規模: {N} 筆 | 達標 {n_pass} ({n_pass/N:.1%}) | 未達標 {n_fail} ({n_fail/N:.1%})")


# ============================================================================
# Step 2: 生成欄位 (有特徵-標籤關聯, 讓 ML 模型有得學)
# ============================================================================

# --- 識別欄 ---
batch_id = np.array([f"B{2026:04d}{i:05d}" for i in range(1, N + 1)])
production_date = pd.date_range('2026-01-02', periods=N, freq='2h').strftime('%Y-%m-%d').values

# --- 類別欄 (與 target 弱關聯) ---
# shift: 夜班達標率略低 (模擬人疲勞效應)
shift_p_pass = [0.35, 0.40, 0.25]   # 早/中/夜
shift_p_fail = [0.28, 0.30, 0.42]
shift = np.empty(N, dtype=object)
shift[target_met == 1] = rng.choice(['早班', '中班', '夜班'], size=n_pass, p=shift_p_pass)
shift[target_met == 0] = rng.choice(['早班', '中班', '夜班'], size=n_fail, p=shift_p_fail)

# line_id: A/B/C/D 4 條產線, A 較新較穩定
line_p_pass = [0.32, 0.28, 0.22, 0.18]
line_p_fail = [0.18, 0.22, 0.28, 0.32]
line_id = np.empty(N, dtype=object)
line_id[target_met == 1] = rng.choice(['A', 'B', 'C', 'D'], size=n_pass, p=line_p_pass)
line_id[target_met == 0] = rng.choice(['A', 'B', 'C', 'D'], size=n_fail, p=line_p_fail)

# solder_paste_type: T3/T4/T5
solder_paste_type = rng.choice(['T3', 'T4', 'T5'], size=N, p=[0.25, 0.50, 0.25])

# supplier: 1-5 號
supplier = rng.choice([1, 2, 3, 4, 5], size=N, p=[0.30, 0.25, 0.20, 0.15, 0.10])

# --- 數值欄: 回流爐溫區 (主要訊號在 zone3) ---
# zone1: 預熱區, 與 target 弱關聯
reflow_zone1_temp = np.where(
    target_met == 1,
    rng.normal(155, 4, N),
    rng.normal(153, 5, N),
)

# zone2: 浸潤區, 與 target 弱關聯
reflow_zone2_temp = np.where(
    target_met == 1,
    rng.normal(185, 5, N),
    rng.normal(183, 6, N),
)

# zone3: 峰值區, **主要訊號**
# 達標的批次溫度 245-252, 未達標的 235-247 (重疊但有趨勢)
reflow_zone3_temp = np.where(
    target_met == 1,
    rng.normal(248, 2.5, N),
    rng.normal(242, 3.5, N),
)

# zone4: 冷卻區
reflow_zone4_temp = np.where(
    target_met == 1,
    rng.normal(220, 3, N),
    rng.normal(218, 4, N),
)

# --- 輸送帶速度 ---
belt_speed_cm_per_min = np.where(
    target_met == 1,
    rng.normal(95, 3, N),
    rng.normal(92, 5, N),
)
belt_speed_cm_per_min = np.clip(belt_speed_cm_per_min, 75, 115)

# --- 環境濕度 ---
humidity_pct = np.where(
    target_met == 1,
    rng.normal(45, 5, N),
    rng.normal(50, 8, N),
)
humidity_pct = np.clip(humidity_pct, 25, 80)

# --- 批次大小 (與 target 無強關聯) ---
batch_size = rng.integers(80, 251, size=N)

# --- 操作員年資 (達標批次操作員年資略長) ---
operator_years = np.where(
    target_met == 1,
    rng.integers(3, 16, size=N),
    rng.integers(1, 12, size=N),
)

# --- 機台年資 ---
machine_age_yrs = np.where(
    line_id == 'A',
    rng.uniform(0.5, 3, N),
    np.where(
        line_id == 'B',
        rng.uniform(3, 6, N),
        np.where(
            line_id == 'C',
            rng.uniform(6, 9, N),
            rng.uniform(9, 12, N),  # D 線最舊
        )
    )
).round(1)

# --- 距上次保養天數 ---
days_since_maintenance = np.where(
    target_met == 1,
    rng.integers(0, 25, size=N),
    rng.integers(5, 50, size=N),
)

# --- 前批不良率 (重要訊號) ---
prev_batch_defect_rate = np.where(
    target_met == 1,
    np.abs(rng.normal(1.0, 0.6, N)),
    np.abs(rng.normal(2.8, 1.2, N)),
).round(2)


# ============================================================================
# Step 3: 組裝 DataFrame
# ============================================================================
df = pd.DataFrame({
    'batch_id': batch_id,
    'production_date': production_date,
    'shift': shift,
    'line_id': line_id,
    'solder_paste_type': solder_paste_type,
    'supplier': supplier,
    'reflow_zone1_temp': reflow_zone1_temp.round(1),
    'reflow_zone2_temp': reflow_zone2_temp.round(1),
    'reflow_zone3_temp': reflow_zone3_temp.round(1),
    'reflow_zone4_temp': reflow_zone4_temp.round(1),
    'belt_speed_cm_per_min': belt_speed_cm_per_min.round(1),
    'humidity_pct': humidity_pct.round(1),
    'batch_size': batch_size,
    'operator_years': operator_years,
    'machine_age_yrs': machine_age_yrs,
    'days_since_maintenance': days_since_maintenance,
    'prev_batch_defect_rate': prev_batch_defect_rate,
    'target_met': target_met,
})


# ============================================================================
# Step 4: 故意加缺失值 (按資料卡的設計)
# ============================================================================
def inject_missing(col_name, missing_pct):
    n_missing = int(N * missing_pct / 100)
    idx = rng.choice(N, size=n_missing, replace=False)
    df.loc[idx, col_name] = np.nan

inject_missing('solder_paste_type',    0.5)
inject_missing('reflow_zone1_temp',    2.0)
inject_missing('reflow_zone2_temp',    2.0)
inject_missing('reflow_zone3_temp',    1.5)
inject_missing('reflow_zone4_temp',    2.0)
inject_missing('humidity_pct',         3.0)
inject_missing('operator_years',       5.0)

print(f"\n缺失值統計:")
print(df.isna().sum()[df.isna().sum() > 0].to_string())


# ============================================================================
# Step 5: 切分 train / test (70 / 30, stratified)
# ============================================================================
from sklearn.model_selection import train_test_split

train_df, test_df = train_test_split(
    df, test_size=0.3, random_state=SEED, stratify=df['target_met']
)
train_df = train_df.sort_index().reset_index(drop=True)
test_df  = test_df.sort_index().reset_index(drop=True)

print(f"\n切分結果:")
print(f"  train: {len(train_df)} 筆 | 達標率 {train_df['target_met'].mean():.1%}")
print(f"  test:  {len(test_df)} 筆 | 達標率 {test_df['target_met'].mean():.1%}")


# ============================================================================
# Step 6: 存檔
# ============================================================================
full_path  = OUT_DIR / "smt_yield_dataset_W18.csv"
train_path = OUT_DIR / "train.csv"
test_path  = OUT_DIR / "test.csv"

df.to_csv(full_path,  index=False, encoding='utf-8')
train_df.to_csv(train_path, index=False, encoding='utf-8')
test_df.to_csv(test_path,  index=False, encoding='utf-8')

print(f"\n✅ 已存檔:")
print(f"  {full_path}")
print(f"  {train_path}")
print(f"  {test_path}")


# ============================================================================
# Step 7: 產出資料卡 data_card.md
# ============================================================================
nullcols = df.isna().sum()
nullpct = (nullcols / len(df) * 100).round(1)

data_card_lines = [
    "# 📋 SMT 焊接良率資料集 — 資料卡 (Data Card)",
    "",
    "> W18 期末考實作用資料 ｜ 智工系二年級《機器學習》",
    "",
    "## 基本資訊",
    "",
    f"- **檔名**: `smt_yield_dataset_W18.csv` (完整) / `train.csv` / `test.csv` (已切分)",
    f"- **規模**: {len(df):,} 筆 × {len(df.columns)} 欄",
    f"- **切分**: train 70% ({len(train_df):,} 筆) / test 30% ({len(test_df):,} 筆), stratified",
    f"- **隨機種子**: {SEED}",
    "- **目標**: 二元分類 (`target_met`: 1=達標 ≥98.5%, 0=未達標)",
    f"- **類別分佈**: 1 約 {df['target_met'].mean():.1%} | 0 約 {1-df['target_met'].mean():.1%} (輕度不平衡)",
    "",
    "## 欄位明細",
    "",
    "| # | 欄位 | 型別 | 說明 | 缺失率 |",
    "|---|---|---|---|---|",
]

schema = [
    (1,  'batch_id',                'str',   '批次編號 (PK, 不可用於訓練)'),
    (2,  'production_date',         'date',  '生產日期 (時間欄, 慎用)'),
    (3,  'shift',                   'cat',   '班別 (早班/中班/夜班)'),
    (4,  'line_id',                 'cat',   '產線編號 (A/B/C/D)'),
    (5,  'solder_paste_type',       'cat',   '錫膏類型 (T3/T4/T5)'),
    (6,  'supplier',                'cat',   '原料供應商 (1-5)'),
    (7,  'reflow_zone1_temp',       'float', '回流爐第 1 溫區 (°C) — 預熱'),
    (8,  'reflow_zone2_temp',       'float', '第 2 溫區 (°C) — 浸潤'),
    (9,  'reflow_zone3_temp',       'float', '第 3 溫區 (°C) — 峰值區 ⭐ 主要訊號'),
    (10, 'reflow_zone4_temp',       'float', '第 4 溫區 (°C) — 冷卻'),
    (11, 'belt_speed_cm_per_min',   'float', '輸送帶速度'),
    (12, 'humidity_pct',            'float', '環境濕度 (%)'),
    (13, 'batch_size',              'int',   '批次大小 (片數)'),
    (14, 'operator_years',          'int',   '操作員年資 (年)'),
    (15, 'machine_age_yrs',         'float', '機台年資 (年)'),
    (16, 'days_since_maintenance',  'int',   '距上次保養天數'),
    (17, 'prev_batch_defect_rate',  'float', '前一批的不良率 (%) ⭐ 重要訊號'),
    (18, 'target_met',              'int',   '**標籤** — 是否達標 (1/0)'),
]
for num, col, dtype, desc in schema:
    pct = nullpct.get(col, 0)
    pct_str = f"{pct}%" if pct > 0 else "0%"
    data_card_lines.append(f"| {num} | `{col}` | {dtype} | {desc} | {pct_str} |")

data_card_lines += [
    "",
    "## ⚠️ 注意事項 (學員務必看)",
    "",
    "- ❌ **不要** 把 `production_date` 直接餵給模型 (它只能用於時間序列拆分, 而本資料已隨機切分)",
    "- ❌ **不要** 把 `batch_id` 當特徵 (是 primary key)",
    "- ❌ **不要** 忽略缺失值就直接 `fit` (SVM / LogReg 會炸)",
    "- ❌ **不要** 只報 `accuracy` 不報 `recall` / `precision` (62:38 不平衡)",
    "- ✅ **建議** 用 `ColumnTransformer + SimpleImputer + StandardScaler + OneHotEncoder` 統一處理",
    "- ✅ **建議** 至少訓練 2 個模型 (前 14 週學過的 KNN/SVM/Tree/LinReg)",
    "",
    "## 🎯 主要訊號 (提示)",
    "",
    "- `reflow_zone3_temp` 與 `target_met` 的相關性最高",
    "- 達標的批次 zone3 溫度約 245-252°C, 未達標約 235-247°C (有重疊)",
    "- `prev_batch_defect_rate` 也是強訊號 (達標批次平均 ~1%, 未達標 ~3%)",
    "- A 線最新最穩, D 線最舊;夜班達標率較低",
    "",
    "## 📁 檔案位置",
    "",
    "```",
    "ML_W15_W18/output/W18_exam_dataset/",
    "├── smt_yield_dataset_W18.csv  ← 完整 3,547 筆",
    "├── train.csv                   ← 考試用 (70%)",
    "├── test.csv                    ← 考試用 (30%)",
    "└── data_card.md                ← 本檔",
    "```",
    "",
    "## 🔗 相關文件",
    "",
    "- `final_exam_practical_brief.md` — 完整題本與評分標準",
    "- `final_exam_template.md` — Notebook + 簡報範本",
    "- `W17_demo_storytelling_cells.py` — W17 第三堂 demo #4 用的就是這份資料的預覽",
    "",
    "---",
    "",
    f"_生成時間: {pd.Timestamp.now().strftime('%Y-%m-%d %H:%M')} | 由 W18_exam_dataset_generator.py 產出_",
]

card_path = OUT_DIR / "data_card.md"
card_path.write_text("\n".join(data_card_lines), encoding='utf-8')
print(f"  {card_path}")

print(f"\n🎉 全部完成! 資料集已準備好, 學員可於 W18 期末考使用。")
