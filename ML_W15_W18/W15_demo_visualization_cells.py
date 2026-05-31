#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
W15 視覺化語彙 — 課堂示範 cells

對應 W15 第二堂「sklearn + matplotlib/seaborn 雙軌實作」,
含「四個必畫」:資料分佈、特徵相關熱圖、混淆矩陣、特徵重要性。

執行方式:
- VS Code 安裝 Python + Jupyter 擴充功能後,**逐 cell 執行**(按 Run Cell 鈕)
- 或在終端機:python W15_demo_visualization_cells.py(會一次跑全部)

產出:
- output/W15_demo/01_data_distribution.png
- output/W15_demo/02_correlation_heatmap.png
- output/W15_demo/03_confusion_matrix.png
- output/W15_demo/04_feature_importance.png
"""

# %% Cell 0:環境設定與 Allen 設計系統色票

import sys
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path

# Windows 主控台預設 cp950,印出 emoji/中文會 UnicodeEncodeError 而中斷整支腳本,
# 導致圖檔來不及重新產生(舊的亂碼 PNG 殘留)。強制 stdout/stderr 走 UTF-8。
for _stream in (sys.stdout, sys.stderr):
    try:
        _stream.reconfigure(encoding='utf-8')
    except (AttributeError, ValueError):
        pass

# Allen 設計系統色票(與 PDF / PPTX 完全一致)
PRIMARY   = '#E76F51'   # burnt sienna - 警示、未達標
SECONDARY = '#2A9D8F'   # persian green - 達標、正常
ACCENT    = '#E9C46A'   # saffron - 高亮

# matplotlib 中文字型(跨平台:Windows / Mac / Linux)
import os
import platform
from matplotlib import font_manager
# 先優先載個別 OTF (含 Bold variant), 否則退回 TTC (只會載第一個 face=Regular)
for _f in ['~/.fonts/NotoSansCJK-TC-Regular.otf', '~/.fonts/NotoSansCJK-TC-Bold.otf',
           '~/.fonts/NotoSansCJK-Regular.ttc', '~/.fonts/NotoSansCJK-Bold.ttc',
           '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc']:
    _p = os.path.expanduser(_f)
    if os.path.exists(_p):
        try:
            font_manager.fontManager.addfont(_p)
        except Exception:
            pass

# Linux (含沙箱): Noto CJK TC 放第一順位 (含 Bold variant)
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

# 輸出路徑
# 逐 cell 在 VS Code 互動視窗執行時 __file__ 不存在,退回用當前工作目錄
try:
    _base = Path(__file__).resolve().parent
except NameError:
    _base = Path.cwd()
OUT_DIR = _base / "output" / "W15_demo"
OUT_DIR.mkdir(parents=True, exist_ok=True)

print(f"✅ Cell 0 環境就緒,圖檔將存到: {OUT_DIR}")


# %% Cell 1:必畫 #1 — 資料分佈圖 (pairplot)
#
# 目的:看「我餵了模型什麼?」
# 講師重點:用 pairplot 取 4 個關鍵特徵,讓學生快速看出兩類資料的可分性

from sklearn.datasets import load_breast_cancer

data = load_breast_cancer(as_frame=True)
df = data.frame.copy()
df['target_name'] = df['target'].map({0: 'malignant', 1: 'benign'})

print(f"資料 shape: {df.shape}")
print(f"類別分佈:\n{df['target_name'].value_counts()}")

# 挑 4 個關鍵特徵(避免 30 維全部畫)
features = ['mean radius', 'mean texture', 'mean perimeter', 'mean area']

g = sns.pairplot(
    df[features + ['target_name']],
    hue='target_name',
    palette={'malignant': PRIMARY, 'benign': SECONDARY},
    diag_kind='hist',
    plot_kws={'alpha': 0.6, 's': 15},
)
g.fig.suptitle('資料分佈:良性 vs 惡性 在 4 個關鍵特徵上的分離度', y=1.01, fontsize=14, fontweight='bold')
g.fig.text(0.99, 0.01,
           f'n={len(df)} | 30 維中取 4 維 | sklearn.datasets.load_breast_cancer',
           ha='right', va='bottom', fontsize=8, color='gray', style='italic')

out1 = OUT_DIR / "01_data_distribution.png"
g.fig.savefig(out1, dpi=120, bbox_inches='tight')
plt.show()
print(f"✅ Cell 1 完成 → {out1}")


# %% Cell 2:必畫 #2 — 特徵相關熱圖
#
# 目的:看「特徵之間互相打架嗎?」(共線性對 SVM / 線性回歸特別致命)
# 講師重點:看到一片紅就是共線性災難

# 取前 10 個數值特徵
top_features = list(data.feature_names[:10])
corr = df[top_features].corr()

fig, ax = plt.subplots(figsize=(9, 7))
sns.heatmap(
    corr,
    annot=True, fmt='.2f',
    cmap='RdBu_r', center=0, vmin=-1, vmax=1,
    cbar_kws={'shrink': 0.7, 'label': '相關係數'},
    ax=ax,
)
ax.set_title('前 10 個特徵相關熱圖:看到一片紅就是共線性災難',
             fontsize=14, fontweight='bold', pad=12)
ax.text(0.99, -0.08, f'n={len(df)} | sklearn breast_cancer 30 維中取前 10 維',
        transform=ax.transAxes, ha='right', va='top', fontsize=8, color='gray', style='italic')
plt.tight_layout()

out2 = OUT_DIR / "02_correlation_heatmap.png"
fig.savefig(out2, dpi=120, bbox_inches='tight')
plt.show()
print(f"✅ Cell 2 完成 → {out2}")


# %% Cell 3:必畫 #3 — 混淆矩陣 (KNN k=5)
#
# 目的:看「模型錯在哪?」FN vs FP 哪邊比例失衡
# 講師重點:乳癌診斷情境下,FN(漏判惡性)成本遠高於 FP
#
# ⚠️ 重要:sklearn 的 load_breast_cancer label 編碼是
#    0 = malignant (惡性、要抓出的目標)
#    1 = benign    (良性)
# 但 sklearn 的 recall_score 預設 pos_label=1, 算出來會是「benign 的 recall」。
# 醫學上要的 recall 是「能抓到多少惡性」, 必須指定 pos_label=0。
# 同理:座標軸用 True→X, Predicted→Y(課堂偏好, 與 sklearn 預設相反)。

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    confusion_matrix,
)

X = df[data.feature_names].values
y = df['target'].values  # 0=malignant, 1=benign

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42, stratify=y
)

scaler = StandardScaler()
X_train_s = scaler.fit_transform(X_train)
X_test_s = scaler.transform(X_test)

knn = KNeighborsClassifier(n_neighbors=5).fit(X_train_s, y_train)
y_pred = knn.predict(X_test_s)

# === 同時算「兩種視角」的指標讓學生看到差異 ===
# 醫學視角:positive = malignant (要抓出的目標)
acc       = accuracy_score(y_test, y_pred)
prec_mal  = precision_score(y_test, y_pred, pos_label=0)
rec_mal   = recall_score(y_test, y_pred, pos_label=0)
f1_mal    = f1_score(y_test, y_pred, pos_label=0)
# sklearn 預設視角:positive = benign (容易被誤用)
rec_default = recall_score(y_test, y_pred)  # pos_label=1

print(f"KNN (k=5) 測試集表現:")
print(f"  accuracy                = {acc:.3f}")
print(f"  precision (惡性為正)    = {prec_mal:.3f}")
print(f"  recall    (惡性為正)    = {rec_mal:.3f}  ← 醫學上有意義")
print(f"  f1        (惡性為正)    = {f1_mal:.3f}")
print(f"  recall    (預設 pos=1)  = {rec_default:.3f}  ← sklearn 預設, 容易誤用!")

# === 計算 FN/FP (以惡性為 positive class) ===
# cm[i, j] = 真實為 i, 預測為 j 的樣本數
# 0=malignant, 1=benign
cm = confusion_matrix(y_test, y_pred, labels=[0, 1])
TP_mal = cm[0, 0]  # 真實惡性 + 預測惡性
FN_mal = cm[0, 1]  # 真實惡性 + 預測良性 ← 漏判惡性, 危險!
FP_mal = cm[1, 0]  # 真實良性 + 預測惡性 ← 誤判健康為癌
TN_mal = cm[1, 1]  # 真實良性 + 預測良性

print(f"\n以惡性為 positive class:")
print(f"  TP (真實惡性 → 預測惡性) = {TP_mal}")
print(f"  FN (真實惡性 → 預測良性) = {FN_mal}  ← 漏判 {FN_mal} 個惡性!")
print(f"  FP (真實良性 → 預測惡性) = {FP_mal}")
print(f"  TN (真實良性 → 預測良性) = {TN_mal}")

# === 畫圖:True→X 軸, Predicted→Y 軸 (課堂偏好) ===
# 為了交換軸, 我們把 cm 轉置 (cm_T[pred, true])
cm_T = cm.T
# cm_T[0, 0] = TP_mal (預測惡 + 真實惡)
# cm_T[0, 1] = FP_mal (預測惡 + 真實良)
# cm_T[1, 0] = FN_mal (預測良 + 真實惡)  ← 漏判
# cm_T[1, 1] = TN_mal (預測良 + 真實良)

fig, ax = plt.subplots(figsize=(7, 6))
sns.heatmap(
    cm_T, annot=True, fmt='d', cmap='Reds',
    xticklabels=['malignant', 'benign'],
    yticklabels=['malignant', 'benign'],
    cbar=False, annot_kws={'fontsize': 22, 'fontweight': 'bold'},
    linewidths=0.5, linecolor='white', ax=ax,
)
ax.set_xlabel('True label (實際)', fontsize=12, fontweight='bold')
ax.set_ylabel('Predicted label (預測)', fontsize=12, fontweight='bold')
ax.set_title(
    f'KNN (k=5) 混淆矩陣 ｜ acc={acc:.3f}, recall(惡性)={rec_mal:.3f}\n'
    f'漏判 {FN_mal} 個惡性病例 (FN) ← 乳癌篩檢的危險訊號',
    fontsize=12, fontweight='bold', pad=12,
)

# 在 FN 那一格加紅圈強調 (Pred=benign, True=malignant → cm_T[1, 0])
ax.add_patch(plt.Rectangle((0, 1), 1, 1, fill=False,
                            edgecolor=PRIMARY, linewidth=4, zorder=10))
ax.annotate(
    f'FN={FN_mal}\n漏判惡性',
    xy=(0.5, 1.5), xytext=(-1.7, 1.5),
    fontsize=11, fontweight='bold', color=PRIMARY,
    arrowprops=dict(arrowstyle='->', color=PRIMARY, lw=2),
    bbox=dict(boxstyle='round,pad=0.4', facecolor='#FBE7E0', edgecolor=PRIMARY),
)

ax.text(1.02, -0.15,
        f'n_test={len(y_test)} | stratified 70:30 | StandardScaler | seed=42 | pos_label=0 (malig)',
        transform=ax.transAxes, ha='right', va='top', fontsize=8, color='gray', style='italic')
plt.tight_layout()

out3 = OUT_DIR / "03_confusion_matrix.png"
fig.savefig(out3, dpi=120, bbox_inches='tight')
plt.show()
print(f"✅ Cell 3 完成 → {out3}")


# %% Cell 4:必畫 #4 — 特徵重要性 (決策樹原生屬性)
#
# 目的:看「模型靠什麼決策?」
# 講師重點:這裡用決策樹的 .feature_importances_ 是因為它「有原生屬性」。
#          KNN 與 SVM 沒有原生 .feature_importances_,要看特徵重要性必須用
#          permutation_importance (下一個 Cell 4b 示範) ——這是「通用 vs 專屬」
#          框架的關鍵分水嶺:KNN/SVM 屬「黑盒類」, 重要性要用 model-agnostic 算法。

from sklearn.tree import DecisionTreeClassifier

tree = DecisionTreeClassifier(max_depth=4, random_state=42).fit(X_train_s, y_train)
y_pred_tree = tree.predict(X_test_s)
print(f"決策樹 (max_depth=4) accuracy = {accuracy_score(y_test, y_pred_tree):.3f}")

importances = pd.Series(tree.feature_importances_, index=data.feature_names)
top10 = importances.nlargest(10).sort_values()

fig, ax = plt.subplots(figsize=(9, 5.5))
ax.barh(top10.index, top10.values, color=PRIMARY, alpha=0.85)
ax.set_xlabel('Feature Importance (原生屬性)', fontsize=11)
ax.set_title('決策樹 Top 10 特徵重要性:模型靠這些特徵做決策\n'
             '【通用必畫 #4 ⼀ 樹類專用版,KNN/SVM 請看 Cell 4b】',
             fontsize=13, fontweight='bold', pad=12)
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)

# 直接在 bar 上標數值
for i, v in enumerate(top10.values):
    ax.text(v + 0.005, i, f'{v:.3f}', va='center', fontsize=9, color='#264653')

ax.text(0.99, -0.1,
        f'DecisionTreeClassifier(max_depth=4, random_state=42) | sklearn breast_cancer',
        transform=ax.transAxes, ha='right', va='top', fontsize=8, color='gray', style='italic')
plt.tight_layout()

out4 = OUT_DIR / "04_feature_importance.png"
fig.savefig(out4, dpi=120, bbox_inches='tight')
plt.show()
print(f"✅ Cell 4 完成 → {out4}")


# %% Cell 4b:必畫 #4 (KNN 版) — permutation_importance
#
# 目的:示範 KNN/SVM 這類「黑盒模型」如何畫特徵重要性。
#       概念:把某一欄打亂 (shuffle), 看模型 score 掉了多少
#       —— 掉越多代表該欄越重要 (model-agnostic, 任何模型都能用)。
#
# 講師重點:這就是「通用 vs 專屬」框架的具體實踐:
#          - 「特徵重要性」這個分析「目的」是通用的
#          - 但 sklearn API 是專屬的:
#               Tree → .feature_importances_  (Cell 4)
#               KNN/SVM/NN → permutation_importance  (Cell 4b)
#          期末考、之後接觸隨機森林/XGBoost/神經網路都能套用這套思維。

from sklearn.inspection import permutation_importance

# 用前面已訓練好的 knn 物件 (Cell 3)
# n_repeats=5 是課堂演示用,實際研究建議 ≥ 10;n_jobs=1 避免某些 Windows 環境 fork 問題
perm = permutation_importance(
    knn, X_test_s, y_test,
    n_repeats=5, random_state=42, n_jobs=1,
    scoring='accuracy',
)

perm_imp = pd.Series(perm.importances_mean, index=data.feature_names)
top10_perm = perm_imp.nlargest(10).sort_values()
top10_perm_std = pd.Series(perm.importances_std, index=data.feature_names).loc[top10_perm.index]

fig, ax = plt.subplots(figsize=(9, 5.5))
ax.barh(top10_perm.index, top10_perm.values,
        xerr=top10_perm_std.values,
        color=SECONDARY, alpha=0.85, ecolor='#264653', capsize=3)
ax.set_xlabel('Permutation Importance (Δaccuracy ⼀ 打亂該欄後掉多少)', fontsize=11)
ax.set_title('KNN Top 10 特徵重要性 (permutation_importance)\n'
             '【通用必畫 #4 ⼀ 黑盒模型專用版,可用於 KNN / SVM / 神經網路】',
             fontsize=13, fontweight='bold', pad=12)
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.axvline(0, color='gray', linewidth=0.8, linestyle='--')

for i, v in enumerate(top10_perm.values):
    ax.text(v + 0.001, i, f'{v:.3f}', va='center', fontsize=9, color='#264653')

ax.text(0.99, -0.1,
        f'permutation_importance(knn, X_test_s, y_test, n_repeats=10)',
        transform=ax.transAxes, ha='right', va='top', fontsize=8, color='gray', style='italic')
plt.tight_layout()

out4b = OUT_DIR / "04b_permutation_importance_knn.png"
fig.savefig(out4b, dpi=120, bbox_inches='tight')
plt.show()
print(f"✅ Cell 4b 完成 → {out4b}")
print(f"   提示:跟 Cell 4 的決策樹結果對比, 你會發現重要特徵不完全一樣")
print(f"        — 不是哪個對哪個錯, 而是「模型機制不同, 重要性定義也不同」")


# %% Cell 5:課堂小結 — 把四張圖串成一個 SCQA 敘事
#
# 講師示範:這 4 張圖如何說一個完整的故事

print("\n" + "=" * 60)
print("🎓 W15 課堂小結 — SCQA × 見識謀斷")
print("=" * 60)
print(f"""
S (情境):
   sklearn breast_cancer 569 筆 30 維, 二元分類良性/惡性。
C (衝突):
   KNN k=5 accuracy={acc:.3f} 看似很好, 但 recall(惡性)={rec_mal:.3f}
   漏判 {FN_mal} 個惡性 ← 在乳癌篩檢是危險方向。
   ⚠️ sklearn 預設 recall={rec_default:.3f} 是 benign 的 recall, 必須用 pos_label=0。
A (答案):
   1. 短期:調整 decision threshold 降陽性門檻
   2. 中期:用 feature_importances_ 找關鍵特徵, 蒐集更多惡性樣本
   3. 長期:SMOTE 過採樣, 或 SVM with class_weight='balanced'
重點:永遠指定 pos_label, 不要被 sklearn 預設騙了。
""")

print(f"\n✅ 全部 5 個 cell 完成。4 張圖已存到 {OUT_DIR}/")
print("   下週 W16: 把 30 維壓成 2 維 (PCA / t-SNE) 再看一次。")
