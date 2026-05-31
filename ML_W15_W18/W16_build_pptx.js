// W16_build_pptx.js — W16 維度模型 簡報生成器
//
// 執行: node W16_build_pptx.js
// 產出: output/W16_slides.pptx

const pptxgen = require("pptxgenjs");
const path = require("path");
const fs = require("fs");
const T = require("./templates/pptx_template.js");

const OUT_DIR = path.join(__dirname, "output");
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
const OUT_FILE = path.join(OUT_DIR, "W16_slides.pptx");

// W16 demo 圖
const DEMO_DIR = path.join(OUT_DIR, "W16_demo");
const IMG = {
  pca:        path.join(DEMO_DIR, "01_pca_digits.png"),
  pca_vs_tsne: path.join(DEMO_DIR, "02_pca_vs_tsne.png"),
  facet:      path.join(DEMO_DIR, "03_facet_confusion.png"),
  radar:      path.join(DEMO_DIR, "04_radar_models.png"),
};

// Demo 圖片簡報 helper (與 W15 共用版型)
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
      fill: { color: T.PALETTE.bgSoft },
      line: { color: T.PALETTE.border, width: 1 },
    });
    slide.addText("(請先執行 W16_demo_pca_tsne_cells.py)", {
      x: 0.5, y: 3.9, w: 7.2, h: 0.6,
      fontSize: 14, fontFace: T.FONT.primary, italic: true,
      color: T.PALETTE.textMuted, align: "center", valign: "middle",
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
    color: T.PALETTE.textDark, align: "left", valign: "top",
    paraSpaceAfter: 6,
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
  dayTag: "W16 ｜ 維度模型",
  unitTitle: "高維特徵的「降維說故事」",
  unitSubtitle: "PCA × t-SNE × Facet × 雷達圖",
  dateTimeStr: "W16 第 1-3 堂 ｜ 3 堂 × 50 分鐘",
});

// p.2 本週目標
page = 2;
T.addContentSlide(pres, {
  title: "W16 學完三件事",
  subtitle: "解決『特徵 30 個以上時, 圖表怎麼畫?』這個痛點",
  body: (slide) => {
    T.bodyBullets(slide, [
      { text: "降維投影:PCA / t-SNE / UMAP 三派", bold: true, color: T.PALETTE.primary },
      { text: "  PCA 保全局變異;t-SNE 保群聚但距離不可信;UMAP 保拓樸", indent: 1, color: T.PALETTE.textMuted },
      { text: "小型多重圖 (Small Multiples)", bold: true, color: T.PALETTE.primary },
      { text: "  Tufte:powerful underused technique。多模型用 facet 同 cmap 同 scale", indent: 1, color: T.PALETTE.textMuted },
      { text: "多軸協調圖", bold: true, color: T.PALETTE.primary },
      { text: "  平行座標 vs 雷達圖。多指標放一張圖看遍", indent: 1, color: T.PALETTE.textMuted },
      { text: "長寬資料 melt / pivot", bold: true, color: T.PALETTE.primary },
      { text: "  seaborn 多類別圖的鑰匙——這兩個動詞救你一輩子", indent: 1, color: T.PALETTE.textMuted },
    ]);
  },
}, page, TOTAL);

// p.3 §1 章節分隔
page = 3;
T.addSectionDivider(pres, {
  sectionMark: "§1",
  title: "第一堂:費米暖身與降維直覺",
  subtitle: "為什麼 50 維資料看 1,225 張散佈圖救不了你",
  timeRange: "50 分鐘 ｜ 費米 15 + 概念 25 + 收尾 10",
}, page, TOTAL);

// p.4 費米暖身
page = 4;
T.addContentSlide(pres, {
  title: "[費米 Q] 50 維資料兩兩散佈圖看完要多久?",
  subtitle: "在你打開 sns.pairplot 之前, 先建立對組合數的直覺",
  body: (slide) => {
    T.bodyTable(slide, [
      ["Step", "思考", "估算"],
      ["見", "兩兩組合幾種?", "C(50, 2) = 1,225"],
      ["見", "每張圖看 30 秒", "10 小時"],
      ["識", "三維互動呢?", "C(50, 3) = 19,600,沒救"],
      ["識", "解法是什麼?", "不是看更多圖, 是換投影方式"],
      ["謀", "PCA / t-SNE 壓成 2 維", "看 1 張圖"],
      ["斷", "取捨:壓縮會丟資訊, 但能看到全局結構", "接受不完美"],
    ], { y: 1.5, colW: [1.2, 6.5, 4.2], rowH: 0.55, headerFontSize: 16, fontSize: 14 });
  },
}, page, TOTAL);

