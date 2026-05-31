#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
W15 視覺化語彙 — 學員講義 PDF 生成器

定位:
- 學員可帶到教室的紙本講義(對應 3 堂課,每堂 50 分鐘)
- 套用 Allen 設計系統(CSS 在 templates/style_w15.css)
- 第 3 頁嵌入 W15_demo 4 張示範圖(由 W15_demo_visualization_cells.py 產出)

執行:
    cd D:\\AI_Code\\Allen_Courses\\ML_W15_W18
    python W15_build_pdf.py

產出:
    output/W15_handout.pdf
"""

from pathlib import Path
from weasyprint import HTML, CSS
from weasyprint.text.fonts import FontConfiguration

ROOT = Path(__file__).resolve().parent
OUT_DIR = ROOT / "output"
OUT_DIR.mkdir(parents=True, exist_ok=True)
OUT_PDF = OUT_DIR / "W15_handout.pdf"
CSS_FILE = ROOT / "templates" / "style_w15.css"

# === 課堂示範圖庫(由 W15_demo_visualization_cells.py 產出) ===
DEMO_DIR = OUT_DIR / "W15_demo"


def _img_uri(filename: str) -> str:
    p = DEMO_DIR / filename
    return p.as_uri() if p.exists() else ""


IMG_PAIRPLOT = _img_uri("01_data_distribution.png")
IMG_HEATMAP  = _img_uri("02_correlation_heatmap.png")
IMG_CONFMAT  = _img_uri("03_confusion_matrix.png")
IMG_FEATIMP  = _img_uri("04_feature_importance.png")

DEMO_READY = all([IMG_PAIRPLOT, IMG_HEATMAP, IMG_CONFMAT, IMG_FEATIMP])
if not DEMO_READY:
    print("⚠️  尚未在 output/W15_demo/ 找到 4 張示範 PNG。")
    print("    請先執行: python W15_demo_visualization_cells.py")
    print("    產出 PDF 仍會生成,但示範圖庫頁會顯示空白。")


HTML_BODY = r"""
<!DOCTYPE html>
<html lang="zh-TW">
<head><meta charset="utf-8"></head>
<body>

<!-- ============ 第 1 頁:Header + 第一堂 ============ -->
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

    <p><strong>(b) <a href="https://public.tableau.com/app/profile/fshih/viz/VisualVocabulary_18/VisualVocabulary" target="_blank" rel="noopener">FT Visual Vocabulary 九大類對應 ML 場景</a></strong></p>
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

    <p><strong>(c) ML 視覺化的「四個必畫」</strong> — 任何 ML 報告必有的 4 張圖:</p>
    <ol class="must-list">
      <li><strong>資料分佈圖</strong>(你餵了模型什麼?)</li>
      <li><strong>特徵相關熱圖</strong>(特徵之間互相打架嗎?)</li>
      <li><strong>混淆矩陣</strong>(模型錯在哪?)</li>
      <li><strong>特徵重要性</strong>(模型靠什麼決策?)</li>
    </ol>
  </div>

  <div class="subsection ai-block">
    <div class="ai-title">🤖 AI 鷹架 #1(本週 3 個之 1):模型「壞掉」會留下什麼視覺證據?</div>
    <p class="ai-meta"><strong>個人實作 5-7 分鐘 → 上傳 TronClass「W15 AI 鷹架 #1」隨堂回應欄</strong></p>
    <div class="prompt-box">
      <strong>學生輸入 Prompt:</strong>
      「我正在學習機器學習視覺化。請扮演 <strong>資深 ML 工程師</strong>,從前 14 週學過的三個模型
      (KNN、SVM、決策樹)中挑一個,幫我建立一份『<strong>故障診斷視覺化清單</strong>』:
      當這個模型訓練結果出問題時,我應該畫哪 3 張圖、看圖中的哪個位置、會出現什麼徵兆才能立刻識破故障。
      請特別說明每張圖能診斷『<strong>過擬合 / 欠擬合 / 資料不平衡 / 特徵共線</strong>』中的哪一種,
      並給出具體的 sklearn API 名稱。」
    </div>
    <div class="prompt-box">
      <strong>收斂 Prompt:</strong>「請彙整以上互動討論,提供 <strong>100 字內</strong>的重點彙整。」
    </div>
  </div>
</div>

<div class="page-break"></div>

<!-- ============ 第 2 頁:第二堂 ============ -->
<div class="header-mini">
  <span><strong>W15 視覺化語彙</strong>(第 2 頁/共 4 頁)</span>
  <span>第二堂:sklearn + matplotlib/seaborn 雙軌實作</span>
</div>

<div class="section">
  <div class="section-title">第二堂 (50 分鐘):sklearn + matplotlib/seaborn 雙軌實作</div>

  <div class="subsection">
    <div class="subsection-title">任務:用 breast_cancer 資料集訓練 KNN,畫出「四個必畫」</div>
    <p>跟著 <code>W15_demo_visualization_cells.py</code> 逐 cell 跑。配色用 <span class="hex">#E76F51</span>
    (burnt sienna,警示)與 <span class="hex">#2A9D8F</span>(persian green,正常)。
    每張圖畫完問自己一句:「<strong>這張圖告訴你什麼?</strong>」(實際成品見下一頁圖庫)</p>

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
      一張混淆矩陣顯示 <strong>FN 比 FP 多 5 倍</strong>。在乳癌診斷情境下,你會建議怎麼調整模型?<br/>
      (A) 提高 K 值 (B) 調整決策閾值降低陽性門檻 (C) 重新蒐集資料 (D) 把 accuracy 印大一點
    </div>
    <p class="muted">提示:思考「漏掉惡性」與「誤判健康」哪個成本高。答案見課堂講評。</p>
  </div>
