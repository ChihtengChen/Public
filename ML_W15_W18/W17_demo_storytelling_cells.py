#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
W17 數據敘事 — 課堂示範 cells

對應 W17「SCQA × 見識謀斷 + 期末考準備」, 含 4 個示範:
  1. 結論式標題 vs 描述式標題 (同一份資料兩種畫法的對比)
  2. 完整首頁圖 (Hero Chart) 範例 — 七原則齊全
  3. 決策閾值調整對 recall / precision 的影響 — SCQA "C衝突→A答案" 視覺化
  4. W18 期末考資料集 EDA 預覽 (smt_yield 模擬資料)

執行: python W17_demo_storytelling_cells.py

產出:
  output/W17_demo/01_title_good_vs_bad.png
  output/W17_demo/02_hero_chart_example.png
  output/W17_demo/03_threshold_adjustment.png
  output/W17_demo/04_w18_exam_preview.png
"""

# %% Cell 0: 環境設定

import sys
import warnings
warnings.filterwarnings("ignore", category=FutureWarning)

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path

for _s in (sys.stdout, sys.stderr):
    try:
        _s.reconfigure(encoding='utf-8')
    except (AttributeError, ValueError):
        pass

PRIMARY   = '#E76F51'
SECONDARY = '#2A9D8F'
ACCENT    = '#E9C46A'
TEXT_DARK = '#264653'
TEXT_MUTED = '#587D80'

import os
import platform
from matplotlib import font_manager
for _f in ['~/.fonts/NotoSansCJK-TC-Regular.otf', '~/.fonts/NotoSansCJK-TC-Bold.otf',
           '~/.fonts/NotoSansCJK-Regular.ttc', '~/.fonts/NotoSansCJK-Bold.ttc',
           '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc']:
    _p = os.path.expanduser(_f)
    if os.path.exists(_p):
        try:
            font_manager.fontManager.addfont(_p)
        except Exception:
            pass

if platform.system() == 'Linux':
    plt.rcParams['font.sans-serif'] = ['Noto Sans CJK TC', 'Noto Sans CJK JP',
                                         'DejaVu Sans', 'sans-serif']
else:
    plt.rcParams['font.sans-serif'] = ['Microsoft JhengHei', '微軟正黑體',
                                         'PingFang TC', 'Heiti TC',
                                         'Noto Sans CJK TC', 'Noto Sans TC',
                                         'sans-serif']
plt.rcParams['font.family'] = 'sans-serif'
plt.rcParams['axes.unicode_minus'] = False

OUT_DIR = Path(__file__).resolve().parent / "output" / "W17_demo"
OUT_DIR.mkdir(parents=True, exist_ok=True)

print(f"✅ Cell 0 環境就緒, 圖檔將存到: {OUT_DIR}")


# %% Cell 1: 必畫 #1 — 結論式標題 vs 描述式標題對比
#
# 教學重點: 同一張圖, 不同標題, 讀者拿到的「訊息」完全不同
# 講師金句: 「標題是結論, 不是 figure caption」

# 用 W15/W16 的 breast_cancer 資料
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import confusion_matrix, recall_score, precision_score

bc = load_breast_cancer()
X_train, X_test, y_train, y_test = train_test_split(
    bc.data, bc.target, test_size=0.3, random_state=42, stratify=bc.target)
scaler = StandardScaler()
X_train_s = scaler.fit_transform(X_train)
X_test_s = scaler.transform(X_test)
knn = KNeighborsClassifier(n_neighbors=5).fit(X_train_s, y_train)
y_pred = knn.predict(X_test_s)
cm = confusion_matrix(y_test, y_pred)

# 以惡性為 positive class 重算 (與 W15 修正一致)
cm = confusion_matrix(y_test, y_pred, labels=[0, 1])  # rows=True, cols=Pred
cm_T = cm.T  # 轉置:rows=Pred, cols=True (對應 True→X, Pred→Y 軸)
FN_mal = cm[0, 1]
FP_mal = cm[1, 0]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6))

# 兩種標題對照
for ax, title, subtitle, color in [
    (ax1, '模型表現', '(機器學習實驗結果)', 'gray'),
    (ax2, f'KNN k=5 漏判 {FN_mal} 個惡性, 但誤判 {FP_mal} 個健康人為陽性',
     '建議調低決策閾值 → 提升 recall 抓更多惡性', PRIMARY),
]:
    im = ax.imshow(cm_T, cmap='Reds', alpha=0.85)
    ax.set_xticks([0, 1])
    ax.set_yticks([0, 1])
    ax.set_xticklabels(['malig', 'benign'])
    ax.set_yticklabels(['malig', 'benign'])
    ax.set_xlabel('True label (實際)', fontweight='bold')
    ax.set_ylabel('Predicted label (預測)', fontweight='bold')
    for i in range(2):
        for j in range(2):
            ax.text(j, i, cm_T[i, j], ha='center', va='center',
                    fontsize=22, fontweight='bold',
                    color='white' if cm_T[i, j] > cm_T.max()/2 else TEXT_DARK)
    ax.set_title(title, fontsize=14, fontweight='bold', color=color, pad=4)
    ax.text(0.5, 1.06, subtitle, transform=ax.transAxes, ha='center',
            fontsize=10, color=TEXT_MUTED, style='italic')

fig.suptitle('同一張圖, 兩種標題 — 讀者拿到的訊息完全不同',
             fontsize=14, fontweight='bold', y=1.02)
fig.text(0.25, -0.02, '❌ 描述式標題:讀者要自己推結論', ha='center',
         fontsize=11, color='gray', fontweight='bold')
fig.text(0.75, -0.02, '✅ 結論式標題:結論直接寫在標題', ha='center',
         fontsize=11, color=PRIMARY, fontweight='bold')
plt.tight_layout()

out1 = OUT_DIR / "01_title_good_vs_bad.png"
fig.savefig(out1, dpi=120, bbox_inches='tight')
plt.show()
print(f"✅ Cell 1 完成 → {out1}")


# %% Cell 2: 必畫 #2 — 完整首頁圖 (Hero Chart) 範例
#
# 教學重點: 七原則齊全 — 結論式標題、結論式副標、annotation、來源在右下、無 chartjunk
# 講師金句: 「12 頁報告主管看 1 張, 90% 心力都應該放在這張」

# 模擬:某產線 30 天良率 + 維護日期
np.random.seed(42)
days = pd.date_range('2026-04-01', periods=30, freq='D')
yield_rate = np.concatenate([
    np.random.normal(98.8, 0.4, 12),  # 維護前穩定
    np.random.normal(97.5, 0.6, 8),   # 慢慢下滑
    np.random.normal(98.9, 0.3, 10),  # 維護後回升
])
target = 98.5

fig, ax = plt.subplots(figsize=(12, 6.5))

# 目標線
ax.axhline(target, color=TEXT_MUTED, linestyle='--', linewidth=1.5, alpha=0.7, zorder=1)
ax.text(days[0], target + 0.05, f'目標良率 {target}%', fontsize=10, color=TEXT_MUTED, style='italic')

# 良率折線 + 顏色標示達標/不達標
above = yield_rate >= target
ax.plot(days, yield_rate, color=TEXT_DARK, linewidth=1.5, alpha=0.4, zorder=2)
ax.scatter(days[above], yield_rate[above], c=SECONDARY, s=60, zorder=3, label='達標')
ax.scatter(days[~above], yield_rate[~above], c=PRIMARY, s=60, zorder=3, label='未達標')

# 關鍵 annotation
ax.annotate(
    '4/13 起連續下滑\n→ 觸發維護排程',
    xy=(days[17], yield_rate[17]),
    xytext=(days[18], 96.3),
    fontsize=11, fontweight='bold', color=PRIMARY,
    arrowprops=dict(arrowstyle='->', color=PRIMARY, lw=2),
    bbox=dict(boxstyle='round,pad=0.5', facecolor='#FBE7E0', edgecolor=PRIMARY),
)
ax.axvline(days[20], color=ACCENT, linewidth=2, alpha=0.5, zorder=1)
ax.text(days[20], 99.6, '4/21 維護',
        rotation=0, ha='center', fontsize=10, fontweight='bold', color='#B89030',
        bbox=dict(boxstyle='round,pad=0.3', facecolor='#FFF6DA', edgecolor='none'))

# 結論式標題(兩行式)
ax.set_title(
    '產線 A 良率 4 月分析:預防維護把不良率壓回 1.1%\n'
    '建議將「連續 3 天未達標」設為自動觸發保養門檻',
    fontsize=14, fontweight='bold', color=TEXT_DARK, loc='left', pad=12,
)

ax.set_xlabel('日期', fontsize=10)
ax.set_ylabel('良率 (%)', fontsize=10)
ax.set_ylim(95.5, 100)
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.grid(axis='y', alpha=0.3)
ax.legend(loc='lower right', fontsize=10)

# 資料來源在右下
ax.text(0.99, 0.02, 'n=30 day | mock data | random_state=42 | 2026-Apr',
        transform=ax.transAxes, ha='right', va='bottom',
        fontsize=8, color='gray', style='italic')

plt.tight_layout()

out2 = OUT_DIR / "02_hero_chart_example.png"
fig.savefig(out2, dpi=120, bbox_inches='tight')
plt.show()
print(f"✅ Cell 2 完成 → {out2}")


# %% Cell 3: 必畫 #3 — 決策閾值對 recall/precision 的影響
#
# 教學重點: SCQA "C 衝突→A 答案" 視覺化 — 從一個鈕看到全局取捨
# 講師金句: 「不要重訓模型, 先動 threshold」

from sklearn.metrics import precision_recall_curve

# ⚠️ 醫學視角:positive = malignant (class 0)。用 class 0 的機率, 並把 y_test==0 當 positive。
y_proba_mal = knn.predict_proba(X_test_s)[:, 0]
y_true_mal = (y_test == 0).astype(int)
precision, recall, thresholds = precision_recall_curve(y_true_mal, y_proba_mal)

fig, ax = plt.subplots(figsize=(11, 6.5))

# precision 與 recall 曲線
ax.plot(thresholds, precision[:-1], color=PRIMARY, linewidth=2.5, label='Precision')
ax.plot(thresholds, recall[:-1], color=SECONDARY, linewidth=2.5, label='Recall')

# 預設閾值 0.5
ax.axvline(0.5, color=TEXT_MUTED, linestyle='--', alpha=0.5, zorder=1)
ax.text(0.5, 1.02, '預設閾值 0.5', ha='center', fontsize=10, color=TEXT_MUTED, style='italic')

# 找出 recall=0.95 與 0.99 對應的閾值
for target_rec, ypos in [(0.95, 1.0), (0.99, 1.0)]:
    idx = np.argmin(np.abs(recall[:-1] - target_rec))
    th = thresholds[idx]
    pre = precision[idx]
    ax.scatter([th], [target_rec], s=120, color=SECONDARY,
               edgecolors='white', linewidth=2, zorder=5)
    ax.annotate(
        f'若要 recall={target_rec}\n→ threshold≈{th:.2f}, precision={pre:.2f}',
        xy=(th, target_rec),
        xytext=(th - 0.18, target_rec - 0.15),
        fontsize=10, color=SECONDARY,
        arrowprops=dict(arrowstyle='->', color=SECONDARY, lw=1.5),
        bbox=dict(boxstyle='round,pad=0.4', facecolor='#E4F4F1', edgecolor=SECONDARY),
    )

ax.set_xlabel('Decision Threshold (predict_proba ≥ this → predict positive)', fontsize=11)
ax.set_ylabel('Score', fontsize=11)
ax.set_title(
    'KNN 決策閾值調整 (惡性為 positive):不用重訓模型, 就能換 recall/precision 的取捨\n'
    '在乳癌篩檢情境, 把 threshold 降低 → 抓到更多惡性 (recall ↑), 但 precision ↓',
    fontsize=13, fontweight='bold', loc='left', pad=12, color=TEXT_DARK,
)
ax.set_ylim(0.5, 1.05)
ax.set_xlim(0, 1)
ax.legend(loc='lower left', fontsize=11)
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.grid(alpha=0.3)
ax.text(0.99, 0.02, 'n_test=171 | KNN k=5 | StandardScaler | predict_proba',
        transform=ax.transAxes, ha='right', va='bottom',
        fontsize=8, color='gray', style='italic')

plt.tight_layout()

out3 = OUT_DIR / "03_threshold_adjustment.png"
fig.savefig(out3, dpi=120, bbox_inches='tight')
plt.show()
print(f"✅ Cell 3 完成 → {out3}")


# %% Cell 4: 必畫 #4 — W18 期末考資料集 EDA 預覽 (SMT 焊接良率模擬)
#
# 教學重點: 把 W18 考試的資料先 EDA 一次給學生看, 降低考試焦慮
# 講師金句: 「考前花 8 分鐘 EDA, 考場省 15 分鐘」

# 模擬 SMT 焊接良率資料(對應 W18 期末考題本)
np.random.seed(2026)
n = 3547
target_met = np.random.binomial(1, 0.62, n)  # 達標率 62%

# 溫區 3 的影響:達標的批次溫度 245-252, 未達標的 235-247(重疊但有趨勢)
zone3_temp = np.where(
    target_met == 1,
    np.random.normal(248, 2.5, n),
    np.random.normal(242, 3.5, n),
)
prev_defect = np.where(
    target_met == 1,
    np.abs(np.random.normal(1.0, 0.6, n)),
    np.abs(np.random.normal(2.8, 1.2, n)),
)

fig, axes = plt.subplots(2, 2, figsize=(13, 9))

# 左上:類別分佈
ax = axes[0, 0]
counts = np.bincount(target_met)
ax.bar(['未達標', '達標'], counts, color=[PRIMARY, SECONDARY], alpha=0.85)
for i, v in enumerate(counts):
    ax.text(i, v + 30, f'{v}\n({v/n:.1%})', ha='center', fontsize=11, fontweight='bold')
ax.set_title('類別分佈:輕度不平衡 (62:38)', fontsize=12, fontweight='bold', pad=8)
ax.set_ylim(0, max(counts) * 1.18)
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)

# 右上:reflow_zone3_temp 分佈 by class
ax = axes[0, 1]
for met, color, label in [(1, SECONDARY, '達標'), (0, PRIMARY, '未達標')]:
    ax.hist(zone3_temp[target_met == met], bins=30, alpha=0.6,
            color=color, label=label, edgecolor='white', linewidth=0.5)
ax.axvline(245, color=TEXT_DARK, linestyle='--', linewidth=1.5, alpha=0.7)
ax.text(245, ax.get_ylim()[1] * 0.92, ' 閾值 245°C',
        fontsize=9, color=TEXT_DARK, style='italic')
ax.set_xlabel('reflow_zone3_temp (°C)')
ax.set_ylabel('Count')
ax.set_title('溫區 3 是達標關鍵閾值', fontsize=12, fontweight='bold', pad=8)
ax.legend(fontsize=10)
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)

# 左下:prev_batch_defect_rate boxplot
ax = axes[1, 0]
data_box = [prev_defect[target_met == 0], prev_defect[target_met == 1]]
bp = ax.boxplot(data_box, labels=['未達標', '達標'], patch_artist=True,
                widths=0.5, medianprops=dict(color='white', linewidth=2))
for patch, color in zip(bp['boxes'], [PRIMARY, SECONDARY]):
    patch.set_facecolor(color)
    patch.set_alpha(0.85)
ax.set_ylabel('前批不良率 (%)')
ax.set_title('前批不良率:歷史會說故事', fontsize=12, fontweight='bold', pad=8)
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.grid(axis='y', alpha=0.3)

# 右下:散佈圖
ax = axes[1, 1]
for met, color, label in [(1, SECONDARY, '達標'), (0, PRIMARY, '未達標')]:
    mask = target_met == met
    ax.scatter(zone3_temp[mask], prev_defect[mask], c=color, label=label,
               alpha=0.4, s=12, edgecolors='none')
ax.axvline(245, color=TEXT_DARK, linestyle='--', linewidth=1, alpha=0.5)
ax.set_xlabel('reflow_zone3_temp (°C)')
ax.set_ylabel('前批不良率 (%)')
ax.set_title('溫度 × 歷史 = 風險訊號', fontsize=12, fontweight='bold', pad=8)
ax.legend(fontsize=10, loc='upper right')
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)

fig.suptitle('W18 期末考資料集 EDA 預覽 — 4 張圖讓你提前熟悉資料',
             fontsize=15, fontweight='bold', y=1.00)
fig.text(0.99, -0.005,
         'n=3,547 (mock) | seed=2026 | reflow_zone3_temp / prev_batch_defect_rate / target_met',
         ha='right', fontsize=8, color='gray', style='italic')
plt.tight_layout()

out4 = OUT_DIR / "04_w18_exam_preview.png"
fig.savefig(out4, dpi=120, bbox_inches='tight')
plt.show()
print(f"✅ Cell 4 完成 → {out4}")


# %% Cell 5: 課堂小結

print("\n" + "=" * 60)
print("🎓 W17 課堂小結 — 數據敘事")
print("=" * 60)

print("""
S (情境):
   你已經會畫圖了 (W15)、會降維比較模型了 (W16)。
   現在要把這些圖串成「讓主管下決定」的故事。

C (衝突):
   單一張圖再漂亮, 沒有「結論式標題 + 三層敘事」就是廢圖。
   學生最常犯:標題寫「實驗結果」「Figure 1」這種 caption。

Q (問題):
   - 一張圖該寫什麼樣的標題, 才能讓主管 3 秒下決定?
   - SCQA × 見識謀斷 怎麼套用在 ML 報告?

A (答案):
   1. 結論式標題:KNN 漏判 7 個惡性 (不是「混淆矩陣」)
   2. 三層敘事:標題 → 圖 → 註記, 三層都要
   3. 首頁圖七原則:佔期末考 20% 的關鍵
   4. 不要重訓模型, 先動 threshold — 工程思維

——下週就是期末考。
""")

print(f"\n✅ W17 demo 全部完成。4 張圖已存到 {OUT_DIR}/")
print("   下週 W18 期末考個人實作!")