// p.5 降維三派
page = 5;
T.addContentSlide(pres, {
  title: "降維三派:保什麼決定怎麼選",
  subtitle: "PCA / t-SNE / UMAP",
  body: (slide) => {
    T.bodyTable(slide, [
      ["方法", "保什麼", "sklearn API", "何時用"],
      ["PCA", "保全局變異", "PCA(n_components=2)", "線性關係、看主要變異"],
      ["t-SNE", "保局部鄰居", "TSNE(perplexity=30)", "看群聚, 不要信距離"],
      ["UMAP", "保拓樸結構", "umap.UMAP() (需另裝)", "大資料、需可重現"],
    ], { y: 1.5, colW: [2.0, 2.8, 3.7, 3.4], rowH: 0.7, fontSize: 15 });
    T.bodyCallout(slide,
      "⚠️ t-SNE 群間距離 沒有意義—學生最常犯這個錯。",
      "每次用 t-SNE 都加註記:distances not preserved");
  },
}, page, TOTAL);

// p.6 facet 紀律
page = 6;
T.addContentSlide(pres, {
  title: "Small Multiples:讓比較公平的工程紀律",
  subtitle: "Edward Tufte: A powerful and underused technique",
  body: (slide) => {
    T.bodyTwoCol(slide,
      { title: "❌ 不要", body:
        "把 4 個混淆矩陣的數字塞到一張表。\n\n" +
        "讀者要自己心算, 你的圖沒有完成「比較」這件事。" },
      { title: "✅ 這樣做", body:
        "plt.subplots(1, 4, sharey=True)\n\n" +
        "並排 4 個 confusion matrix\n" +
        "用同一個 colormap\n" +
        "用同一個 scale\n\n" +
        "—— sharey + 同 cmap = 公平比較" }
    );
  },
}, page, TOTAL);

// p.7 長寬資料
page = 7;
T.addContentSlide(pres, {
  title: "長寬資料 melt / pivot",
  subtitle: "seaborn 多類別圖的鑰匙",
  body: (slide) => {
    T.bodyTable(slide, [
      ["格式", "形狀", "誰愛用"],
      ["寬格式 (wide)", "每個指標一欄", "人類習慣;報表給人看"],
      ["長格式 (long)", "(模型, metric, value)", "seaborn 必須長格式"],
    ], { y: 1.5, colW: [2.8, 4.5, 4.6], rowH: 0.7, fontSize: 16 });
    T.bodyCallout(slide,
      "melt 把寬變長, pivot 把長變寬",
      "記住這兩個動詞, 下半輩子畫圖會省一半時間");
  },
}, page, TOTAL);

// p.8 AI 鷹架 #1
page = 8;
T.addVoteSlide(pres, {
  title: "AI 鷹架 #1:降維選型 + 多模型多指標視覺化",
  prompt: "個人實作 8 分鐘 → 上傳 TronClass「W16 AI 鷹架 #1」",
  options: [
    { key: "1", label: "選型決策樹", desc: "PCA / t-SNE / UMAP 在 1000×50×3 類 怎麼選?" },
    { key: "2", label: "多指標選圖", desc: "5 模型×4 指標, 為何表格不是最佳選擇?" },
    { key: "3", label: "彙整 + 上傳", desc: "100 字彙整 + 你的選擇貼到 TronClass" },
  ],
  inputHint: "全程開放 AI 工具",
  afterAction: "Allen 走動巡視, 3 分鐘抽 2 位請他說『AI 教了我什麼我原本不知道』",
}, page, TOTAL);

// p.9 §2 章節分隔
page = 9;
T.addSectionDivider(pres, {
  sectionMark: "§2",
  title: "第二堂:降維與小型多重圖實作",
  subtitle: "用 digits 與 breast_cancer 練四個必畫",
  timeRange: "50 分鐘 ｜ 實作 35 + 收尾 15",
}, page, TOTAL);

