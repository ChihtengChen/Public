#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
W15 視覺化語彙 — 學員講義 HTML 生成器(取代原本的 PDF 路線)

設計理念:
- HTML 比 PDF 在 Windows 上呈現更好(中文字型直接用瀏覽器內建)
- 自包含(.html 內嵌 CSS),學員雙擊即可開啟
- demo 圖片用相對路徑 W15_demo/*.png (放 output/ 內,與 HTML 同層)
- 列印時可用瀏覽器 Ctrl+P 轉 PDF(品質遠勝 WeasyPrint)

執行:
    cd D:\\AI_Code\\Allen_Courses\\ML_W15_W18
    python W15_build_html.py

產出:
    output/W15_handout.html
"""

import sys
from pathlib import Path

# Windows 主控台 UTF-8
for _s in (sys.stdout, sys.stderr):
    try:
        _s.reconfigure(encoding='utf-8')
    except (AttributeError, ValueError):
        pass

ROOT = Path(__file__).resolve().parent
OUT_DIR = ROOT / "output"
OUT_DIR.mkdir(parents=True, exist_ok=True)
OUT_HTML = OUT_DIR / "W15_handout.html"
CSS_FILE = ROOT / "templates" / "style_w15.css"

# 檢查 demo PNG(用相對路徑,瀏覽器自己解析)
DEMO_REL = "W15_demo"
DEMO_DIR = OUT_DIR / "W15_demo"
needed = ["01_data_distribution.png", "02_correlation_heatmap.png",
          "03_confusion_matrix.png",  "04_feature_importance.png"]
missing = [f for f in needed if not (DEMO_DIR / f).exists()]
if missing:
    print("⚠️  尚未在 output/W15_demo/ 找到以下 PNG:")
    for f in missing:
        print(f"    - {f}")
    print("    請先執行: python W15_demo_visualization_cells.py")

# 讀 CSS 內嵌到 HTML(自包含,學員雙擊即開)
css_content = CSS_FILE.read_text(encoding='utf-8')

# HTML 主體
HTML = """<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="utf-8">
<title>W15 視覺化語彙 — 學員講義</title>
<style>
__CSS__
/* 額外的螢幕呈現補強(覆蓋 PDF 用的尺寸) */
body {
  max-width: 880px;
  margin: 0 auto;
  padding: 20px 36px;
  font-size: 14.5px;
  line-height: 1.7;
  background: #FAFAFA;
}
.section-title { font-size: 17pt; }
.subsection-title { font-size: 14pt; }
.content-table { font-size: 13px; }
.callout, .ai-block, .learning-points, .allen-quote { font-size: 14px; }
.prompt-box { font-size: 13px; }
.demo-cell { width: calc(50% - 12px); }
.demo-img { max-height: none; }
.page-break { display: block; height: 1px; border-top: 1px dashed #ccc; margin: 24px 0; }
a { color: #2A9D8F; text-decoration: none; border-bottom: 1px dotted #2A9D8F; }
a:hover { color: #E76F51; border-bottom: 1px solid #E76F51; }
a code { color: inherit; background: #F0F9F8; }
/* 螢幕加上的卡片陰影 */
.section, .subsection, .demo-cell {
  background: #FFFFFF;
}
/* 列印用 */
@media print {
  body { max-width: none; padding: 0; background: white; font-size: 9.5pt; }
  .page-break { page-break-after: always; border: none; height: 0; }
}
</style>
</head>
<body>

<div class="header">
  <div class="title-main">W15 視覺化語彙:用 ML 模型結果學會「看見估算」</div>
  <div class="title-sub">《機器學習》課程 ｜ 智工系二年級 ｜ 3 堂 × 50 分鐘 ｜ 學員講義</div>
  <div class="meta-row">
    <span>講師:陳志騰(Allen)、吳佩蓉</span>
    <span>對齊單元:Unit 9 整合設計與數據敘事</span>
    <span>W15 / 全 18 週</span>
  </div>
</div>

<div class="instruction">
  <strong>本週學習目標</strong>:本週起進入視覺化段落,核心翻轉——前 14 週主要是「<strong>跑模型</strong>」
  (sklearn 預處理、線性回歸、KNN、SVM、決策樹、交叉驗證), W15 起改為「<strong>把模型結果說給人聽</strong>」。
  3 堂課結束後你能:應用<strong>費米推論</strong>檢驗 ML 模型輸出合理性、依資料特性參照
  <strong>FT Visual Vocabulary</strong> 為 ML 結果選對圖、建立<strong>視覺編碼直覺</strong>、
  用 <strong>AI 鷹架</strong>協助產出 matplotlib/seaborn 程式碼。
</div>

<!-- ============ 第一堂 ============ -->
<div class="section">
  <div class="section-title">第一堂 (50 分鐘):費米暖身與視覺化語彙導論</div>

  <div class="subsection">
    <div class="subsection-title">1. 費米暖身 The Hook (15 分鐘)</div>
    <div class="callout">
      <strong>[費米 Q]</strong> 你訓練的乳癌診斷模型 accuracy = 0.95,這個模型如果部署到台中某醫院,
      <strong>一天會錯判幾位患者?</strong>
    </div>
    <table class="content-table">
      <thead>
        <tr><th class="col-step">Step</th><th>拆解</th><th class="col-est">量級估算</th></tr>
      </thead>
      <tbody>
        <tr><td>見</td><td>一天有多少病人做乳房攝影?</td><td>約 80-120 人/日</td></tr>
        <tr><td>見</td><td>其中陽性(真有問題)的比例?</td><td>約 1-3%(基準率)</td></tr>
        <tr><td>識</td><td>95% accuracy 但 prevalence 只有 2%,意味什麼?</td><td>accuracy 騙人,要看 recall</td></tr>
        <tr><td>識</td><td>若 recall=0.80, precision=0.30,每天遺漏幾位?</td><td>≈ 0.4 位</td></tr>
        <tr><td>謀</td><td>視覺化要怎麼讓主管看到這個衝突?</td><td>畫混淆矩陣 + PR 曲線,不畫單一 accuracy</td></tr>
      </tbody>
    </table>
  </div>

  <div class="subsection">
    <div class="subsection-title">2. 知識講授 The Concept (25 分鐘)</div>
    <p><strong>(a) 視覺編碼三層次</strong> — 重要訊息用精準通道;類別才用色相。</p>
    <table class="content-table">
      <thead><tr><th>編碼通道</th><th>人眼解碼精準度</th><th>ML 適用情境</th></tr></thead>
      <tbody>
        <tr><td>位置 (position)</td><td>★★★★★</td><td>散佈圖看 X vs Y、PCA 投影</td></tr>
        <tr><td>長度 (length)</td><td>★★★★</td><td>長條圖看特徵重要性</td></tr>
        <tr><td>角度/面積</td><td>★★ 易誤判</td><td>樹狀圖、避免圓餅圖</td></tr>
        <tr><td>顏色深淺</td><td>★★</td><td>熱圖看相關矩陣</td></tr>
        <tr><td>顏色色相</td><td>★ 僅適合類別</td><td>分類結果上色</td></tr>
      </tbody>
    </table>

    <p><strong>(b) FT Visual Vocabulary 九大類對應 ML 場景</strong></p>
    <table class="content-table">
      <thead><tr><th>FT 類別</th><th>ML 場景</th><th>推薦圖表</th></tr></thead>
      <tbody>
        <tr><td>Magnitude(量級)</td><td>特徵重要性排序</td><td>Bar / Lollipop</td></tr>
        <tr><td>Distribution(分佈)</td><td>預測值殘差分佈</td><td>Histogram / KDE / Boxplot</td></tr>
        <tr><td>Correlation(關聯)</td><td>特徵共線性</td><td>Scatter / Heatmap</td></tr>
        <tr><td>Ranking(排序)</td><td>模型比較表現</td><td>Lollipop / Slope</td></tr>
        <tr><td>Change over Time</td><td>訓練曲線(loss/acc)</td><td>Line / Area</td></tr>
        <tr><td>Part-to-Whole</td><td>Confusion Matrix 比例</td><td>Treemap / Stacked Bar</td></tr>
        <tr><td>Deviation(差異)</td><td>預測 vs 實際</td><td>Bullet / Variance</td></tr>
        <tr><td>Flow(流向)</td><td>決策樹路徑</td><td>Sankey / Network</td></tr>
        <tr><td>Spatial(空間)</td><td>地理 ML 結果</td><td>Choropleth</td></tr>
      </tbody>
    </table>

    <p><strong>(c) ML 視覺化 SOP:通用 vs 專屬框架</strong> — 比死記每個模型的 3 張清單好用,
    遇到隨機森林、神經網路也能套用。詳見配套《<strong>視覺化決策卡</strong>》
    (<a href="viz_framework_card.html" target="_blank"><code>viz_framework_card.html</code></a>,印出貼牆)。</p>

    <p><strong>① 通用必畫 4 張</strong>(每個模型都一樣 — 診斷「資料」與「結果」):</p>
    <ol class="must-list">
      <li><strong>資料分佈圖</strong> <code>sns.pairplot</code> — 類別可分性</li>
      <li><strong>特徵相關熱圖</strong> <code>sns.heatmap(df.corr())</code> — 共線性災難</li>
      <li><strong>混淆矩陣</strong> <code>confusion_matrix(...)</code> — FN/FP 失衡;⚠️ 記得 <code>pos_label=</code></li>
      <li><strong>特徵重要性</strong> <code>.feature_importances_</code> <em>或</em> <code>permutation_importance</code>
        — KNN/SVM 沒有原生屬性,<strong>必須改用 permutation_importance</strong></li>
    </ol>

    <p><strong>② 模型專屬 +1~2 張</strong>(依模型而異 — 診斷「模型機制」):</p>
    <table class="content-table">
      <thead><tr><th>模型</th><th>專屬圖</th><th>sklearn API</th><th>診斷重點</th></tr></thead>
      <tbody>
        <tr><td>🌲 決策樹</td><td>樹結構圖</td><td><code>plot_tree(clf)</code></td><td>樹過深 = 過擬合徵兆</td></tr>
        <tr><td>📍 KNN</td><td>決策邊界圖</td><td><code>DecisionBoundaryDisplay</code></td><td>邊界鋸齒 = k 太小;確認標準化做對</td></tr>
        <tr><td>⚔️ SVM</td><td>間隔 / 支持向量圖</td><td><code>clf.support_vectors_</code></td><td>SV 太多 = 沒泛化;margin 窄 = 線性不可分</td></tr>
      </tbody>
    </table>

    <p><strong>③ 三模型都要再加:驗證曲線</strong> <code>validation_curve / learning_curve</code>
    — train 與 val 曲線分岔大 = 過擬合,兩條都低 = 欠擬合。</p>

    <div class="callout">
      <strong>🎯 SOP 工作流(3 步):</strong>
      Step 1 先畫 4 通用 → Step 2 問「這模型獨特機制是什麼?」補 1~2 張專屬 → Step 3 加驗證曲線確認沒過/欠擬合。
    </div>
  </div>

  <div class="subsection ai-block">
    <div class="ai-title">🤖 AI 鷹架 #1(本週 3 個之 1):用「通用 vs 專屬」框架建立診斷清單</div>
    <p class="ai-meta"><strong>個人實作 8-10 分鐘 → 上傳 TronClass「W15 AI 鷹架 #1」隨堂回應欄</strong></p>

    <div class="prompt-box">
      <strong>Prompt #1(通用層):</strong>
      「我正在學習機器學習視覺化。請扮演 <strong>資深 ML 工程師</strong>。
      不論我用什麼模型,有 4 張『<strong>通用必畫圖</strong>』可以診斷『資料品質』與『模型輸出』(資料分佈、相關熱圖、混淆矩陣、特徵重要性)。
      請對這 4 張圖各給出:(a) 具體 sklearn API、(b) 該看圖中哪個位置、(c) 出現什麼徵兆代表
      『<strong>過擬合 / 欠擬合 / 資料不平衡 / 特徵共線</strong>』中的哪一種故障。
      特別說明第 4 張『特徵重要性』:KNN/SVM 為什麼不能用 <code>.feature_importances_</code>,
      應該改用 <code>permutation_importance</code>。」
    </div>

    <div class="prompt-box">
      <strong>Prompt #2(專屬層):</strong>
      「延續上面,我現在要使用 <strong>KNN / SVM / 決策樹</strong> 三選一(你挑一個並說明選的理由)。
      請告訴我:(a) 這個模型有什麼<strong>獨特機制</strong>是 4 通用圖看不到的?
      (b) 該補哪 1~2 張<strong>模型專屬圖</strong>(樹結構 / 決策邊界 / 間隔圖)、具體 sklearn API、看什麼徵兆?
      (c) 為什麼三個模型都還要加一張 <code>validation_curve</code> 或 <code>learning_curve</code>?」
    </div>

    <div class="prompt-box">
      <strong>Prompt #3(收斂):</strong>「請彙整以上互動討論,以『<strong>4 通用 + 1~2 專屬 + 1 驗證曲線</strong>』的格式
      整理成 100 字內的個人診斷清單,標出每張圖的 sklearn API 名稱即可。」
    </div>

    <p class="muted">💡 <strong>學習目標:</strong>不是死記某個模型該畫哪幾張,而是學會「<strong>通用 vs 專屬</strong>」的思維分類——
    以後遇到隨機森林、XGBoost、神經網路也能立刻套用。</p>
  </div>
</div>

<div class="page-break"></div>

<!-- ============ 第二堂 ============ -->
<div class="section">
  <div class="section-title">第二堂 (50 分鐘):sklearn + matplotlib/seaborn 雙軌實作</div>

  <div class="subsection">
    <div class="subsection-title">任務:用 breast_cancer 資料集訓練 KNN,畫出「四個必畫」</div>
    <p>跟著 <code>W15_demo_visualization_cells.py</code> 逐 cell 跑。配色用 <span class="hex">#E76F51</span>
    (burnt sienna,警示)與 <span class="hex">#2A9D8F</span>(persian green,正常)。
    每張圖畫完問自己一句:「<strong>這張圖告訴你什麼?</strong>」(成品見下方圖庫)</p>

    <table class="content-table">
      <thead><tr><th>Cell</th><th>內容</th><th>關鍵 sklearn API</th></tr></thead>
      <tbody>
        <tr><td>Cell 1</td><td>資料分佈圖(pairplot 4 特徵)</td><td>load_breast_cancer, sns.pairplot</td></tr>
        <tr><td>Cell 2</td><td>特徵相關熱圖(Top 10 features)</td><td>df.corr(), sns.heatmap</td></tr>
        <tr><td>Cell 3</td><td>混淆矩陣(KNN k=5)</td><td>ConfusionMatrixDisplay.from_predictions</td></tr>
        <tr><td>Cell 4</td><td>特徵重要性(決策樹)</td><td>DecisionTreeClassifier, .feature_importances_</td></tr>
      </tbody>
    </table>
  </div>

  <div class="subsection ai-block">
    <div class="ai-title">🤖 AI 鷹架 #2(本週 3 個之 2):圖表選型 + 程式碼產出</div>
    <p class="ai-meta"><strong>個人實作 10 分鐘 → 上傳 TronClass「W15 AI 鷹架 #2」隨堂回應欄</strong></p>
    <div class="prompt-box">
      <strong>Prompt #1(選型):</strong>「我訓練了一個 sklearn 決策樹模型來分類乳癌良性/惡性,
      想呈現:(1) 哪個特徵最重要、(2) 模型在哪一類錯得最多、(3) 整體準確率。
      請扮演 <strong>資料視覺化教練</strong>,參考 Financial Times Visual Vocabulary,為三件事各推薦一張圖,並說明為什麼。」
    </div>
    <div class="prompt-box">
      <strong>Prompt #2(產碼):</strong>「請用 matplotlib + seaborn 寫出 Prompt #1 的三張圖。
      配色用 burnt sienna (#E76F51) 與 persian green (#2A9D8F)。圖表不要 chartjunk
      (不要 3D、不要陰影、不要過多格線)。」
    </div>
    <div class="prompt-box">
      <strong>Prompt #3(收斂):</strong>「請彙整以上互動討論,提供 <strong>100 字內</strong>的重點彙整。」
    </div>
  </div>

  <div class="subsection">
    <div class="subsection-title">即時小考</div>
    <div class="callout warn">
      一張混淆矩陣顯示 <strong>FN 比 FP 多 5 倍</strong>。在乳癌診斷情境下,你會建議怎麼調整模型?<br>
      (A) 提高 K 值 (B) 調整決策閾值降低陽性門檻 (C) 重新蒐集資料 (D) 把 accuracy 印大一點
    </div>
    <p class="muted">提示:思考「漏掉惡性」與「誤判健康」哪個成本高。答案見課堂講評。</p>
    <p class="muted">📖 延伸閱讀:<a href="W15_breast_cancer_metrics_lecture_2.html" target="_blank"><strong>閾值:那條看不見的切割線</strong></a>(費曼式長文,從一個漏診談起 → 混淆矩陣 / ROC / PR 曲線)</p>
  </div>
</div>

<div class="page-break"></div>

<!-- ============ 課堂示範圖庫 ============ -->
<div class="section">
  <div class="section-title">🖼️ 課堂示範圖庫:四個必畫 (W15_demo_visualization_cells.py 產出)</div>

  <p class="muted">
    以下 4 張圖由 <code>W15_demo_visualization_cells.py</code> 跑出,
    對應 sklearn breast_cancer 資料集(569 筆 × 30 維)。每張圖下方的「<strong>看出來什麼</strong>」是 Allen 在課堂會問你的問題。
  </p>

  <div class="demo-grid">
    <div class="demo-cell">
      <div class="demo-title">必畫 #1:資料分佈 (pairplot)</div>
      <img class="demo-img" src="W15_demo/01_data_distribution.png" alt="資料分佈 pairplot">
      <div class="demo-caption"><strong>看出來什麼:</strong>良性(綠)與惡性(橘紅)在 mean radius / area 兩個特徵上幾乎可線性切開——這資料有救。</div>
    </div>

    <div class="demo-cell">
      <div class="demo-title">必畫 #2:特徵相關熱圖</div>
      <img class="demo-img" src="W15_demo/02_correlation_heatmap.png" alt="特徵相關熱圖">
      <div class="demo-caption"><strong>看出來什麼:</strong>radius / perimeter / area 三者深紅一片 = 高度共線性。SVM 與線性回歸要小心,KNN 還好。</div>
    </div>

    <div class="demo-cell">
      <div class="demo-title">必畫 #3:混淆矩陣 (KNN k=5, 惡性為 positive)</div>
      <img class="demo-img" src="W15_demo/03_confusion_matrix.png" alt="混淆矩陣">
      <div class="demo-caption"><strong>看出來什麼:</strong>FN=7、FP=0。模型「精準但不夠敏感」——<strong>漏判 7 個惡性</strong>, 在乳癌篩檢這是危險方向 (recall 才 89%)。教訓:sklearn 預設 <code>pos_label=1</code> 算的是 benign recall=1.000, 必須改用 <code>pos_label=0</code>。</div>
    </div>

    <div class="demo-cell">
      <div class="demo-title">必畫 #4:特徵重要性 (決策樹)</div>
      <img class="demo-img" src="W15_demo/04_feature_importance.png" alt="特徵重要性">
      <div class="demo-caption"><strong>看出來什麼:</strong>worst radius / worst concave points 兩個特徵就吃掉一大半重要性。其他 28 個特徵的貢獻邊際遞減。</div>
    </div>
  </div>

  <div class="callout">
    <strong>🤔 課堂自問:</strong>這 4 張圖如果是你要交給「<strong>沒寫過程式的廠長</strong>」看,
    哪一張要放在報告第一頁?(提示:#4 最容易解釋、#3 最容易誤讀)
  </div>
</div>

<div class="page-break"></div>

<!-- ============ 第三堂 ============ -->
<div class="section">
  <div class="section-title">第三堂 (50 分鐘):FT Vocabulary 套用 + SCQA 起手式</div>

  <div class="subsection">
    <div class="subsection-title">SCQA × 見識謀斷 對應到 ML 報告</div>
    <table class="content-table">
      <thead><tr><th>SCQA</th><th>見識謀斷</th><th>ML 報告階段</th><th>推薦圖表</th></tr></thead>
      <tbody>
        <tr><td>S 情境</td><td>見</td><td>「我們有什麼資料?」</td><td>Bar / KPI Card</td></tr>
        <tr><td>C 衝突</td><td>識</td><td>「資料不平衡 / 模型偏誤」</td><td>Bullet / Heatmap</td></tr>
        <tr><td>Q 問題</td><td>識</td><td>「為什麼 recall 這麼低?」</td><td>(敘事文字)</td></tr>
        <tr><td>A 答案</td><td>謀+斷</td><td>「為什麼選這個模型?」</td><td>Slope / Radar</td></tr>
      </tbody>
    </table>
  </div>

  <div class="subsection ai-block">
    <div class="ai-title">🤖 AI 鷹架 #3(本週 3 個之 3):壞圖診斷與重設計</div>
    <p class="ai-meta"><strong>個人實作 20 分鐘 → 上傳 TronClass「W15 AI 鷹架 #3」隨堂回應欄</strong></p>
    <p><strong>分組規則:</strong>取你的<strong>座號末二碼 ÷ 6 的餘數</strong>對應壞圖編號(0→01、1→02、…、5→06)。
    例:學號 <code>B11234567</code> → 末二碼 67 → 67 % 6 = 1 → 看 <code>02_rainbow_heatmap.png</code>。</p>
    <p>📁 壞圖庫位置:<a href="W15_bad_charts/" target="_blank"><code>output/W15_bad_charts/</code></a>
    (共 6 張,檔名 <code>01_*.png</code> ~ <code>06_*.png</code>;由 <code>W15_bad_charts_gallery.py</code> 產出)</p>
    <p>找到你的編號圖之後,把圖的內容(圖表類型、軸、顏色、標題、有沒有 legend …)用文字描述給 AI:</p>
    <div class="prompt-box">
      <strong>Prompt #1(診斷):</strong>「我手上有一張 ML 報告中的圖表,呈現的是『...』。
      請扮演 <strong>資料視覺化稽核師</strong>,根據 Edward Tufte 的 Data-Ink Ratio 原則與
      Financial Times Visual Vocabulary 的分類標準,找出這張圖的 3 個主要缺陷,
      並對每個缺陷說明它<strong>如何拖慢讀者的決策速度</strong>。」
    </div>
    <div class="prompt-box">
      <strong>Prompt #2(重設計):</strong>「請扮演 <strong>資料視覺化教練</strong>,重新設計這張圖。
      請給出:(a) 應該改用的圖表類型與理由、(b) matplotlib/seaborn 程式碼骨架、
      (c) 一個<strong>結論式標題</strong>取代原來的『實驗結果』類標題。」
    </div>
    <div class="prompt-box">
      <strong>Prompt #3(收斂):</strong>「請彙整以上互動討論,提供 <strong>100 字內</strong>的重點彙整。」
    </div>
  </div>

  <div class="subsection">
    <div class="subsection-title">期末考預告</div>
    <ul>
      <li><strong>形式</strong>:個人實作 + AI 全面開放協作(不分組、不抽問)</li>
      <li><strong>時長</strong>:W18 上午,共 130 分鐘(實作主體 95 分鐘)</li>
      <li><strong>繳交</strong>:Notebook + 首頁圖 PNG + 簡報 PDF,三檔缺一當題零分</li>
      <li><strong>評分</strong>:技術 25%、視覺敘事 75%</li>
    </ul>
    <p class="muted">完整題本與文件範本將於 W17 第二堂公布(<code>final_exam_practical_brief.md</code>、<code>final_exam_template.md</code>、<code>final_exam_pre_check.md</code>)。</p>
  </div>

  <div class="subsection learning-points">
    <div class="subsection-title">🎓 學習重點與實踐建議 (SCQA)</div>
    <ol>
      <li><strong>視覺編碼直覺 (S, Discover 見)</strong>:位置 &gt; 長度 &gt; 顏色。寫 plt.___ 前先在白板畫一遍。</li>
      <li><strong>通用 vs 專屬框架 (C, Define 識)</strong>:先 4 通用(分佈/熱圖/混淆/重要性)→ 再加 1~2 模型專屬 → 加驗證曲線。KNN/SVM 的特徵重要性記得用 <code>permutation_importance</code>。</li>
      <li><strong>AI 鷹架三段式 (A, Decide 斷)</strong>:拆解 → 產碼 → 彙整。不要直接索取答案。</li>
    </ol>
  </div>

  <div class="allen-quote">
    <strong>📝 Allen 老師隨堂叮嚀:</strong>
    「機器學習教你怎麼讓 accuracy 變高,視覺化教你怎麼讓決策者<strong>相信</strong>這個 accuracy。
    前者是科學家的工作,後者是工程師的工作。智工系畢業之後,你會花 30% 時間訓練模型,
    70% 時間說服別人這個模型。<strong>這 70%,從這 3 週開始練</strong>。」
  </div>
</div>


<div class="footer-note">
  <strong>W15 講義 (HTML)</strong> ｜ 配套程式 <code>W15_demo_visualization_cells.py</code>
  ｜ 簡報 <code>W15_slides.pptx</code> ｜ 視覺化決策卡 <a href="viz_framework_card.html" target="_blank"><code>viz_framework_card.html</code></a>(印出貼牆)
  ｜ 壞圖庫 <a href="W15_bad_charts/" target="_blank"><code>output/W15_bad_charts/</code></a>(6 張,座號末二碼 % 6 對應)
  ｜ 同步發布於 TronClass ｜ <em>瀏覽器列印 (Ctrl+P) 可轉成 PDF</em>
</div>

</body>
</html>
"""


def main():
    html_out = HTML.replace("__CSS__", css_content)
    OUT_HTML.write_text(html_out, encoding="utf-8")
    print(f"✅ 完成: {OUT_HTML}")
    print(f"   打開方式: 雙擊檔案,或 file:///{OUT_HTML.as_posix()}")
    if missing:
        print("   (示範圖部分缺失, 請執行 W15_demo_visualization_cells.py)")


if __name__ == "__main__":
    main()
