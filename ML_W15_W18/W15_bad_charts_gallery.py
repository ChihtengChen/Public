#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
W15 第三堂 AI 鷹架 #3 — 壞圖庫生成腳本

產出 6 張刻意做壞的 ML 圖,讓學員以「資料視覺化稽核師」角度診斷缺陷。
每張圖各示範一種常見的 ML 視覺化罪行。

執行:
    cd D:\\AI_Code\\Allen_Courses\\ML_W15_W18
    python W15_bad_charts_gallery.py

產出:
    output/W15_bad_charts/01_3d_pie_confusion.png
    output/W15_bad_charts/02_rainbow_heatmap.png
    output/W15_bad_charts/03_truncated_baseline.png
    output/W15_bad_charts/04_naked_pca.png
    output/W15_bad_charts/05_legend_clash_roc.png
    output/W15_bad_charts/06_compressed_radar.png

對應教師解答鑰: W15_bad_charts_answer_key.md (只給老師看)
課堂操作:Allen 公布編號 → 學員拿該編號圖描述給 AI → 跑 3 段式 prompt
"""

import os
import sys
import numpy as np
import matplotlib.pyplot as plt
from pathlib import Path

# Windows 主控台 UTF-8
for _s in (sys.stdout, sys.stderr):
    try:
        _s.reconfigure(encoding='utf-8')
    except (AttributeError, ValueError):
        pass

# Headless 環境 (CI / 沙箱) 用 Agg backend, 避免 plt.show() 卡住
if os.environ.get('MPLBACKEND') is None and not sys.stdout.isatty():
    import matplotlib
    matplotlib.use('Agg')

# 中文字型 (跨平台)
# repo 自帶一份 Noto Sans TC 靜態字型,確保任何環境 (雲端 / headless /
# Linux 沙箱) 都不會缺中文字型而印出豆腐字 □□□。系統若另有 CJK 字型則作為後援。
import platform
from matplotlib import font_manager

_BUNDLED_FONT = Path(__file__).resolve().parent / "fonts" / "NotoSansTC-Regular.ttf"
_pref = []
if _BUNDLED_FONT.exists():
    try:
        font_manager.fontManager.addfont(str(_BUNDLED_FONT))
        _pref.append(font_manager.FontProperties(fname=str(_BUNDLED_FONT)).get_name())
    except Exception as e:  # noqa: BLE001
        print(f"⚠️  無法載入自帶字型 {_BUNDLED_FONT}: {e}")
else:
    print(f"⚠️  找不到自帶字型 {_BUNDLED_FONT};將仰賴系統 CJK 字型,headless 環境可能印出豆腐字")

# 系統字型作為後援 (本機開發時優先用熟悉的字型也無妨)
if platform.system() == 'Linux':
    _pref += ['Noto Sans CJK TC', 'Noto Sans TC']
else:
    _pref += ['Microsoft JhengHei', 'PingFang TC', 'Heiti TC']
_pref += ['DejaVu Sans', 'sans-serif']

plt.rcParams['font.sans-serif'] = _pref
plt.rcParams['font.family'] = 'sans-serif'
plt.rcParams['axes.unicode_minus'] = False

OUT_DIR = Path(__file__).resolve().parent / "output" / "W15_bad_charts"
OUT_DIR.mkdir(parents=True, exist_ok=True)
DPI = 110


# ============================================================================
# Bad Chart 01: 3D 圓餅圖 畫混淆矩陣 (chartjunk + 不該用 pie)
# ============================================================================
def bad_01_3d_pie():
    # 假混淆矩陣資料: TP=57, FN=7, FP=0, TN=107
    labels = ['真陽 TP', '假陰 FN', '假陽 FP', '真陰 TN']
    sizes = [57, 7, 1, 107]   # FP 1 (本來 0, pie 無法畫 0)
    colors = ['#FF1493', '#00FFFF', '#FFFF00', '#7CFC00']  # 螢光對撞色
    explode = (0.15, 0.25, 0.1, 0.05)

    fig = plt.figure(figsize=(8, 6))
    ax = fig.add_subplot(111)
    wedges, texts, autotexts = ax.pie(
        sizes, labels=labels, colors=colors, explode=explode,
        autopct='%1.1f%%', startangle=140, shadow=True,
        wedgeprops={'edgecolor': 'black', 'linewidth': 1.5},
        textprops={'fontsize': 12, 'fontweight': 'bold'},
    )
    # 偽 3D 效果:多疊幾層稍微偏移
    for offset in [(0, -0.03), (0, -0.06)]:
        ax2 = fig.add_axes(ax.get_position().translated(*offset), zorder=-1)
        ax2.pie(sizes, colors=[c+'80' for c in colors], explode=explode,
                startangle=140, wedgeprops={'edgecolor': 'gray'})
        ax2.axis('off')
    ax.set_title('Model Performance', fontsize=20, fontweight='bold', color='red')
    plt.savefig(OUT_DIR / "01_3d_pie_confusion.png", dpi=DPI, bbox_inches='tight')
    plt.close()
    print("✅ 01 — 3D 圓餅圖 (混淆矩陣)")


# ============================================================================
# Bad Chart 02: 虹色 heatmap 畫相關矩陣 (rainbow has no perceptual order)
# ============================================================================
def bad_02_rainbow_heatmap():
    rng = np.random.default_rng(42)
    n = 8
    feats = [f'feat_{i+1}' for i in range(n)]
    # 假相關矩陣 (對稱, 對角 1)
    A = rng.uniform(-0.6, 0.9, size=(n, n))
    corr = (A + A.T) / 2
    np.fill_diagonal(corr, 1.0)

    fig, ax = plt.subplots(figsize=(8, 6))
    im = ax.imshow(corr, cmap='jet', aspect='auto')   # ❌ jet (彩虹)
    # 標籤:擠在邊緣不轉 90 度
    ax.set_xticks(range(n)); ax.set_xticklabels(feats)
    ax.set_yticks(range(n)); ax.set_yticklabels(feats)
    # 沒有 colorbar 中心線 / vmin / vmax,讓讀者不知道 0 在哪
    fig.colorbar(im, ax=ax)
    ax.set_title('Correlation', fontsize=14)
    # 沒有數字標註
    plt.savefig(OUT_DIR / "02_rainbow_heatmap.png", dpi=DPI, bbox_inches='tight')
    plt.close()
    print("✅ 02 — 虹色 (jet) heatmap")


# ============================================================================
# Bad Chart 03: bar 圖 y 軸切掉零基準 (deceptive truncation)
# ============================================================================
def bad_03_truncated_baseline():
    models = ['Model A', 'Model B', 'Model C', 'Model D']
    accuracy = [0.882, 0.889, 0.901, 0.913]
    colors = ['#888888'] * 4

    fig, ax = plt.subplots(figsize=(7, 5))
    bars = ax.bar(models, accuracy, color=colors,
                   edgecolor='black', linewidth=1)
    ax.set_ylim(0.87, 0.92)   # ❌ 起始不為 0,差異被放大 5 倍
    ax.set_ylabel('Accuracy', fontsize=12)
    ax.set_title('Model D 大幅超越其他模型!!', fontsize=15,
                  fontweight='bold', color='red')
    # bar 標數值
    for b, v in zip(bars, accuracy):
        ax.text(b.get_x() + b.get_width()/2, v + 0.0005,
                f'{v:.3f}', ha='center', fontsize=11, fontweight='bold')
    plt.savefig(OUT_DIR / "03_truncated_baseline.png", dpi=DPI, bbox_inches='tight')
    plt.close()
    print("✅ 03 — 切掉零基準 (bar truncation)")


# ============================================================================
# Bad Chart 04: PCA 散佈圖 標題 Result + 無 axis label + 無 legend
# ============================================================================
def bad_04_naked_pca():
    rng = np.random.default_rng(2026)
    # 兩群點
    g1 = rng.normal([1, 1], 1.0, size=(80, 2))
    g2 = rng.normal([-1, -1], 1.0, size=(80, 2))
    g3 = rng.normal([2, -2], 1.0, size=(40, 2))

    fig, ax = plt.subplots(figsize=(7, 5))
    ax.scatter(g1[:, 0], g1[:, 1], c='red', s=30)
    ax.scatter(g2[:, 0], g2[:, 1], c='blue', s=30)
    ax.scatter(g3[:, 0], g3[:, 1], c='green', s=30)
    ax.set_title('Result', fontsize=18)           # ❌ 沒結論
    # 沒 x/y label, 沒 legend, 沒資料來源
    plt.savefig(OUT_DIR / "04_naked_pca.png", dpi=DPI, bbox_inches='tight')
    plt.close()
    print("✅ 04 — Naked PCA (無標籤、無 legend、無結論標題)")


# ============================================================================
# Bad Chart 05: ROC 5 模型,圖例擋在曲線上 + 螢光色撞色
# ============================================================================
def bad_05_legend_clash_roc():
    rng = np.random.default_rng(7)
    fig, ax = plt.subplots(figsize=(7, 6))
    x = np.linspace(0, 1, 100)
    bright = ['#FF00FF', '#00FF00', '#FFFF00', '#FF4500', '#00FFFF']  # 螢光對撞
    names = ['KNN-1', 'KNN-3', 'KNN-5', 'KNN-7', 'KNN-9']
    for i, (c, n) in enumerate(zip(bright, names)):
        # 偽 ROC: 各 model 些微不同的曲線
        y = 1 - (1 - x) ** (1.5 + i * 0.2 + rng.uniform(-0.1, 0.1))
        ax.plot(x, y, color=c, linewidth=3, label=n)
    ax.plot([0, 1], [0, 1], 'k--', linewidth=1)
    # 圖例放圖中央擋住曲線
    ax.legend(loc='center', fontsize=14, framealpha=1.0,
               facecolor='lightgray', edgecolor='black')
    ax.set_xlabel('FPR'); ax.set_ylabel('TPR')
    ax.set_title('ROC Curves', fontsize=14)
    ax.grid(True, linestyle=':', color='lightgray')
    plt.savefig(OUT_DIR / "05_legend_clash_roc.png", dpi=DPI, bbox_inches='tight')
    plt.close()
    print("✅ 05 — Legend 擋曲線 + 螢光配色 ROC")


# ============================================================================
# Bad Chart 06: 雷達圖 y 軸 0-1,所有值擠在 0.85-0.94
# ============================================================================
def bad_06_compressed_radar():
    metrics = ['Accuracy', 'Precision', 'Recall', 'F1', 'AUC']
    models = {
        'KNN':  [0.91, 0.89, 0.93, 0.90, 0.92],
        'SVM':  [0.93, 0.92, 0.91, 0.91, 0.93],
        'Tree': [0.88, 0.86, 0.89, 0.87, 0.88],
    }
    angles = np.linspace(0, 2 * np.pi, len(metrics), endpoint=False).tolist()
    angles += angles[:1]

    fig, ax = plt.subplots(figsize=(7, 6), subplot_kw=dict(polar=True))
    for name, vals in models.items():
        vals = vals + vals[:1]
        ax.plot(angles, vals, label=name, linewidth=2)
        ax.fill(angles, vals, alpha=0.15)
    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(metrics, fontsize=11)
    ax.set_ylim(0, 1)             # ❌ 0-1 全範圍, 差異被壓縮
    ax.set_yticks([0.2, 0.4, 0.6, 0.8, 1.0])
    ax.set_title('Model Comparison', fontsize=14, pad=20)
    ax.legend(loc='upper right', bbox_to_anchor=(1.3, 1.1))
    plt.savefig(OUT_DIR / "06_compressed_radar.png", dpi=DPI, bbox_inches='tight')
    plt.close()
    print("✅ 06 — 壓縮的雷達圖 (差異不可見)")


# ============================================================================
# main
# ============================================================================
def main():
    print(f"輸出資料夾: {OUT_DIR}\n")
    bad_01_3d_pie()
    bad_02_rainbow_heatmap()
    bad_03_truncated_baseline()
    bad_04_naked_pca()
    bad_05_legend_clash_roc()
    bad_06_compressed_radar()
    print(f"\n🎉 6 張壞圖已產出。教師對照解答請看 W15_bad_charts_answer_key.md")


if __name__ == "__main__":
    main()