</div>

<div class="page-break"></div>

<!-- ============ 第 3 頁:課堂示範圖庫 ============ -->
<div class="header-mini">
  <span><strong>W15 視覺化語彙</strong>(第 3 頁/共 4 頁)</span>
  <span>課堂示範圖庫:四個必畫(load_breast_cancer)</span>
</div>

<div class="section">
  <div class="section-title">🖼️ 課堂示範圖庫:四個必畫 (W15_demo_visualization_cells.py 產出)</div>

  <p class="muted" style="margin: 1mm 0 3mm 0;">
    以下 4 張圖由 <code>W15_demo_visualization_cells.py</code> 跑出,
    對應 sklearn breast_cancer 資料集(569 筆 × 30 維)。每張圖下方的「<strong>看出來什麼</strong>」是 Allen 在課堂會問你的問題。
  </p>

  <div class="demo-grid">
    <div class="demo-cell">
      <div class="demo-title">必畫 #1:資料分佈 (pairplot)</div>
      <img class="demo-img" src="__IMG_PAIRPLOT__" alt="資料分佈 pairplot">
      <div class="demo-caption"><strong>看出來什麼:</strong>良性(綠)與惡性(橘紅)在 mean radius / area 兩個特徵上幾乎可線性切開——這資料有救。</div>
    </div>

    <div class="demo-cell">
      <div class="demo-title">必畫 #2:特徵相關熱圖</div>
      <img class="demo-img" src="__IMG_HEATMAP__" alt="特徵相關熱圖">
      <div class="demo-caption"><strong>看出來什麼:</strong>radius / perimeter / area 三者深紅一片 = 高度共線性。SVM 與線性回歸要小心,KNN 還好。</div>
    </div>

    <div class="demo-cell">
      <div class="demo-title">必畫 #3:混淆矩陣 (KNN k=5, 惡性為 positive)</div>
      <img class="demo-img" src="__IMG_CONFMAT__" alt="混淆矩陣">
      <div class="demo-caption"><strong>看出來什麼:</strong>FN=7、FP=0。模型漏判 7 個惡性, 沒誤判健康人——在乳癌篩檢是<strong>危險方向</strong> (recall 才 89%)。教訓:sklearn 預設 pos_label=1 算的是 benign 的 recall=1.000, 必須改用 pos_label=0。</div>
    </div>

    <div class="demo-cell">
      <div class="demo-title">必畫 #4:特徵重要性 (決策樹)</div>
      <img class="demo-img" src="__IMG_FEATIMP__" alt="特徵重要性">
      <div class="demo-caption"><strong>看出來什麼:</strong>worst radius / worst concave points 兩個特徵就吃掉一大半重要性。其他 28 個特徵的貢獻邊際遞減。</div>
    </div>
  </div>

  <div class="callout" style="margin-top: 3mm;">
    <strong>🤔 課堂自問:</strong>這 4 張圖如果是你要交給「<strong>沒寫過程式的廠長</strong>」看,
    哪一張要放在報告第一頁?(提示:#4 最容易解釋、#3 最容易誤讀)
  </div>
</div>

<div class="page-break"></div>

<!-- ============ 第 4 頁:第三堂 + 學習重點 ============ -->
<div class="header-mini">
  <span><strong>W15 視覺化語彙</strong>(第 4 頁/共 4 頁)</span>
  <span>第三堂:FT Vocabulary 套用 + SCQA 起手式</span>
</div>

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
    <p>你會抽到一張壞 ML 圖編號(課堂上公布),將圖內容描述給 AI:</p>
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
      <li><strong>繳交</strong>:Notebook + 首頁圖 PNG + 簡報(自由格式),三檔缺一當題零分</li>
      <li><strong>評分</strong>:技術 25%、視覺敘事 75%</li>
    </ul>
    <p class="muted">完整題本與文件範本將於 W17 第二堂公布。</p>
  </div>

  <div class="subsection learning-points">
    <div class="subsection-title">🎓 學習重點與實踐建議 (SCQA)</div>
    <ol>
      <li><strong>視覺編碼直覺 (S, Discover 見)</strong>:位置 &gt; 長度 &gt; 顏色。寫 plt.___ 前先在白板畫一遍。</li>
      <li><strong>「四個必畫」紀律 (C, Define 識)</strong>:資料分佈、特徵相關熱圖、混淆矩陣、特徵重要性——少一張要說明為什麼。</li>
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
  <strong>W15 講義</strong> ｜ 共 4 頁 ｜ 配套程式 <code>W15_demo_visualization_cells.py</code>
  ｜ 簡報 <code>W15_slides.pptx</code> 同步發布於 TronClass
</div>

</body>
</html>
"""


def main():
    html_body = (HTML_BODY
                 .replace("__IMG_PAIRPLOT__", IMG_PAIRPLOT)
                 .replace("__IMG_HEATMAP__",  IMG_HEATMAP)
                 .replace("__IMG_CONFMAT__",  IMG_CONFMAT)
                 .replace("__IMG_FEATIMP__",  IMG_FEATIMP))

    font_config = FontConfiguration()
    html = HTML(string=html_body, base_url=str(ROOT))
    css = CSS(filename=str(CSS_FILE), font_config=font_config)
    html.write_pdf(OUT_PDF, stylesheets=[css], font_config=font_config)
    print(f"✅ 完成: {OUT_PDF}")
    if not DEMO_READY:
        print("   (示範圖庫頁的 4 個圖位顯示空白,請執行 demo 後重跑此檔)")


if __name__ == "__main__":
    main()