// p.10 軌道 A 對照
page = 10;
T.addContentSlide(pres, {
  title: "軌道 A:四個必畫進階版",
  subtitle: "對應 W16_demo_pca_tsne_cells.py 的 Cell 1-4",
  body: (slide) => {
    T.bodyTable(slide, [
      ["Cell", "內容", "關鍵 API"],
      ["Cell 1", "PCA 2D 投影 (digits 64→2)", "sklearn.decomposition.PCA"],
      ["Cell 2", "PCA vs t-SNE 並排", "sklearn.manifold.TSNE"],
      ["Cell 3", "4 模型混淆矩陣 facet", "plt.subplots(1, 4, sharey=True)"],
      ["Cell 4", "多模型多指標雷達圖", "polar projection + plt.fill"],
    ], { y: 1.5, colW: [1.5, 5.5, 4.9], rowH: 0.65, fontSize: 15 });
    T.bodyCallout(slide,
      "下 4 張投影片就是這 4 個 cell 的成品。",
      "看圖前先問自己:「我預期會看到什麼?」");
  },
}, page, TOTAL);

// p.11-14 demo 圖
page = 11;
addDemoSlide(pres, {
  title: "Demo #1 — PCA 2D 投影 (digits 64→2)",
  subtitle: "把 64 維壓成 2 維, 群聚結構還能保留嗎?",
  imgPath: IMG.pca,
  observation:
    "• 10 個類別有重疊, 但能隱約看出群聚趨勢。\n\n" +
    "• 標題寫 explained_variance_ratio % 是專業圖的標誌。\n\n" +
    "• PCA 只保 ~29% 變異 → 看不清細節是正常的。",
  askYourself: "如果用 PCA(n_components=3) 投到 3D, 會更清楚嗎?",
}, page, TOTAL);

page = 12;
addDemoSlide(pres, {
  title: "Demo #2 — PCA vs t-SNE 並排",
  subtitle: "同一份資料的兩種視角",
  imgPath: IMG.pca_vs_tsne,
  observation:
    "• t-SNE 群聚清楚很多 → 適合『看分群』。\n\n" +
    "• 但群間距離 不可信 — t-SNE 為了讓群內緊密, 把群間距離扭曲了。\n\n" +
    "• 看法:t-SNE 看誰跟誰一群, PCA 看主要變異方向。",
  askYourself: "如果你看到 t-SNE 兩群很遠, 能說它們差異很大嗎?",
}, page, TOTAL);

page = 13;
addDemoSlide(pres, {
  title: "Demo #3 — 4 模型混淆矩陣 facet (惡性為 positive)",
  subtitle: "True→X 軸、Predicted→Y 軸 ｜ 公平比較需要 sharey + 同 cmap",
  imgPath: IMG.facet,
  observation:
    "• 4 個模型 accuracy 都 0.95+, 但 recall(惡) 差距才是真關鍵。\n\n" +
    "• 與 W15 一樣指定 pos_label=0 才能看到醫學上有意義的 recall。\n\n" +
    "• sharey=True 讓你能直接比『漏判惡性的數量』(FN)。\n\n" +
    "• 如果各圖 colorscale 不同, 顏色深淺就騙人了。",
  askYourself: "若要選一個模型部署到醫院, 你看 acc 還是 recall(惡)?",
}, page, TOTAL);

page = 14;
addDemoSlide(pres, {
  title: "Demo #4 — 多模型雷達圖 (y 軸 0.85-1.0)",
  subtitle: "把差異放大才能看到取捨",
  imgPath: IMG.radar,
  observation:
    "• y 軸從 0.85 起跳 → 把細微差異放大。\n\n" +
    "• 把範圍寫在標題裡 = 誠實;沒寫 = 作弊。\n\n" +
    "• 看法:形狀越接近圓 = 各指標越均衡;尖角 = 偏科。",
  askYourself: "雷達圖最大的弱點是什麼?(提示:指標順序)",
}, page, TOTAL);

// p.15 AI 鷹架 #2
page = 15;
T.addVoteSlide(pres, {
  title: "AI 鷹架 #2:降維除錯與特徵縮放",
  prompt: "個人實作 15 分鐘 → 上傳 TronClass「W16 AI 鷹架 #2」",
  options: [
    { key: "1", label: "選型", desc: "PCA / t-SNE / UMAP 各 sklearn 程式" },
    { key: "2", label: "除錯", desc: "t-SNE 全混在一起的 3 個原因" },
    { key: "3", label: "彙整", desc: "100 字 + 你跑的 PCA/t-SNE 截圖上傳" },
  ],
  inputHint: "AI 工具不限 → 配色一定用 #E76F51 / #2A9D8F",
  afterAction: "Allen 抽 2 位投影看『沒做特徵縮放』的反例",
}, page, TOTAL);

// p.16 §3 章節分隔
page = 16;
T.addSectionDivider(pres, {
  sectionMark: "§3",
  title: "第三堂:多軸協調圖與 SCQA 套用",
  subtitle: "為什麼把雷達圖接在 facet 後面講",
  timeRange: "50 分鐘 ｜ 平行/雷達 25 + SCQA 15 + 期末考預告 10",
}, page, TOTAL);

