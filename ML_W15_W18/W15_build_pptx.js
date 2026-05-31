// W15_build_pptx.js — W15 視覺化語彙 簡報生成器
//
// 對應講義:W15 視覺化語彙(3 堂 × 50 分鐘)
// 簡報結構:封面 + 3 章節分隔 + 內容 slide + 3 個 AI 鷹架投票 + 課末叮嚀
//
// 執行:
//     cd D:\AI_Code\Allen_Courses\ML_W15_W18
//     node W15_build_pptx.js
//
// 產出:
//     output/W15_slides.pptx

const pptxgen = require("pptxgenjs");
const path = require("path");
const fs = require("fs");
const T = require("./templates/pptx_template.js");

const OUT_DIR = path.join(__dirname, "output");
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
const OUT_FILE = path.join(OUT_DIR, "W15_slides.pptx");

// 課堂示範圖庫(由 W15_demo_visualization_cells.py 產出)
const DEMO_DIR = path.join(OUT_DIR, "W15_demo");
const IMG = {
  pairplot: path.join(DEMO_DIR, "01_data_distribution.png"),
  heatmap:  path.join(DEMO_DIR, "02_correlation_heatmap.png"),
  confmat:  path.join(DEMO_DIR, "03_confusion_matrix.png"),
  featimp:  path.join(DEMO_DIR, "04_feature_importance.png"),
};
const DEMO_READY = Object.values(IMG).every(p => fs.existsSync(p));
if (!DEMO_READY) {
  console.log("⚠️  尚未在 output/W15_demo/ 找到 4 張示範 PNG。");
  console.log("    請先執行: python W15_demo_visualization_cells.py");
  console.log("    產出 PPTX 仍會生成,但示範圖頁會顯示空白佔位。");
}

// Demo 圖片簡報 helper:左側大圖 + 右側「看出來什麼」說明
function addDemoSlide(pres, opts, pageNum, totalPages) {
  const slide = pres.addSlide();
  slide.background = { color: T.PALETTE.bgWhite };

  // 標題列(沿用 addSlideTitle 風格)
  slide.addShape("rect", {
    x: 0.5, y: 0.4, w: 0.12, h: 0.65,
    fill: { color: T.PALETTE.primary }, line: { color: T.PALETTE.primary },
  });
  slide.addText(opts.title, {
    x: 0.75, y: 0.35, w: 11.5, h: 0.5,
    fontSize: T.SIZE.slideTitle, fontFace: T.FONT.primary, bold: true,
    color: T.PALETTE.textDark, align: "left", valign: "middle", margin: 0,
  });
  slide.addText(opts.subtitle || "", {
    x: 0.75, y: 0.85, w: 11.5, h: 0.55,
    fontSize: T.SIZE.slideSubtitle, fontFace: T.FONT.primary,
    color: T.PALETTE.textMuted, align: "left", valign: "top", margin: 0,
  });

  // 左側大圖
  if (opts.imgPath && fs.existsSync(opts.imgPath)) {
    slide.addImage({
      path: opts.imgPath,
      x: 0.5, y: 1.6, w: 7.2, h: 5.2,
      sizing: { type: "contain", w: 7.2, h: 5.2 },
    });
  } else {
    slide.addShape("rect", {
      x: 0.5, y: 1.6, w: 7.2, h: 5.2,
      fill: { color: T.PALETTE.bgSoft },
      line: { color: T.PALETTE.border, width: 1 },
    });
    slide.addText("(請先執行 W15_demo_visualization_cells.py 產生圖檔)", {
      x: 0.5, y: 3.9, w: 7.2, h: 0.6,
      fontSize: 14, fontFace: T.FONT.primary, italic: true,
      color: T.PALETTE.textMuted, align: "center", valign: "middle",
    });
  }

  // 右側「看出來什麼」說明欄
  slide.addShape("rect", {
    x: 8.0, y: 1.6, w: 4.83, h: 5.2,
    fill: { color: T.PALETTE.bgSoft },
    line: { color: T.PALETTE.border, width: 0.5 },
  });
  slide.addShape("rect", {
    x: 8.0, y: 1.6, w: 4.83, h: 0.12,
    fill: { color: T.PALETTE.secondary }, line: { color: T.PALETTE.secondary },
  });
  slide.addText("🔍 看出來什麼?", {
    x: 8.2, y: 1.8, w: 4.5, h: 0.5,
    fontSize: 18, fontFace: T.FONT.primary, bold: true,
    color: T.PALETTE.secondary, align: "left",
  });
  slide.addText(opts.observation || "", {
    x: 8.2, y: 2.4, w: 4.5, h: 3.4,
    fontSize: 14, fontFace: T.FONT.primary,
    color: T.PALETTE.textDark, align: "left", valign: "top",
    paraSpaceAfter: 6,
  });

  // 課堂自問 callout(在右側下方)
  if (opts.askYourself) {
    slide.addShape("rect", {
      x: 8.0, y: 5.95, w: 4.83, h: 0.85,
      fill: { color: T.PALETTE.bgPrimaryLight },
      line: { color: T.PALETTE.primary, width: 0 },
    });
    slide.addShape("rect", {
      x: 8.0, y: 5.95, w: 0.10, h: 0.85,
      fill: { color: T.PALETTE.primary }, line: { color: T.PALETTE.primary },
    });
    slide.addText("🤔 " + opts.askYourself, {
      x: 8.2, y: 6.0, w: 4.55, h: 0.75,
      fontSize: 11, fontFace: T.FONT.primary, italic: true,
      color: T.PALETTE.textDark, align: "left", valign: "middle",
    });
  }

  T.addFooter(slide, pageNum, totalPages);
  return slide;
}
const pres = new pptxgen();
pres.layout = T.LAYOUT.name;
pres.defineLayout({
  name: T.LAYOUT.name,
  width: T.LAYOUT.width,
  height: T.LAYOUT.height,
});


