#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
W16 維度模型 — 課堂示範 cells

對應 W16「降維 + 多軸協調圖」, 含 4 個必看示範:
  1. PCA 2D 投影 (digits 64 維)
  2. t-SNE 2D 投影 + PCA / t-SNE 並排比較
  3. 4 模型混淆矩陣 facet (小型多重圖)
  4. 多模型多指標雷達圖

執行方式:
- VS Code 安裝 Python + Jupyter 擴充, 逐 cell 跑(# %% 標記)
- 或終端機: python W16_demo_pca_tsne_cells.py

產出:
  output/W16_demo/01_pca_digits.png
  output/W16_demo/02_pca_vs_tsne.png
  output/W16_demo/03_facet_confusion.png
  output/W16_demo/04_radar_models.png
"""

# %% Cell 0: 環境設定與 Allen 設計系統色票

import sys
import warnings
warnings.filterwarnings("ignore", category=FutureWarning)

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path

# Windows 主控台 UTF-8
for _s in (sys.stdout, sys.stderr):
    try:
        _s.reconfigure(encoding='utf-8')
    except (AttributeError, ValueError):
        pass

# Allen 配色 (與 W15 一致)
PRIMARY   = '#E76F51'   # burnt sienna
SECONDARY = '#2A9D8F'   # persian green
ACCENT    = '#E9C46A'   # saffron
TEXT_DARK = '#264653'

# matplotlib 中文字型
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

OUT_DIR = Path(__file__).resolve().parent / "output" / "W16_demo"
OUT_DIR.mkdir(parents=True, exist_ok=True)

print(f"✅ Cell 0 環境就緒, 圖檔將存到: {OUT_DIR}")


# %% Cell 1: 必畫 #1 — PCA 2D 投影 (digits 64 維)
#
# 教學重點: 把 64 維壓成 2 維, 看群聚結構是否還能保留
# 講師金句: 「PCA 保的是全局變異, 不是群聚距離」

from sklearn.datasets import load_digits
from sklearn.decomposition import PCA

digits = load_digits()
X, y = digits.data, digits.target
print(f"digits shape: {X.shape}, 類別數: {len(np.unique(y))}")

pca = PCA(n_components=2, random_state=42)
X_pca = pca.fit_transform(X)
ev_ratio = pca.explained_variance_ratio_

fig, ax = plt.subplots(figsize=(9, 7))
sc = ax.scatter(X_pca[:, 0], X_pca[:, 1], c=y, cmap='tab10',
                s=18, alpha=0.75, edgecolors='none')
ax.set_xlabel(f'PC1 ({ev_ratio[0]:.1%} variance)', fontsize=11)
ax.set_ylabel(f'PC2 ({ev_ratio[1]:.1%} variance)', fontsize=11)
ax.set_title(f'Digits 64 維 → PCA 2D 投影 (只保留 {sum(ev_ratio):.1%} 變異)',
             fontsize=14, fontweight='bold', pad=12)
cbar = plt.colorbar(sc, ax=ax, ticks=range(10), label='digit class')
cbar.ax.tick_params(labelsize=9)
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.text(0.99, -0.08, f'n={len(X)} | sklearn.datasets.load_digits | random_state=42',
        transform=ax.transAxes, ha='right', va='top', fontsize=8, color='gray', style='italic')
plt.tight_layout()

out1 = OUT_DIR / "01_pca_digits.png"
fig.savefig(out1, dpi=120, bbox_inches='tight')
plt.show()
print(f"✅ Cell 1 完成 → {out1}")


# %% Cell 2: 必畫 #2 — PCA vs t-SNE 並排比較
#
# 教學重點: t-SNE 群聚清楚很多, 但群間距離不可信
# 講師金句: 「t-SNE 為了讓群內緊密, 把群間距離扭曲了」

from sklearn.manifold import TSNE

print("正在跑 t-SNE (約 10-20 秒)...")
tsne = TSNE(n_components=2, perplexity=30, random_state=42, init='pca', learning_rate='auto')
X_tsne = tsne.fit_transform(X)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6.5))

for ax, X_2d, name in [(ax1, X_pca, 'PCA (保全局變異)'),
                        (ax2, X_tsne, 't-SNE (保局部鄰居)')]:
    sc = ax.scatter(X_2d[:, 0], X_2d[:, 1], c=y, cmap='tab10',
                    s=15, alpha=0.75, edgecolors='none')
    ax.set_title(name, fontsize=14, fontweight='bold', pad=8)
    ax.set_xticks([])
    ax.set_yticks([])
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)

fig.colorbar(sc, ax=[ax1, ax2], ticks=range(10), label='digit class', shrink=0.8)
fig.suptitle('PCA vs t-SNE: 同一份 digits 資料的兩種視角',
             fontsize=15, fontweight='bold', y=1.02)
fig.text(0.5, -0.02, '⚠️ t-SNE 群間距離 沒有意義—只看群內緊密度',
         ha='center', fontsize=11, color=PRIMARY, fontweight='bold', style='italic')

out2 = OUT_DIR / "02_pca_vs_tsne.png"
fig.savefig(out2, dpi=120, bbox_inches='tight')
plt.show()
print(f"✅ Cell 2 完成 → {out2}")


# %% Cell 3: 必畫 #3 — 4 模型混淆矩陣 facet (小型多重圖)
#
# 教學重點: sharey=True + 同 cmap = 「公平比較」的工程紀律
# 講師金句: 「Tufte 說 small multiples is a powerful underused technique」

from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (accuracy_score, precision_score, recall_score,
                              f1_score, roc_auc_score, confusion_matrix)

# 用 W15 同樣的 breast_cancer 資料, 但訓練 4 個模型
bc = load_breast_cancer()
Xb_train, Xb_test, yb_train, yb_test = train_test_split(
    bc.data, bc.target, test_size=0.3, random_state=42, stratify=bc.target)

scaler = StandardScaler()
Xb_train_s = scaler.fit_transform(Xb_train)
Xb_test_s = scaler.transform(Xb_test)

models = {
    'KNN (k=5)':      KNeighborsClassifier(n_neighbors=5),
    'SVM (rbf)':      SVC(probability=True, random_state=42),
    'Decision Tree':  DecisionTreeClassifier(max_depth=4, random_state=42),
    'LogReg':         LogisticRegression(max_iter=1000, random_state=42),
}

results = {}
# ⚠️ 重要:breast_cancer 0=malignant / 1=benign。
# 醫學上要的 recall 是「能抓到多少惡性」, 必須指定 pos_label=0。
# (W15 demo 已詳細說明此陷阱)
for name, model in models.items():
    model.fit(Xb_train_s, yb_train)
    yp = model.predict(Xb_test_s)
    # AUC 用「惡性類別」的機率 (class index 0)
    yproba_mal = model.predict_proba(Xb_test_s)[:, 0] if hasattr(model, 'predict_proba') else None
    results[name] = {
        'acc':  accuracy_score(yb_test, yp),
        'prec': precision_score(yb_test, yp, pos_label=0),
        'rec':  recall_score(yb_test, yp, pos_label=0),
        'f1':   f1_score(yb_test, yp, pos_label=0),
        # roc_auc_score:y_true 用 (yb_test==0) 把惡性當 positive,score 給惡性機率
        'auc':  roc_auc_score((yb_test == 0).astype(int), yproba_mal) if yproba_mal is not None else float('nan'),
    }

fig, axes = plt.subplots(1, 4, figsize=(17, 4.6), sharey=True)
for ax, (name, model) in zip(axes, models.items()):
    # 計算混淆矩陣後手動畫 (True→X, Predicted→Y)
    yp_m = model.predict(Xb_test_s)
    cm_m = confusion_matrix(yb_test, yp_m, labels=[0, 1]).T  # 轉置:rows=Pred, cols=True
    sns.heatmap(cm_m, annot=True, fmt='d', cmap='Reds',
                xticklabels=['malig', 'benign'],
                yticklabels=['malig', 'benign'],
                cbar=False, ax=ax,
                annot_kws={'fontsize': 13, 'fontweight': 'bold'})
    ax.set_xlabel('True', fontsize=9)
    if ax is axes[0]:
        ax.set_ylabel('Predicted', fontsize=9)
    else:
        ax.set_ylabel('')
    ax.set_title(f'{name}\nacc={results[name]["acc"]:.3f} | rec(惡)={results[name]["rec"]:.3f}',
                 fontsize=11, fontweight='bold')
    ax.tick_params(labelsize=9)

fig.suptitle('Facet (小型多重圖): 4 個模型在同一資料集的混淆矩陣 — 同 cmap、同尺度才公平',
             fontsize=14, fontweight='bold', y=1.04)
fig.text(0.99, -0.02,
         'sklearn breast_cancer (n_test=171) | stratified 70:30 | StandardScaler | pos_label=0 (malig)',
         ha='right', fontsize=8, color='gray', style='italic')
plt.tight_layout()

out3 = OUT_DIR / "03_facet_confusion.png"
fig.savefig(out3, dpi=120, bbox_inches='tight')
plt.show()
print(f"✅ Cell 3 完成 → {out3}")


# %% Cell 4: 必畫 #4 — 多模型多指標雷達圖
#
# 教學重點: 多個模型 × 多個指標, 一張圖看遍
# 講師金句: 「set_ylim 是作弊也是誠實—把範圍寫在圖上叫誠實」

metrics = ['accuracy', 'precision', 'recall', 'f1', 'auc']
angles = np.linspace(0, 2 * np.pi, len(metrics), endpoint=False).tolist()
angles += angles[:1]  # 閉合

palette = [PRIMARY, SECONDARY, ACCENT, '#264653']

fig, ax = plt.subplots(figsize=(9, 9), subplot_kw={'projection': 'polar'})

for (name, scores), color in zip(results.items(), palette):
    values = [scores['acc'], scores['prec'], scores['rec'], scores['f1'], scores['auc']]
    values += values[:1]
    ax.plot(angles, values, label=name, linewidth=2.2, color=color)
    ax.fill(angles, values, alpha=0.12, color=color)

ax.set_xticks(angles[:-1])
ax.set_xticklabels(metrics, fontsize=12, fontweight='bold')
ax.set_ylim(0.85, 1.0)   # 重點: 放大差異
ax.set_yticks([0.88, 0.92, 0.96, 1.0])
ax.set_yticklabels(['.88', '.92', '.96', '1.0'], fontsize=9, color='gray')
ax.set_title('4 模型 × 5 指標 雷達圖 (y 軸 0.85-1.0)',
             fontsize=14, fontweight='bold', pad=22)
ax.legend(loc='upper right', bbox_to_anchor=(1.3, 1.05), fontsize=10)
ax.grid(alpha=0.5)

fig.text(0.5, -0.02, '⚠️ y 軸從 0.85 起 — 不是從 0—請學員留意這是「視覺放大差異」的合法做法',
         ha='center', fontsize=10, color=PRIMARY, style='italic')

out4 = OUT_DIR / "04_radar_models.png"
fig.savefig(out4, dpi=120, bbox_inches='tight')
plt.show()
print(f"✅ Cell 4 完成 → {out4}")


# %% Cell 5: 課堂小結 — 四張圖如何串成「降維 → 比較 → 取捨」的故事

print("\n" + "=" * 60)
print("🎓 W16 課堂小結 — 維度模型 SCQA")
print("=" * 60)
print(f"""
S (情境):
   digits 64 維 + breast_cancer 30 維 兩份資料。
C (衝突):
   PCA 看不太出 digit 分群(只保 {sum(ev_ratio):.0%} 變異),
   t-SNE 看得清但群間距離不能信。
A (答案):
   1. PCA 看全局變異, t-SNE 看群聚, 兩個都跑做對照
   2. 比較用 facet (同 cmap 同尺度) + 雷達圖 (放大差異)
   3. 永遠把 y 軸範圍寫在標題裡 — 這是誠實
""")

print(f"\n✅ 全部完成。4 張圖已存到 {OUT_DIR}/")
print("   下週 W17: SCQA × 見識謀斷, 把這些圖串成故事。")