// p.17 為什麼 facet 接雷達
page = 17;
T.addContentSlide(pres, {
  title: "為什麼把雷達圖接在 facet 後面講",
  subtitle: "兩個工具解的是對稱的問題",
  body: (slide) => {
    T.bodyTwoCol(slide,
      { title: "Facet (上一堂)", body:
        "讓多張圖共享尺度\n\n" +
        "多個物件 × 一個指標\n\n" +
        "例:4 個模型的混淆矩陣\n\n" +
        "用 sharey + 同 cmap" },
      { title: "雷達圖 (本堂)", body:
        "讓多個指標共享一張圖\n\n" +
        "一個物件 × 多個指標\n\n" +
        "例:KNN 的 acc/prec/rec/f1/auc\n\n" +
        "用 polar projection" }
    );
  },
}, page, TOTAL);

// p.18 SCQA 模型比較
page = 18;
T.addContentSlide(pres, {
  title: "SCQA 套用模型比較",
  subtitle: "工程思維 vs 科展思維",
  body: (slide) => {
    T.bodyTable(slide, [
      ["階段", "你的敘事"],
      ["S 情境", "訓練了 4 個模型, accuracy 都在 0.95+"],
      ["C 衝突", "SVM 雖然最準, 訓練時間是 KNN 的 7.5 倍"],
      ["Q 問題", "部署到 edge device, 這個成本能接受?"],
      ["A 答案", "推薦 KNN:accuracy 只少 2%, 速度快 7.5 倍"],
    ], { y: 1.5, colW: [2.0, 9.9], rowH: 0.8, fontSize: 16 });
    T.bodyCallout(slide, "工程思維:成本/效益。不要寫『我選 accuracy 最高的』。");
  },
}, page, TOTAL);

// p.19 AI 鷹架 #3
page = 19;
T.addVoteSlide(pres, {
  title: "AI 鷹架 #3:模型比較 SCQA 敘事",
  prompt: "個人實作 8-10 分鐘 → 上傳 TronClass「W16 AI 鷹架 #3」",
  options: [
    { key: "1", label: "找衝突", desc: "除了 accuracy, 還有哪 2 個被忽略的衝突點?" },
    { key: "2", label: "產 SCQA", desc: "300 字商業決策段落, 不要學術論文腔" },
    { key: "3", label: "彙整", desc: "推薦模型 + 一句理由貼到 TronClass" },
  ],
  inputHint: "風格要像給工廠廠長看的決策建議書",
  afterAction: "Allen 投影抽 2 位的回應, 比較哪個版本最有『下決定的力道』",
}, page, TOTAL);

// p.20 期末考預告
page = 20;
T.addContentSlide(pres, {
  title: "W18 期末考預告(部分公布)",
  subtitle: "下週公布實際資料集",
  body: (slide) => {
    T.bodyBullets(slide, [
      { text: "形式:個人實作 + AI 全面開放協作", bold: true, color: T.PALETTE.primary },
      { text: "  不分組、不可互相討論、不抽問", indent: 1, color: T.PALETTE.textMuted },
      { text: "時長:W18 上午, 共 130 分鐘 (實作主體 95 分鐘)", bold: true, color: T.PALETTE.primary },
      { text: "繳交:3 個檔案 (缺一當題零分)", bold: true, color: T.PALETTE.primary },
      { text: "  ① Notebook (.ipynb)", indent: 1 },
      { text: "  ② 首頁圖 (.png)", indent: 1 },
      { text: "  ③ 簡報 (版型自由)", indent: 1 },
      { text: "情境:智慧場域 ML 視覺化分析(下週公布實際資料)", bold: true, color: T.PALETTE.primary },
    ]);
  },
}, page, TOTAL);

// p.21 學習重點
page = 21;
T.addContentSlide(pres, {
  title: "🎓 W16 學習重點與實踐建議",
  subtitle: "SCQA 三件事",
  body: (slide) => {
    T.bodyBullets(slide, [
      { text: "維度敏感度 (S, Discover 見)", bold: true, color: T.PALETTE.primary },
      { text: "  4 維以下用 pairplot、5-30 用 facet、>30 只能降維。寫圖前先 print X.shape", indent: 1 },
      { text: "降維工具差異 (C, Define 識)", bold: true, color: T.PALETTE.primary },
      { text: "  PCA 看變異, t-SNE 看群聚。t-SNE 距離沒有意義—每次都加註記", indent: 1 },
      { text: "長寬資料 melt/pivot (A, Decide 斷)", bold: true, color: T.PALETTE.primary },
      { text: "  seaborn 必須長格式;報表用寬格式。拿到 DataFrame:melt 還是 pivot?", indent: 1 },
    ]);
  },
}, page, TOTAL);