// 預估總頁數(用於頁碼) — 24 原始 + 4 demo 圖頁 = 28
const TOTAL = 28;
let page = 0;

// ============================================================================
// 1. 封面 (p.1)
// ============================================================================
T.addCoverSlide(pres, {
  dayTag: "W15 ｜ 視覺化語彙",
  unitTitle: "用 ML 模型結果學會「看見估算」",
  unitSubtitle: "FT Vocabulary × 四個必畫 × AI 鷹架三段式",
  dateTimeStr: "W15 第 1-3 堂 ｜ 3 堂 × 50 分鐘",
});

// ============================================================================
// 2. 本週目標 (p.2)
// ============================================================================
page = 2;
T.addContentSlide(
  pres,
  {
    title: "W15 學完三件事",
    subtitle: "前 14 週主要是『跑模型』, W15 起改為『把模型結果說給人聽』",
    body: (slide) => {
      T.bodyBullets(slide, [
        { text: "應用費米推論 檢驗 ML 模型輸出的合理性", bold: true, color: T.PALETTE.primary },
        { text: "  例如:accuracy=0.99 是真的還是 data leakage?", indent: 1, color: T.PALETTE.textMuted },
        { text: "依資料特性 參照 FT Visual Vocabulary 選對圖", bold: true, color: T.PALETTE.primary },
        { text: "  混淆矩陣 vs ROC vs 特徵重要性 各有何時用", indent: 1, color: T.PALETTE.textMuted },
        { text: "建立 視覺編碼直覺", bold: true, color: T.PALETTE.primary },
        { text: "  位置 > 長度 > 顏色;類別才用色相", indent: 1, color: T.PALETTE.textMuted },
        { text: "用 AI 鷹架 協助產出 matplotlib/seaborn 程式碼", bold: true, color: T.PALETTE.primary },
        { text: "  本週 3 個 AI 鷹架 → 全部上傳 TronClass", indent: 1, color: T.PALETTE.textMuted },
      ]);
    },
  },
  page, TOTAL
);

// ============================================================================
// 3. 第一堂章節分隔 (p.3)
// ============================================================================
page = 3;
T.addSectionDivider(
  pres,
  {
    sectionMark: "§1",
    title: "第一堂:費米暖身與視覺化語彙導論",
    subtitle: "為什麼一個 accuracy 不夠你判斷模型好不好",
    timeRange: "50 分鐘 ｜ 費米 15 + 概念 25 + 收尾 10",
  },
  page, TOTAL
);

