// W17_build_pptx.js — W17 數據敘事 + 期末考準備 簡報生成器
//
// 執行: node W17_build_pptx.js
// 產出: output/W17_slides.pptx

const pptxgen = require("pptxgenjs");
const path = require("path");
const fs = require("fs");
const T = require("./templates/pptx_template.js");

const OUT_DIR = path.join(__dirname, "output");
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
const OUT_FILE = path.join(OUT_DIR, "W17_slides.pptx");

const DEMO_DIR = path.join(OUT_DIR, "W17_demo");
const IMG = {
  title:     path.join(DEMO_DIR, "01_title_good_vs_bad.png"),
  hero:      path.join(DEMO_DIR, "02_hero_chart_example.png"),
  threshold: path.join(DEMO_DIR, "03_threshold_adjustment.png"),
  preview:   path.join(DEMO_DIR, "04_w18_exam_preview.png"),
};

function addDemoSlide(pres, opts, pageNum, totalPages) {
  const slide = pres.addSlide();
  slide.background = { color: T.PALETTE.bgWhite };
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
  if (opts.imgPath && fs.existsSync(opts.imgPath)) {
    slide.addImage({
      path: opts.imgPath,
      x: 0.5, y: 1.6, w: 7.2, h: 5.2,
      sizing: { type: "contain", w: 7.2, h: 5.2 },
    });
  } else {
    slide.addShape("rect", {
      x: 0.5, y: 1.6, w: 7.2, h: 5.2,
      fill: { color: T.PALETTE.bgSoft }, line: { color: T.PALETTE.border, width: 1 },
    });
  }
  slide.addShape("rect", {
    x: 8.0, y: 1.6, w: 4.83, h: 5.2,
    fill: { color: T.PALETTE.bgSoft }, line: { color: T.PALETTE.border, width: 0.5 },
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
    color: T.PALETTE.textDark, align: "left", valign: "top", paraSpaceAfter: 6,
  });
  if (opts.askYourself) {
    slide.addShape("rect", {
      x: 8.0, y: 5.95, w: 4.83, h: 0.85,
      fill: { color: T.PALETTE.bgPrimaryLight }, line: { color: T.PALETTE.primary, width: 0 },
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
pres.defineLayout({ name: T.LAYOUT.name, width: T.LAYOUT.width, height: T.LAYOUT.height });

const TOTAL = 26;
let page = 0;

// p.1 封面
T.addCoverSlide(pres, {
  dayTag: "W17 ｜ 數據敘事",
  unitTitle: "把圖串成讓主管下決定的故事",
  unitSubtitle: "SCQA × 見識謀斷 + W18 期末考準備",
  dateTimeStr: "W17 第 1-3 堂 ｜ 下週 W18 期末考",
});

// p.2 本週目標
page = 2;
T.addContentSlide(pres, {
  title: "W17 學完三件事",
  subtitle: "敘事 + 首頁圖 + 期末考完整準備",
  body: (slide) => {
    T.bodyBullets(slide, [
      { text: "SCQA × 見識謀斷 對應到 ML 報告", bold: true, color: T.PALETTE.primary },
      { text: "  S 情境 / C 衝突 / Q 問題 / A 答案 → 圖表選型對照", indent: 1, color: T.PALETTE.textMuted },
      { text: "三層敘事節奏:標題、圖、註記", bold: true, color: T.PALETTE.primary },
      { text: "  「混淆矩陣」是 figure caption;「KNN 漏判 18% 惡性」才是結論式標題", indent: 1, color: T.PALETTE.textMuted },
      { text: "首頁圖 (Hero Chart) 設計七原則", bold: true, color: T.PALETTE.primary },
      { text: "  期末考 S2 維度 20% 全在這 7 點", indent: 1, color: T.PALETTE.textMuted },
      { text: "W18 期末考 EDA 預習", bold: true, color: T.PALETTE.primary },
      { text: "  用 AI 鷹架在課堂內完成考前小抄", indent: 1, color: T.PALETTE.textMuted },
    ]);
  },
}, page, TOTAL);

// p.3 §1
page = 3;
T.addSectionDivider(pres, {
  sectionMark: "§1",
  title: "第一堂:SCQA × 見識謀斷",
  subtitle: "理工科系學生對「說故事」會抗拒——但沒有它, ML 報告主管讀不懂",
  timeRange: "50 分鐘 ｜ 費米 10 + 概念 30 + 收尾 10",
}, page, TOTAL);

// p.4 費米
page = 4;
T.addContentSlide(pres, {
  title: "[費米 Q] 12 頁報告, 主管 30 秒讀多少?",
  subtitle: "答案決定你 90% 心力該放在哪",
  body: (slide) => {
    T.bodyTable(slide, [
      ["Step", "思考", "估算"],
      ["見", "30 秒能看幾張圖?", "平均 3-5 張"],
      ["見", "12 頁含多少圖?", "通常 10-15 張"],
      ["識", "主管看的順序", "首頁圖 → 結論 → 反推細節"],
      ["識", "首頁圖沒抓眼球?", "後面 11 頁 = 廢紙"],
      ["謀", "把 90% 心力放在 1 張首頁圖", ""],
      ["斷", "期末考的首頁圖佔 20% 分數", ""],
    ], { y: 1.5, colW: [1.2, 6.5, 4.2], rowH: 0.55, headerFontSize: 16, fontSize: 14 });
  },
}, page, TOTAL);

// p.5 SCQA × 見識謀斷
page = 5;
T.addContentSlide(pres, {
  title: "SCQA × 見識謀斷 對應 ML 報告",
  subtitle: "西方顧問業 × 東方決策科學 的雙重架構",
  body: (slide) => {
    T.bodyTable(slide, [
      ["SCQA", "見識謀斷", "ML 報告章節", "圖表類型"],
      ["S 情境", "見", "我們有什麼資料?", "KPI 卡、資料規模 bar"],
      ["C 衝突", "識", "資料不平衡 / 模型偏誤", "Heatmap、Bullet"],
      ["Q 問題", "識", "為什麼 recall 這麼低?", "(敘事文字)"],
      ["A 謀", "謀", "比較了哪些模型?", "Slope、Radar"],
      ["A 斷", "斷", "為什麼選這個模型?", "模型卡 + Conf + Importance"],
    ], { y: 1.5, colW: [1.6, 1.6, 4.5, 4.2], rowH: 0.55, fontSize: 13 });
  },
}, page, TOTAL);

// p.6 三層敘事
page = 6;
T.addContentSlide(pres, {
  title: "三層敘事:標題、圖、註記",
  subtitle: "三層都要寫齊, 這個圖才完整",
  body: (slide) => {
    T.bodyTwoCol(slide,
      { title: "❌ 壞範例", body:
        "標題:模型表現\n" +
        "圖:混淆矩陣\n" +
        "註記:(無)\n\n" +
        "讀者看完沒結論, 要自己看數字推敲。" },
      { title: "✅ 好範例", body:
        "標題:KNN 漏判 18% 惡性, 建議調整閾值\n" +
        "圖:混淆矩陣(FN 那格紅色強調)\n" +
        "註記:n=171, k=5, StandardScaler" }
    );
  },
}, page, TOTAL);

// p.7 首頁圖七原則
page = 7;
T.addContentSlide(pres, {
  title: "首頁圖 (Hero Chart) 七原則",
  subtitle: "期末考 S2 維度 20% 全在這 7 點",
  body: (slide) => {
    T.bodyBullets(slide, [
      "1. 一張圖回答一個問題 — 不要塞多個故事",
      "2. 結論式標題 — 標題就是結論",
      "3. 顏色語意一致 — 紅=壞、綠=好",
      "4. 去除 chartjunk — 無 3D、無陰影、無過多格線",
      "5. 標出關鍵點 — 用箭頭/註解直接標",
      "6. 比較對象明確 — 沒比較對象 = 沒結論",
      "7. 資料來源在右下 — n / split / 隨機種子",
    ], { fontSize: 17 });
  },
}, page, TOTAL);

// p.8 AI 鷹架 #1
page = 8;
T.addVoteSlide(pres, {
  title: "AI 鷹架 #1:SCQA 敘事自動生成",
  prompt: "個人實作 10 分鐘 → 上傳 TronClass「W17 AI 鷹架 #1」",
  options: [
    { key: "1", label: "重寫 S", desc: "把情境段落改成 10 秒能讀完的開場" },
    { key: "2", label: "強化 C", desc: "把衝突點轉成結論式標題 + 三層敘事" },
    { key: "3", label: "彙整", desc: "100 字 + 結論式標題上傳" },
  ],
  inputHint: "全程開放 AI 工具 → 風格要像給廠長看的決策建議書",
  afterAction: "Allen 投影抽 2 位, 比較哪個版本最有『下決定的力道』",
}, page, TOTAL);

// p.9 §2
page = 9;
T.addSectionDivider(pres, {
  sectionMark: "§2",
  title: "第二堂:評分標準 + 資料集公布",
  subtitle: "把規則講清楚, 下週上機就照做",
  timeRange: "50 分鐘 ｜ AI 鷹架 #2 15 + 評分 20 + 資料集 15",
}, page, TOTAL);

// p.10-13 課堂示範圖庫
page = 10;
addDemoSlide(pres, {
  title: "Demo #1 — 結論式 vs 描述式標題",
  subtitle: "True→X 軸、Predicted→Y 軸 ｜ 同一張混淆矩陣, 兩種標題, 訊息完全不同",
  imgPath: IMG.title,
  observation:
    "• 左邊「模型表現」要讀者自己推結論。\n\n" +
    "• 右邊「漏判 7 個惡性、誤判 0 個健康人」直接給答案。\n\n" +
    "• 標題不是 figure caption, 是結論。\n\n" +
    "• 期末考 K2 + S2 維度都看這個。\n\n" +
    "• 同時複習 W15 教訓:pos_label=0 才是醫學 recall。",
  askYourself: "你 W15/W16 畫的圖, 標題是 caption 還是結論?",
}, page, TOTAL);

page = 11;
addDemoSlide(pres, {
  title: "Demo #2 — 完整首頁圖 (七原則齊全)",
  subtitle: "結論式標題 + annotation + 來源右下 + 比較對象",
  imgPath: IMG.hero,
  observation:
    "• 標題兩行式:結論 + 建議行動。\n\n" +
    "• 用顏色區分達標/未達標, 不靠標籤。\n\n" +
    "• annotation 直接標出關鍵轉折點。\n\n" +
    "• 右下角 metadata: n / seed / 月份。",
  askYourself: "如果只有一句話跟廠長講, 你會怎麼說?",
}, page, TOTAL);

page = 12;
addDemoSlide(pres, {
  title: "Demo #3 — 決策閾值調整 SCQA",
  subtitle: "不用重訓模型, 動 threshold 就能換取捨",
  imgPath: IMG.threshold,
  observation:
    "• 同一個 KNN, 不同 threshold 給你不同 recall/precision。\n\n" +
    "• 這就是 SCQA 「C衝突 → A答案」的視覺化:\n" +
    "  - C 衝突:預設 0.5 不夠安全\n" +
    "  - A 答案:降到 0.30 換 recall=0.99\n\n" +
    "• 工程思維:先動旋鈕, 不要急著重訓。",
  askYourself: "你訓練好的模型, 還有哪些「旋鈕」沒動過?",
}, page, TOTAL);

page = 13;
addDemoSlide(pres, {
  title: "Demo #4 — W18 期末考資料集 EDA 預覽",
  subtitle: "SMT 焊接良率 3,547 筆 × 18 欄",
  imgPath: IMG.preview,
  observation:
    "• 類別 62:38 — 輕度不平衡, 不要被高 accuracy 騙。\n\n" +
    "• 溫區 3 是達標關鍵閾值(245°C 上下)。\n\n" +
    "• 前批不良率有明顯區隔 — 歷史會說故事。\n\n" +
    "• 期末考要做的 EDA, 大約就是這 4 張的進階版。",
  askYourself: "看到這份預覽, 你的 SCQA 大綱大概會怎麼寫?",
}, page, TOTAL);

// p.14 期末考評分總表
page = 14;
T.addContentSlide(pres, {
  title: "期末考評分總表 (技術 25% + 視覺敘事 75%)",
  subtitle: "勝負在敘事, 不是 sklearn",
  body: (slide) => {
    T.bodyTable(slide, [
      ["維度", "權重", "A 等級條件"],
      ["K1 技術正確", "25%", "程式無誤、模型訓練合理、評估指標完整"],
      ["K2 視覺編碼", "20%", "FT Vocabulary 用對、配色一致、無 chartjunk"],
      ["S1 四個必畫", "15%", "4 張齊全 + 每張都有結論式標題"],
      ["S2 首頁圖", "20%", "七原則全達 + 結論式標題"],
      ["A 敘事 SCQA", "20%", "四階段齊全 + 簡報結構一致"],
    ], { y: 1.5, colW: [2.5, 1.5, 7.9], rowH: 0.7, fontSize: 15 });
  },
}, page, TOTAL);

// p.15 評分迷思澄清
page = 15;
T.addContentSlide(pres, {
  title: "評分迷思澄清",
  subtitle: "你會問的 4 個問題",
  body: (slide) => {
    T.bodyBullets(slide, [
      { text: "Q:可以用 GPT 寫程式嗎? → A:可以, 全面開放 AI 協作", color: T.PALETTE.textDark },
      { text: "Q:有沒有抽問? → A:沒有, 直接以繳交檔案評分", color: T.PALETTE.primary, bold: true },
      { text: "Q:我不寫敘事可以嗎? → A:可以拿 25 分(技術那 1/4)", color: T.PALETTE.textDark },
      { text: "Q:圖表很醜會扣多少? → A:「醜」不扣, 「亂」扣", color: T.PALETTE.textDark },
      { text: "  亂 = 標籤重疊、軸沒名稱、配色刺眼", indent: 1, color: T.PALETTE.textMuted },
    ]);
  },
}, page, TOTAL);

// p.16 AI 鷹架 #2
page = 16;
T.addVoteSlide(pres, {
  title: "AI 鷹架 #2:圖表自評 + 首頁圖七原則檢核",
  prompt: "個人實作 15 分鐘 → 上傳 TronClass「W17 AI 鷹架 #2」",
  options: [
    { key: "1", label: "三層自評", desc: "請 AI 對你的圖逐層打分(0-10)" },
    { key: "2", label: "七原則檢核", desc: "✅/❌ 清單 + 估計 S2 分數" },
    { key: "3", label: "彙整上傳", desc: "圖截圖 + 七原則清單 + 100 字" },
  ],
  inputHint: "拿出你 W15/W16 的 AI 鷹架產出 → 對著 AI 自評",
  afterAction: "Allen 投影抽 2-3 位的回應即時點評",
}, page, TOTAL);

// p.17 §3
page = 17;
T.addSectionDivider(pres, {
  sectionMark: "§3",
  title: "第三堂:W18 期末考 EDA 預習",
  subtitle: "考前小抄 = 課堂 AI 鷹架的彙整",
  timeRange: "50 分鐘 ｜ 流程預告 10 + AI 鷹架 #3 25 + Q&A 15",
}, page, TOTAL);

// p.18 期末考流程
page = 18;
T.addContentSlide(pres, {
  title: "W18 期末考流程",
  subtitle: "130 分鐘 = 環境 15 + 實作 95 + 校驗 20",
  body: (slide) => {
    T.bodyTable(slide, [
      ["時段", "動作", "時間"],
      ["09:10 - 09:25", "環境檢查 + 領題 + 讀資料卡", "15 min"],
      ["09:25 - 11:00", "實作主體:EDA → 訓練 → 視覺化 → 敘事 → 簡報 → 上傳", "95 min"],
      ["11:00 - 11:20", "收卷 + TA 校驗檔案完整性(不抽問)", "20 min"],
    ], { y: 1.5, colW: [2.8, 7.6, 1.5], rowH: 0.8, fontSize: 14 });
    T.bodyCallout(slide,
      "繳交 3 個檔案缺一當題零分:.ipynb + .png + 簡報",
      "AI 工具全程開放, 沒有抽問, 直接以成品評分");
  },
}, page, TOTAL);

// p.19 資料集卡片
page = 19;
T.addContentSlide(pres, {
  title: "W18 期末考資料集",
  subtitle: "smt_yield_dataset_W18.csv",
  body: (slide) => {
    T.bodyBullets(slide, [
      { text: "情境:某 PCB 廠 SMT 焊接產線良率預測", bold: true, color: T.PALETTE.primary },
      { text: "規模:3,547 筆 × 18 欄", bold: true, color: T.PALETTE.primary },
      { text: "目標欄位:target_met (1=達標 ≥98.5%, 0=未達標)", bold: true, color: T.PALETTE.primary },
      { text: "類別分佈:62:38 — 輕度不平衡", bold: true, color: T.PALETTE.primary },
      { text: "關鍵特徵:reflow_zone3_temp / prev_batch_defect_rate / shift / supplier", indent: 1, color: T.PALETTE.textMuted },
      { text: "" },
      { text: "📄 完整題本:final_exam_practical_brief.md", color: T.PALETTE.secondary, bold: true },
      { text: "📄 文件範本:final_exam_template.md (Notebook + 簡報範本)", color: T.PALETTE.secondary, bold: true },
    ]);
  },
}, page, TOTAL);

// p.20 AI 鷹架 #3
page = 20;
T.addVoteSlide(pres, {
  title: "AI 鷹架 #3:期末考資料集 EDA 預習",
  prompt: "個人實作 15 分鐘 → 上傳 TronClass「W17 AI 鷹架 #3」",
  options: [
    { key: "1", label: "風險掃描", desc: "資料卡 → 立刻看出 3 個風險" },
    { key: "2", label: "EDA 順序", desc: "規劃 15 分鐘必畫的 5 張圖" },
    { key: "3", label: "考前小抄", desc: "3 風險 + 5 張圖清單 + 100 字 上傳" },
  ],
  inputHint: "這份彙整就是你期末考的考前小抄",
  afterAction: "進場前再看一遍, 前 15 分鐘的 EDA 就不會慌亂",
}, page, TOTAL);

// p.21 學習重點
page = 21;
T.addContentSlide(pres, {
  title: "🎓 W17 學習重點與實踐建議",
  subtitle: "SCQA 三件事 — 帶進期末考",
  body: (slide) => {
    T.bodyBullets(slide, [
      { text: "敘事的「識」覺 (C, Define 識)", bold: true, color: T.PALETTE.primary },
      { text: "  報告無衝突 = 報告無價值。先問「哪裡跟預期不一樣」, 再寫", indent: 1 },
      { text: "三層敘事的紀律 (S, Skill 見)", bold: true, color: T.PALETTE.primary },
      { text: "  每張圖寫齊三層。沒寫齊就刪掉, 不要交殘缺的圖", indent: 1 },
      { text: "首頁圖的優先順序 (A, Decide 斷)", bold: true, color: T.PALETTE.primary },
      { text: "  12 頁報告主管看 1 張。首頁圖佔 20%, 但決定剩下 80% 的可信度", indent: 1 },
    ]);
  },
}, page, TOTAL);

// p.22 Allen 隨堂叮嚀
page = 22;
T.addContentSlide(pres, {
  title: "📝 Allen 老師隨堂叮嚀",
  body: (slide) => {
    slide.addText(
      "機器學習工程師有兩種:\n" +
      "會跑模型的, 跟會讓人相信模型的。\n\n" +
      "前者一抓一大把, 後者畢業就被搶。\n\n" +
      "這 3 週你要學的是第二種能力——\n" +
      "讓別人相信你跑的模型。\n\n" +
      "期末考不是考你 sklearn 多熟,\n" +
      "是考你能不能讓一個沒寫過程式的人,\n" +
      "看你的圖就做出決定。",
      {
        x: 0.7, y: 1.7, w: 11.9, h: 5.0,
        fontSize: 21, fontFace: T.FONT.primary, italic: true,
        color: T.PALETTE.textDark, align: "left", valign: "middle",
        paraSpaceAfter: 10,
      }
    );
  },
}, page, TOTAL);

// p.23 下週預告
page = 23;
T.addContentSlide(pres, {
  title: "下週 W18:期末考實作",
  subtitle: "三檔缺一當題零分",
  body: (slide) => {
    T.bodyBullets(slide, [
      { text: "形式:個人實作 + AI 全面開放協作", bold: true, color: T.PALETTE.primary },
      { text: "時間:09:10 - 11:20 (130 分鐘)", bold: true, color: T.PALETTE.primary },
      { text: "繳交三檔:", bold: true, color: T.PALETTE.primary },
      { text: "  ① 學號_姓名_W18Final.ipynb", indent: 1 },
      { text: "  ② 學號_姓名_W18Hero.png", indent: 1 },
      { text: "  ③ 學號_姓名_W18Slides.{pdf,pptx,key}", indent: 1 },
      { text: "" },
      { text: "考前必做:", color: T.PALETTE.secondary, bold: true },
      { text: "  1. 環境跑通 (sklearn / pandas / matplotlib / seaborn)", indent: 1, color: T.PALETTE.textMuted },
      { text: "  2. 模板貼上 Notebook 開頭 (final_exam_template.md)", indent: 1, color: T.PALETTE.textMuted },
      { text: "  3. AI 鷹架 #3 彙整列印帶進考場", indent: 1, color: T.PALETTE.textMuted },
    ]);
  },
}, page, TOTAL);

// p.24 課堂資源
page = 24;
T.addContentSlide(pres, {
  title: "📚 W17 課堂資源",
  body: (slide) => {
    T.bodyTable(slide, [
      ["資源", "位置", "用途"],
      ["W17 講義 (HTML)", "TronClass W17", "課後複習"],
      ["W17 簡報 (PPTX)", "TronClass W17", "本份簡報"],
      ["final_exam_practical_brief.md", "TronClass W17", "期末考完整題本"],
      ["final_exam_template.md", "TronClass W17", "Notebook + 簡報範本"],
      ["W17_demo_storytelling_cells.py", "GitHub repo", "本週示範程式"],
    ], { y: 1.5, colW: [4.8, 4.0, 3.1], rowH: 0.7, fontSize: 14 });
  },
}, page, TOTAL);

// p.25 Q&A
page = 25;
T.addContentSlide(pres, {
  title: "Q&A",
  subtitle: "下週見 → W18 期末考實作",
  body: (slide) => {
    slide.addText("有問題?", {
      x: 0.7, y: 2.0, w: 11.9, h: 1.0,
      fontSize: 60, fontFace: T.FONT.primary, bold: true,
      color: T.PALETTE.primary, align: "center", valign: "middle",
    });
    slide.addText("(這是最後機會問問題, 下週是考試)", {
      x: 0.7, y: 3.5, w: 11.9, h: 0.6,
      fontSize: 18, fontFace: T.FONT.primary, italic: true,
      color: T.PALETTE.textMuted, align: "center",
    });
  },
}, page, TOTAL);

// p.26 Thank you
const final = pres.addSlide();
final.background = { color: T.PALETTE.bgDark };
final.addShape("rect", { x: 0, y: 0, w: 13.333, h: 0.4, fill: { color: T.PALETTE.primary }, line: { color: T.PALETTE.primary } });
final.addShape("rect", { x: 0, y: 7.1, w: 13.333, h: 0.4, fill: { color: T.PALETTE.accent }, line: { color: T.PALETTE.accent } });
final.addText("祝期末考順利", {
  x: 0.7, y: 2.5, w: 12, h: 1.5,
  fontSize: 60, fontFace: T.FONT.primary, bold: true,
  color: T.PALETTE.textWhite, align: "center", valign: "middle",
});
final.addText("這 3 週的目的, 就是把「讓人相信模型」變成你的本能", {
  x: 0.7, y: 4.3, w: 12, h: 0.6,
  fontSize: 18, fontFace: T.FONT.primary, italic: true,
  color: T.PALETTE.textGold, align: "center",
});

pres.writeFile({ fileName: OUT_FILE }).then(() => {
  console.log(`✅ 完成: ${OUT_FILE}`);
});