// p.22 Allen 隨堂叮嚀
page = 22;
T.addContentSlide(pres, {
  title: "📝 Allen 老師隨堂叮嚀",
  body: (slide) => {
    slide.addText(
      "資料 30 維你還在 plt.scatter,\n" +
      "那是大一的功夫。\n\n" +
      "智工系二年級的視覺化是\n" +
      "「會降維、會 facet、會 melt」。\n\n" +
      "下週講敘事時, 你不會這些工具就沒得說故事——\n" +
      "因為故事要從「對的視角」講出來,\n" +
      "PCA 跟 t-SNE 就是你的兩種視角。",
      {
        x: 0.7, y: 1.7, w: 11.9, h: 5.0,
        fontSize: 22, fontFace: T.FONT.primary, italic: true,
        color: T.PALETTE.textDark, align: "left", valign: "middle",
        paraSpaceAfter: 10,
      }
    );
  },
}, page, TOTAL);

// p.23 下週預告
page = 23;
T.addContentSlide(pres, {
  title: "下週預告:W17 數據敘事",
  subtitle: "SCQA × 見識謀斷 + 期末考準備",
  body: (slide) => {
    T.bodyBullets(slide, [
      { text: "SCQA × 見識謀斷:把 W15/W16 學的圖串成商業敘事", color: T.PALETTE.primary, bold: true },
      { text: "首頁圖 (Hero Chart) 七原則:期末考 20% 全在這", color: T.PALETTE.primary, bold: true },
      { text: "三層敘事:標題、圖、註記—每張都要寫齊", color: T.PALETTE.primary, bold: true },
      { text: "期末考題本與資料集 正式公布", color: T.PALETTE.primary, bold: true },
      { text: "", },
      { text: "預習提示", color: T.PALETTE.secondary, bold: true },
      { text: "  把這 2 週畫的所有圖, 每張寫一個結論式標題", indent: 1, color: T.PALETTE.textMuted },
      { text: "  問自己:如果只能保留 1 張, 哪一張?", indent: 1, color: T.PALETTE.textMuted },
    ]);
  },
}, page, TOTAL);

// p.24 課堂資源
page = 24;
T.addContentSlide(pres, {
  title: "📚 W16 課堂資源",
  subtitle: "全部放在 TronClass 與 GitHub repo",
  body: (slide) => {
    T.bodyTable(slide, [
      ["資源", "位置", "用途"],
      ["W16 講義 (HTML)", "TronClass W16 公告", "課後複習"],
      ["W16 簡報 (PPTX)", "TronClass W16 公告", "本份簡報"],
      ["W16_demo_pca_tsne_cells.py", "GitHub repo", "VS Code 跑示範"],
      ["AI 鷹架 #1/#2/#3 上傳欄", "TronClass W16", "本週 3 個實作產出"],
    ], { y: 1.5, colW: [4.5, 4.0, 3.4], rowH: 0.7, fontSize: 14 });
  },
}, page, TOTAL);

// p.25 Q&A
page = 25;
T.addContentSlide(pres, {
  title: "Q&A",
  subtitle: "下週見 → W17 數據敘事",
  body: (slide) => {
    slide.addText("有問題?", {
      x: 0.7, y: 2.0, w: 11.9, h: 1.0,
      fontSize: 60, fontFace: T.FONT.primary, bold: true,
      color: T.PALETTE.primary, align: "center", valign: "middle",
    });
    slide.addText("(可以舉手, 也可以下課後私下問)", {
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
final.addText("Thank you", {
  x: 0.7, y: 2.5, w: 12, h: 1.5,
  fontSize: 72, fontFace: T.FONT.primary, bold: true,
  color: T.PALETTE.textWhite, align: "center", valign: "middle",
});
final.addText("下週見 — W17 數據敘事 + 期末考準備", {
  x: 0.7, y: 4.3, w: 12, h: 0.6,
  fontSize: 24, fontFace: T.FONT.primary, italic: true,
  color: T.PALETTE.textGold, align: "center",
});

pres.writeFile({ fileName: OUT_FILE }).then(() => {
  console.log(`✅ 完成: ${OUT_FILE}`);
});