// ============================================================================
// 4. 費米暖身 The Hook (p.4)
// ============================================================================
page = 4;
T.addContentSlide(
  pres,
  {
    title: "[費米 Q] 一個 accuracy=0.95 的模型,一天錯判幾位?",
    subtitle: "在你動手畫圖之前,先建立對數量級的直覺",
    body: (slide) => {
      T.bodyTable(slide, [
        ["Step", "拆解", "量級估算"],
        ["見", "一天有多少病人做乳房攝影?", "約 80-120 人/日"],
        ["見", "其中陽性(真有問題)的比例?", "約 1-3%(基準率)"],
        ["識", "95% accuracy 但 prevalence 只有 2%,意味什麼?", "accuracy 騙人,要看 recall"],
        ["識", "若 recall=0.80, precision=0.30,每天遺漏幾位?", "≈ 0.4 位"],
        ["謀", "視覺化要怎麼讓主管看到衝突?", "畫混淆矩陣 + PR 曲線,不畫單一 accuracy"],
      ], {
        y: 1.5,
        colW: [1.2, 6.5, 4.2],
        rowH: 0.55,
        headerFontSize: 16,
        fontSize: 14,
      });
    },
  },
  page, TOTAL
);

// ============================================================================
// 5. 視覺編碼三層次 (p.5)
// ============================================================================
page = 5;
T.addContentSlide(
  pres,
  {
    title: "視覺編碼:把數據映射到視覺特徵",
    subtitle: "重要訊息用精準通道,類別才用色相",
    body: (slide) => {
      T.bodyTable(slide, [
        ["編碼通道", "人眼解碼精準度", "ML 適用情境"],
        ["位置 (position)", "★★★★★", "散佈圖看 X vs Y、PCA 投影"],
        ["長度 (length)", "★★★★", "長條圖看特徵重要性"],
        ["角度/面積", "★★ 易誤判", "樹狀圖、避免圓餅圖"],
        ["顏色深淺", "★★", "熱圖看相關矩陣"],
        ["顏色色相", "★ 僅適合類別", "分類結果上色"],
      ], {
        y: 1.5,
        colW: [3.5, 3.5, 4.9],
        rowH: 0.65,
        fontSize: 15,
      });
      T.bodyCallout(
        slide,
        "把 class label 畫成漸層色 (spectral) 是大忌——類別之間沒有順序。",
        "規則:位置 > 長度 > 顏色"
      );
    },
  },
  page, TOTAL
);

// ============================================================================
// 6. FT Visual Vocabulary 九大類 (p.6)
// ============================================================================
page = 6;
T.addContentSlide(
  pres,
  {
    title: "FT Visual Vocabulary 九大類 × ML 場景",
    subtitle: "視覺化界的元素週期表",
    body: (slide) => {
      T.bodyTable(slide, [
        ["FT 類別", "ML 場景", "推薦圖表"],
        ["Magnitude(量級)", "特徵重要性排序", "Bar / Lollipop"],
        ["Distribution(分佈)", "預測值殘差分佈", "Histogram / KDE / Boxplot"],
        ["Correlation(關聯)", "特徵共線性", "Scatter / Heatmap"],
        ["Ranking(排序)", "模型比較表現", "Lollipop / Slope chart"],
        ["Change over Time", "訓練曲線 (loss/acc)", "Line / Area"],
        ["Part-to-Whole", "Confusion Matrix 比例", "Treemap / Stacked Bar"],
        ["Deviation(差異)", "預測 vs 實際", "Bullet / Variance"],
        ["Flow(流向)", "決策樹路徑", "Sankey / Network"],
        ["Spatial(空間)", "地理 ML 結果", "Choropleth"],
      ], {
        y: 1.5,
        colW: [3.7, 4.2, 4.0],
        rowH: 0.43,
        headerFontSize: 14,
        fontSize: 13,
      });
    },
  },
  page, TOTAL
);

