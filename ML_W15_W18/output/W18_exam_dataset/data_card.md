# 📋 SMT 焊接良率資料集 — 資料卡 (Data Card)

> W18 期末考實作用資料 ｜ 智工系二年級《機器學習》

## 基本資訊

- **檔名**: `smt_yield_dataset_W18.csv` (完整) / `train.csv` / `test.csv` (已切分)
- **規模**: 3,547 筆 × 18 欄
- **切分**: train 70% (2,482 筆) / test 30% (1,065 筆), stratified
- **隨機種子**: 2026
- **目標**: 二元分類 (`target_met`: 1=達標 ≥98.5%, 0=未達標)
- **類別分佈**: 1 約 62.0% | 0 約 38.0% (輕度不平衡)

## 欄位明細

| # | 欄位 | 型別 | 說明 | 缺失率 |
|---|---|---|---|---|
| 1 | `batch_id` | str | 批次編號 (PK, 不可用於訓練) | 0% |
| 2 | `production_date` | date | 生產日期 (時間欄, 慎用) | 0% |
| 3 | `shift` | cat | 班別 (早班/中班/夜班) | 0% |
| 4 | `line_id` | cat | 產線編號 (A/B/C/D) | 0% |
| 5 | `solder_paste_type` | cat | 錫膏類型 (T3/T4/T5) | 0.5% |
| 6 | `supplier` | cat | 原料供應商 (1-5) | 0% |
| 7 | `reflow_zone1_temp` | float | 回流爐第 1 溫區 (°C) — 預熱 | 2.0% |
| 8 | `reflow_zone2_temp` | float | 第 2 溫區 (°C) — 浸潤 | 2.0% |
| 9 | `reflow_zone3_temp` | float | 第 3 溫區 (°C) — 峰值區 ⭐ 主要訊號 | 1.5% |
| 10 | `reflow_zone4_temp` | float | 第 4 溫區 (°C) — 冷卻 | 2.0% |
| 11 | `belt_speed_cm_per_min` | float | 輸送帶速度 | 0% |
| 12 | `humidity_pct` | float | 環境濕度 (%) | 3.0% |
| 13 | `batch_size` | int | 批次大小 (片數) | 0% |
| 14 | `operator_years` | int | 操作員年資 (年) | 5.0% |
| 15 | `machine_age_yrs` | float | 機台年資 (年) | 0% |
| 16 | `days_since_maintenance` | int | 距上次保養天數 | 0% |
| 17 | `prev_batch_defect_rate` | float | 前一批的不良率 (%) ⭐ 重要訊號 | 0% |
| 18 | `target_met` | int | **標籤** — 是否達標 (1/0) | 0% |

## ⚠️ 注意事項 (學員務必看)

- ❌ **不要** 把 `production_date` 直接餵給模型 (它只能用於時間序列拆分, 而本資料已隨機切分)
- ❌ **不要** 把 `batch_id` 當特徵 (是 primary key)
- ❌ **不要** 忽略缺失值就直接 `fit` (SVM / LogReg 會炸)
- ❌ **不要** 只報 `accuracy` 不報 `recall` / `precision` (62:38 不平衡)
- ✅ **建議** 用 `ColumnTransformer + SimpleImputer + StandardScaler + OneHotEncoder` 統一處理
- ✅ **建議** 至少訓練 2 個模型 (前 14 週學過的 KNN/SVM/Tree/LinReg)

## 🎯 主要訊號 (提示)

- `reflow_zone3_temp` 與 `target_met` 的相關性最高
- 達標的批次 zone3 溫度約 245-252°C, 未達標約 235-247°C (有重疊)
- `prev_batch_defect_rate` 也是強訊號 (達標批次平均 ~1%, 未達標 ~3%)
- A 線最新最穩, D 線最舊;夜班達標率較低

## 📁 檔案位置

```
ML_W15_W18/output/W18_exam_dataset/
├── smt_yield_dataset_W18.csv  ← 完整 3,547 筆
├── train.csv                   ← 考試用 (70%)
├── test.csv                    ← 考試用 (30%)
└── data_card.md                ← 本檔
```

## 🔗 相關文件

- `final_exam_practical_brief.md` — 完整題本與評分標準
- `final_exam_template.md` — Notebook + 簡報範本
- `W17_demo_storytelling_cells.py` — W17 第三堂 demo #4 用的就是這份資料的預覽

---

_生成時間: 2026-05-17 07:12 | 由 W18_exam_dataset_generator.py 產出_