// ============================================================================
// 7. 四個必畫紀律 (p.7)
// ============================================================================
page = 7;
T.addContentSlide(
  pres,
  {
    title: "視覺化 SOP:通用 vs 專屬框架",
    subtitle: "4 通用 + 1~2 專屬 + 1 驗證曲線 — 比死記每模型清單好用",
    body: (slide) => {
      T.bodyBullets(slide, [
        { text: "【通用必畫 4 張】每個模型都一樣 — 診斷「資料」與「結果」", bold: true, color: T.PALETTE.secondary },
        { text: "① 資料分佈 pairplot  ② 相關熱圖 heatmap", indent: 1, color: T.PALETTE.textDark },
        { text: "③ 混淆矩陣 (記得 pos_label)  ④ 特徵重要性", indent: 1, color: T.PALETTE.textDark },
        { text: "   ⚠️ KNN/SVM 沒有 .feature_importances_,改用 permutation_importance", indent: 1, color: T.PALETTE.primary },
        { text: "【模型專屬 +1~2 張】依模型而異 — 診斷「機制」", bold: true, color: T.PALETTE.primary },
        { text: "🌲 決策樹 → 樹結構圖 plot_tree", indent: 1, color: T.PALETTE.textDark },
        { text: "📍 KNN → 決策邊界圖 DecisionBoundaryDisplay", indent: 1, color: T.PALETTE.textDark },
        { text: "⚔️ SVM → 間隔/支持向量 clf.support_vectors_", indent: 1, color: T.PALETTE.textDark },
        { text: "【★ 三模型都要再加】驗證曲線 validation_curve / learning_curve", bold: true, color: T.PALETTE.accent },
        { text: "   診斷過擬合 vs 欠擬合 — train 與 val 曲線分岔大 = 過擬合", indent: 1, color: T.PALETTE.textDark },
      ]);
      T.bodyCallout(
        slide,
        "🎯 SOP 3 步:先 4 通用 → 再問模型獨特機制補專屬 → 最後驗證曲線。詳見決策卡 viz_framework_card.html。"
      );
    },
  },
  page, TOTAL
);

// ============================================================================
// 8. AI 鷹架 #1 (p.8)
// ============================================================================
page = 8;
T.addVoteSlide(
  pres,
  {
    title: "AI 鷹架 #1:用「通用 vs 專屬」框架建診斷清單",
    prompt: "個人實作 8-10 分鐘 → 上傳 TronClass「W15 AI 鷹架 #1」隨堂回應欄",
    options: [
      { key: "1", label: "通用層", desc: "Prompt #1 — 4 通用圖的故障徵兆 + KNN/SVM 為何要用 permutation_importance" },
      { key: "2", label: "專屬層", desc: "Prompt #2 — 三選一(樹/邊界/間隔)補 1~2 張 + 驗證曲線" },
      { key: "3", label: "收斂", desc: "Prompt #3 — 整理成「4 通用 + 1~2 專屬 + 1 驗證」清單" },
    ],
    inputHint: "全程開放 ChatGPT / Gemini / Claude / Copilot",
    afterAction: "Allen 走動巡視,3 分鐘抽 1 位簡述自己的『通用 vs 專屬』分類",
  },
  page, TOTAL
);

// ============================================================================
// 9. 第二堂章節分隔 (p.9)
// ============================================================================
page = 9;
T.addSectionDivider(
  pres,
  {
    sectionMark: "§2",
    title: "第二堂:sklearn + matplotlib/seaborn 雙軌實作",
    subtitle: "用 breast_cancer 練「四個必畫」",
    timeRange: "50 分鐘 ｜ 雙軌實作 35 + 收尾小考 15",
  },
  page, TOTAL
);

// ============================================================================
// 10. 軌道 A:matplotlib/seaborn (p.10)
// ============================================================================
page = 10;
T.addContentSlide(
  pres,
  {
    title: "軌道 A:matplotlib + seaborn 四個必畫",
    subtitle: "對應 W15_demo_visualization_cells.py 的 Cell 1-4",
    body: (slide) => {
      T.bodyTable(slide, [
        ["Cell", "內容", "關鍵 sklearn API"],
        ["Cell 1", "資料分佈圖(pairplot 4 特徵)", "load_breast_cancer, sns.pairplot"],
        ["Cell 2", "特徵相關熱圖(Top 10 features)", "df.corr(), sns.heatmap"],
        ["Cell 3", "混淆矩陣(KNN k=5)", "ConfusionMatrixDisplay.from_predictions"],
        ["Cell 4", "特徵重要性(決策樹)", "DecisionTreeClassifier, .feature_importances_"],
      ], {
        y: 1.5,
        colW: [1.5, 5.5, 4.9],
        rowH: 0.65,
        fontSize: 15,
      });
      T.bodyCallout(
        slide,
        "配色用 #E76F51 (burnt sienna) + #2A9D8F (persian green)——和整堂課視覺一致。"
      );
    },
  },
  page, TOTAL
);

// ============================================================================
// 11-14. 課堂示範圖庫:四個必畫 (p.11-14)
// ============================================================================
page = 11;
addDemoSlide(pres, {
  title: "Demo #1 — 必畫 #1:資料分佈 (pairplot)",
  subtitle: "良性 vs 惡性 在 4 個關鍵特徵上的分離度",
  imgPath: IMG.pairplot,
  observation:
    "• 良性(綠)與惡性(橘紅)在 mean radius 與 mean area 兩個特徵上幾乎可線性切開——這資料有救。\n\n" +
    "• 對角線的 histogram 顯示惡性樣本的 radius / area 中位數明顯大於良性。\n\n" +
    "• 雙峰分佈的特徵就是『模型能學會』的訊號。",
  askYourself: "如果這兩類完全重疊,KNN 還能用嗎?",
}, page, TOTAL);

page = 12;
addDemoSlide(pres, {
  title: "Demo #2 — 必畫 #2:特徵相關熱圖",
  subtitle: "看到一片紅就是共線性災難",
  imgPath: IMG.heatmap,
  observation:
    "• radius / perimeter / area 三者深紅一片 = 高度共線性(都在描述「腫瘤大小」)。\n\n" +
    "• SVM 與線性回歸對共線性極敏感——係數會爆炸。\n\n" +
    "• KNN 比較不怕,但會讓某些『其實是同一件事』的特徵被重複加權。",
  askYourself: "共線性高的特徵要全留嗎?",
}, page, TOTAL);

page = 13;
addDemoSlide(pres, {
  title: "Demo #3 — 必畫 #3:混淆矩陣 (KNN k=5, 惡性為 positive)",
  subtitle: "acc=0.959, recall(惡性)=0.891 — 漏判 7 個惡性",
  imgPath: IMG.confmat,
  observation:
    "• FN=7 (漏判 7 個惡性)、FP=0 (沒誤判健康人)。\n\n" +
    "• 在乳癌篩檢這是危險方向 — recall 只有 0.89, 不是「寧可錯殺一百」。\n\n" +
    "• 教訓:sklearn 預設 pos_label=1, 算的是 benign 的 recall=1.000。\n  必須改用 pos_label=0 才能看到醫學上有意義的 recall。\n\n" +
    "• 講師自身錯誤示範:這是好教材, 提醒你「先看資料再寫敘事」。",
  askYourself: "你以前寫過的混淆矩陣, 有指定過 pos_label 嗎?",
}, page, TOTAL);

page = 14;
addDemoSlide(pres, {
  title: "Demo #4 — 必畫 #4:特徵重要性 (決策樹)",
  subtitle: "模型靠這些特徵做決策",
  imgPath: IMG.featimp,
  observation:
    "• worst radius / worst concave points 兩個就吃掉一大半重要性。\n\n" +
    "• 其他 28 個特徵的貢獻邊際遞減 — 帕雷托法則在 ML 也成立。\n\n" +
    "• 這張圖是給『沒寫過程式的廠長』看的最佳武器:\n" +
    "  『模型告訴我們,只要盯著這兩個指標就夠了。』",
  askYourself: "頂多 3 個特徵的決策樹,效果會差很多嗎?",
}, page, TOTAL);

// ============================================================================
// 15. AI 鷹架 #2 (p.15)
// ============================================================================
page = 15;
T.addVoteSlide(
  pres,
  {
    title: "AI 鷹架 #2:圖表選型 + 程式碼產出",
    prompt: "個人實作 10 分鐘 → 上傳 TronClass「W15 AI 鷹架 #2」隨堂回應欄",
    options: [
      { key: "1", label: "選型", desc: "請 AI 為 3 件事各推薦一張圖" },
      { key: "2", label: "產碼", desc: "請 AI 寫 matplotlib + seaborn 程式" },
      { key: "3", label: "彙整 + 截圖", desc: "100 字彙整 + 3 張圖截圖上傳" },
    ],
    inputHint: "AI 工具不限,配色一定要用 #E76F51 / #2A9D8F",
    afterAction: "Allen 抽 2 位讓 AI 跑的圖投影出來即時點評",
  },
  page, TOTAL
);

// ============================================================================
// 16. 即時小考 (p.12)
// ============================================================================
page = 16;
T.addContentSlide(
  pres,
  {
    title: "即時小考:FN 比 FP 多 5 倍,你會怎麼做?",
    subtitle: "情境:乳癌診斷模型",
    body: (slide) => {
      T.bodyBullets(slide, [
        { text: "A. 提高 K 值", color: T.PALETTE.textDark },
        { text: "B. 調整決策閾值降低陽性門檻", color: T.PALETTE.primary, bold: true },
        { text: "C. 重新蒐集資料", color: T.PALETTE.textDark },
        { text: "D. 把 accuracy 印大一點", color: T.PALETTE.textDark },
      ]);
      T.bodyCallout(
        slide,
        "正解:B。漏掉惡性(FN)成本遠高於誤判健康(FP)。",
        "先問視覺化能不能讓你不用重收集——這才是分析師的眼光。"
      );
    },
  },
  page, TOTAL
);

// ============================================================================
// 17. 第三堂章節分隔 (p.13)
// ============================================================================
page = 17;
T.addSectionDivider(
  pres,
  {
    sectionMark: "§3",
    title: "第三堂:FT Vocabulary 套用 + SCQA 起手式",
    subtitle: "從圖表選型,到故事張力",
    timeRange: "50 分鐘 ｜ 概念 15 + 壞圖診所 20 + 期末考預告 15",
  },
  page, TOTAL
);

// ============================================================================
// 18. SCQA × 見識謀斷 對應 ML 報告 (p.14)
// ============================================================================
page = 18;
T.addContentSlide(
  pres,
  {
    title: "SCQA × 見識謀斷 對應到 ML 報告",
    subtitle: "FT 給你字典,SCQA 給你句法",
    body: (slide) => {
      T.bodyTable(slide, [
        ["SCQA", "見識謀斷", "ML 報告階段", "推薦圖表"],
        ["S 情境", "見", "「我們有什麼資料?」", "Bar / KPI Card"],
        ["C 衝突", "識", "「資料不平衡 / 模型偏誤」", "Bullet / Heatmap"],
        ["Q 問題", "識", "「為什麼 recall 這麼低?」", "(敘事文字)"],
        ["A 答案", "謀+斷", "「為什麼選這個模型?」", "Slope / Radar"],
      ], {
        y: 1.5,
        colW: [2.2, 2.5, 4.5, 2.7],
        rowH: 0.7,
        fontSize: 15,
      });
    },
  },
  page, TOTAL
);

// ============================================================================
// 19. 三層敘事的紀律 (p.15)
// ============================================================================
page = 19;
T.addContentSlide(
  pres,
  {
    title: "每張圖三層字:標題、圖、註記",
    subtitle: "三層都要寫齊,這個圖才完整",
    body: (slide) => {
      T.bodyTwoCol(slide,
        {
          title: "❌ 壞範例",
          body:
            "標題:模型表現\n" +
            "圖:混淆矩陣\n" +
            "註記:(無)\n\n" +
            "讀者看完沒結論,要自己看數字推敲。"
        },
        {
          title: "✅ 好範例",
          body:
            "標題:KNN 在惡性類別漏判 18%,建議調整決策閾值\n" +
            "圖:混淆矩陣(FN 那格用紅色強調)\n" +
            "註記:測試集 171 筆;k=5;StandardScaler 預處理"
        }
      );
    },
  },
  page, TOTAL
);

// ============================================================================
// 20. 首頁圖七原則 (p.16)
// ============================================================================
page = 20;
T.addContentSlide(
  pres,
  {
    title: "首頁圖 (Hero Chart) 設計七原則",
    subtitle: "12 頁報告主管看 1 張——這張佔總分 20%",
    body: (slide) => {
      T.bodyBullets(slide, [
        "1. 一張圖回答一個問題 — 不要塞多個故事",
        "2. 結論式標題 — 標題就是結論",
        "3. 顏色語意一致 — 紅色代表壞、綠色代表好",
        "4. 去除 chartjunk — 沒有 3D、沒有陰影、沒有過多格線",
        "5. 標出關鍵點 — 用箭頭/註解直接標",
        "6. 比較對象明確 — 沒有比較對象的圖等於沒結論",
        "7. 資料來源在右下 — 註明資料筆數、切分方法、隨機種子",
      ], { fontSize: 17 });
    },
  },
  page, TOTAL
);

// ============================================================================
// 21. AI 鷹架 #3 (p.17)
// ============================================================================
page = 21;
T.addVoteSlide(
  pres,
  {
    title: "AI 鷹架 #3:壞圖診斷與重設計",
    prompt: "抽 1 張壞 ML 圖編號 → 個人實作 20 分鐘 → 上傳 TronClass「W15 AI 鷹架 #3」",
    options: [
      { key: "1", label: "診斷", desc: "找出 3 個拖慢決策速度的缺陷" },
      { key: "2", label: "重設計", desc: "請 AI 給結論式標題與程式骨架" },
      { key: "3", label: "彙整 + 上傳", desc: "100 字彙整 + AI 建議標題上傳" },
    ],
    inputHint: "Allen 投影抽 2-3 位的回應即時點評",
    afterAction: "Allen 點評後留 3 分鐘讓你修改自己的版本",
  },
  page, TOTAL
);

// ============================================================================
// 22. 期末考預告 (p.22)
// ============================================================================
page = 22;
T.addContentSlide(
  pres,
  {
    title: "W18 期末考預告",
    subtitle: "今天先講大方向,W17 第二堂公布題本與資料集",
    body: (slide) => {
      T.bodyBullets(slide, [
        { text: "形式:個人實作 + AI 全面開放協作", bold: true, color: T.PALETTE.primary },
        { text: "  不分組、不可互相討論、不抽問", indent: 1, color: T.PALETTE.textMuted },
        { text: "時長:W18 上午,共 130 分鐘(實作主體 95 分鐘)", bold: true, color: T.PALETTE.primary },
        { text: "繳交:3 個檔案(缺一當題零分)", bold: true, color: T.PALETTE.primary },
        { text: "  ① Notebook (.ipynb)", indent: 1 },
        { text: "  ② 首頁圖 (.png)", indent: 1 },
        { text: "  ③ 簡報 (.pdf / .pptx,版型自由)", indent: 1 },
        { text: "評分:技術 25%、視覺敘事 75%", bold: true, color: T.PALETTE.primary },
        { text: "  ←—這個比例不是要你忽略技術,是因為大家技術都差不多", indent: 1, color: T.PALETTE.textMuted },
      ]);
    },
  },
  page, TOTAL
);

// ============================================================================
// 23. 學習重點 (p.23)
// ============================================================================
page = 23;
T.addContentSlide(
  pres,
  {
    title: "🎓 W15 學習重點與實踐建議",
    subtitle: "SCQA 三件事,帶回去就行",
    body: (slide) => {
      T.bodyBullets(slide, [
        { text: "視覺編碼直覺 (S, Discover 見)", bold: true, color: T.PALETTE.primary },
        { text: "  通道有等級:位置 > 長度 > 顏色;重要訊號用位置,類別用色相", indent: 1 },
        { text: "「四個必畫」紀律 (C, Define 識)", bold: true, color: T.PALETTE.primary },
        { text: "  資料分佈、特徵相關熱圖、混淆矩陣、特徵重要性—少一張要說明", indent: 1 },
        { text: "AI 鷹架三段式 (A, Decide 斷)", bold: true, color: T.PALETTE.primary },
        { text: "  拆解 → 產碼 → 彙整。每次結束貼「請彙整以上互動討論,提供 100 字內的重點彙整」", indent: 1 },
      ]);
    },
  },
  page, TOTAL
);

// ============================================================================
// 24. Allen 隨堂叮嚀 (p.24)
// ============================================================================
page = 24;
T.addContentSlide(
  pres,
  {
    title: "📝 Allen 老師隨堂叮嚀",
    body: (slide) => {
      slide.addText(
        "機器學習教你怎麼讓 accuracy 變高,\n" +
        "視覺化教你怎麼讓決策者「相信」這個 accuracy。\n\n" +
        "前者是科學家的工作,後者是工程師的工作。\n" +
        "智工系畢業之後,你會花 30% 時間訓練模型,\n" +
        "70% 時間說服別人這個模型。\n\n" +
        "這 70%,從這 3 週開始練。",
        {
          x: 0.7, y: 1.7, w: 11.9, h: 5.0,
          fontSize: 22, fontFace: T.FONT.primary, italic: true,
          color: T.PALETTE.textDark, align: "left", valign: "middle",
          paraSpaceAfter: 10,
        }
      );
    },
  },
  page, TOTAL
);

// ============================================================================
// 25. 下週預告 (p.25)
// ============================================================================
page = 25;
T.addContentSlide(
  pres,
  {
    title: "下週預告:W16 維度模型",
    subtitle: "解決「特徵 30 個以上時,圖表怎麼畫?」",
    body: (slide) => {
      T.bodyBullets(slide, [
        { text: "PCA / t-SNE 降維:把 64 維 digits 投影到 2D", color: T.PALETTE.primary, bold: true },
        { text: "Facet 小型多重圖:多個模型/類別 並排比較", color: T.PALETTE.primary, bold: true },
        { text: "長寬資料 melt / pivot:seaborn 多類別圖的鑰匙", color: T.PALETTE.primary, bold: true },
        { text: "雷達圖 + 平行座標:多模型多指標 同框比較", color: T.PALETTE.primary, bold: true },
        { text: "" },
        { text: "預習提示", color: T.PALETTE.secondary, bold: true },
        { text: "  下週會用到 sklearn.decomposition.PCA 與 sklearn.manifold.TSNE", indent: 1, color: T.PALETTE.textMuted },
        { text: "  可以先用 load_digits() 跑跑看", indent: 1, color: T.PALETTE.textMuted },
      ]);
    },
  },
  page, TOTAL
);

// ============================================================================
// 26. 課堂資源 (p.26)
// ============================================================================
page = 26;
T.addContentSlide(
  pres,
  {
    title: "📚 W15 課堂資源",
    subtitle: "全部放在 TronClass 與 GitHub repo",
    body: (slide) => {
      T.bodyTable(slide, [
        ["資源", "位置", "用途"],
        ["W15 講義 (PDF)", "TronClass W15 公告", "課後複習"],
        ["W15 簡報 (PPTX)", "TronClass W15 公告", "本份簡報"],
        ["W15_demo_visualization_cells.py", "GitHub repo", "VS Code 跑示範"],
        ["FT Visual Vocabulary 海報", "教室後牆 + QR Code", "選圖時對照"],
        ["AI 鷹架 #1/#2/#3 上傳欄", "TronClass W15", "本週 3 個實作產出"],
      ], {
        y: 1.5,
        colW: [4.5, 4.0, 3.4],
        rowH: 0.7,
        fontSize: 14,
      });
    },
  },
  page, TOTAL
);

// ============================================================================
// 27. Q&A (p.27)
// ============================================================================
page = 27;
T.addContentSlide(
  pres,
  {
    title: "Q&A",
    subtitle: "三週後見 → W18 期末考",
    body: (slide) => {
      slide.addText("有問題?", {
        x: 0.7, y: 2.0, w: 11.9, h: 1.0,
        fontSize: 60, fontFace: T.FONT.primary, bold: true,
        color: T.PALETTE.primary, align: "center", valign: "middle",
      });
      slide.addText("(可以舉手,也可以下課後私下問)", {
        x: 0.7, y: 3.5, w: 11.9, h: 0.6,
        fontSize: 18, fontFace: T.FONT.primary, italic: true,
        color: T.PALETTE.textMuted, align: "center",
      });
    },
  },
  page, TOTAL
);

// ============================================================================
// 28. Thank you (p.28)
// ============================================================================
const finalSlide = pres.addSlide();
finalSlide.background = { color: T.PALETTE.bgDark };
finalSlide.addShape("rect", {
  x: 0, y: 0, w: 13.333, h: 0.4,
  fill: { color: T.PALETTE.primary }, line: { color: T.PALETTE.primary },
});
finalSlide.addShape("rect", {
  x: 0, y: 7.1, w: 13.333, h: 0.4,
  fill: { color: T.PALETTE.accent }, line: { color: T.PALETTE.accent },
});
finalSlide.addText("Thank you", {
  x: 0.7, y: 2.5, w: 12, h: 1.5,
  fontSize: 72, fontFace: T.FONT.primary, bold: true,
  color: T.PALETTE.textWhite, align: "center", valign: "middle",
});
finalSlide.addText("下週見 — W16 維度模型", {
  x: 0.7, y: 4.3, w: 12, h: 0.6,
  fontSize: 24, fontFace: T.FONT.primary, italic: true,
  color: T.PALETTE.textGold, align: "center",
});

// ============================================================================
// 輸出
// ============================================================================
pres.writeFile({ fileName: OUT_FILE }).then(() => {
  console.log(`✅ 完成: ${OUT_FILE}`);
  if (!DEMO_READY) {
    console.log("   (示範圖頁顯示空白佔位, 請執行 demo 後重跑)");
  }
});
