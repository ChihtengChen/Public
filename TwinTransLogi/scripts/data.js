/* ============================================================
 * TwinTransLogi — 教科書互動簡介　資料檔
 * 14 章內容：章前對話（精煉 6–8 句）+ 200 字簡述 + 元資料
 * 角色：A=Allen 顧問　W=Ware（倉儲）　R=Route（運輸）　N=旁白
 * ============================================================ */

window.BOOK_DATA = {
  meta: {
    title: '倉儲與運輸管理',
    subtitle: '以系統思維邁向雙軸轉型',
    tagline: '14 章 · 585 道章末習題 · 61 張結構圖示',
    author: 'Allen 老師（陳志騰）',
    affiliation: '國立臺中科技大學 AI 應用工程學位學程教師',
    lab: 'AIBILA 研究室',
    edition: 'v3 全書定稿',
    year: '2026'
  },

  features: [
    {
      n: '01',
      color: 'navy',
      title: '獨家方法論<br>兩階段決策金字塔',
      body: '原創<strong>「決策金字塔 2.0」</strong>—— 前段 KRI → KPI → CFA → EFA 完成分析、後段 IPA → OGSM → 封閉迴圈完成回應，加 <strong>Logi-Twin 成熟度模型</strong>四階對齊組織能力。'
    },
    {
      n: '02',
      color: 'green',
      title: '三人敘事體例<br>跟著角色學物流',
      body: '<strong>Allen 顧問 × Ware（倉儲）× Route（運輸）</strong>三角色貫穿全書。每章「現場筆記」與「角色疑問」灰框讓抽象落地真實。'
    },
    {
      n: '03',
      color: 'amber',
      title: '資訊系統視角為骨<br>雙軸轉型為血',
      body: '知識展開以 <strong>資料實體 / 資訊流 / 狀態機 / 介面模式</strong> 四骨幹組織。Ch 4 WMS、Ch 9 TMS 整體架構章皆採此設計。'
    },
    {
      n: '04',
      color: 'red',
      title: '本土在地化<br>台灣案例 + 工研院淵源',
      body: 'Ch 13 採 <strong>momo / 新竹物流 / DHL 台灣</strong>三家本土轉型案例；銜接 <strong>陳慧娟 1994 年「物流 100 訣」</strong>歷史脈絡，台灣中小物流落地三路徑。'
    },
    {
      n: '05',
      color: 'purple',
      title: 'PBL 五區塊 + 章末三大元件　完整 OBE 教學支援',
      body: '每章固定 <strong>章前情境 → 核心議題 → 知識展開 → 工具技術 → 反思 + AIBILA Prompt Box</strong>。章末三大元件：五點摘要 + 詞彙索引 + <strong>45 題章末習題</strong>，13 章合計 <strong>585 題</strong>。'
    }
  ],

  parts: [
    {
      id: 'part1',
      label: '核心思維篇',
      eyebrow: 'PART ONE',
      tagline: '三觀點建構心智模型',
      cast: 'Allen × Ware × Route',
      chapters: ['ch01', 'ch02', 'ch03']
    },
    {
      id: 'part2',
      label: '倉儲作業篇',
      eyebrow: 'PART TWO',
      tagline: 'Allen × Ware',
      cast: 'Allen × Ware',
      chapters: ['ch04', 'ch05', 'ch06', 'ch07', 'ch08']
    },
    {
      id: 'part3',
      label: '運輸作業篇',
      eyebrow: 'PART THREE',
      tagline: 'Allen × Route',
      cast: 'Allen × Route',
      chapters: ['ch09', 'ch10', 'ch11', 'ch12', 'ch13']
    },
    {
      id: 'epilogue',
      label: '後記',
      eyebrow: 'EPILOGUE',
      tagline: '三人合流',
      cast: 'Allen × Ware × Route',
      chapters: ['ch14']
    }
  ],

  chapters: {
    ch01: {
      num: '1',
      title: '物流運作的底層結構',
      subtitle: '本體觀點',
      part: 'part1',
      figure: 'ch01.png',
      figCaption: '圖 1-2　物流本體五元組與知識圖譜的對應',
      kri: ['五元組', 'SIPOC', '四種網絡'],
      axes: ['DX', 'SX'],
      status: 'done',
      version: 'v2_3',
      video: {
        id: '6mAWiqlM448',
        shorts: true,
        list: 'PLVLmj758HnSaDEKp-6EwfvmRiOjI4b-7g',
        title: '章前影片導覽　·　Allen 老師導讀'
      },
      dialogue: [
        { who: 'N', text: '【場景】Allen 的辦公室白板，Ware 與 Route 第一次共同出現。Allen 在白板上方寫下：「定義清楚世界是什麼，再談如何改變它。」' },
        { who: 'W', text: '老師，AI 都這麼強了，還需要重新定義「物流是什麼」嗎？' },
        { who: 'A', text: '需要。因為定義是支點。沒有支點，再多的工具與指標都會浮在空中。' },
        { who: 'R', text: '可是供應鏈、物流、配送，每家公司講法都不一樣⋯⋯' },
        { who: 'A', text: '所以我們要先把「人、貨、場、車、路」這五個元素統一講清楚——這就是本書的本體基礎。' },
        { who: 'W', text: '只用五個字，會不會太簡化？' },
        { who: 'A', text: '簡單但不簡化。再加上「收、存、送」三流程與「節點 × 連線」雙網絡，就涵蓋了 90% 的物流複雜度。' },
        { who: 'R', text: '剩下 10% 呢？' },
        { who: 'A', text: '那 10% 留給雙軸轉型——DX × SX——它們不是第六、第七元，而是穿透五元組的兩股力量。' }
      ],
      summary: '本章建立全書基礎：用五元組（人、貨、場、車、路）作為共同詞彙，搭配「收、存、送」三階段 SIPOC 流程，與「節點 × 連線」雙網絡（Point-to-Point／Hub-and-Spoke／Milk Run／Multi-Echelon 四型）。導入「資訊伴生層」與「碳帳戶」兩個新維度，並提出雙軸轉型矩陣（DX × SX）的四象限定位工具，作為全書 14 章的共同入口。'
    },

    ch02: {
      num: '2',
      title: '物流資訊的神經網路',
      subtitle: '資訊觀點',
      part: 'part1',
      figure: 'ch02.png',
      figCaption: '圖 2-1　物流資訊系統的神經網路四層架構',
      kri: ['四層架構', '主資料治理', '介面三階段'],
      axes: ['DX'],
      status: 'done',
      version: 'v2_4',
      dialogue: [
        { who: 'N', text: '【場景】Ware 在台中履約中心遇到單據卡關——同一張訂單在 OMS、WMS、TMS 三個系統顯示不同狀態。' },
        { who: 'W', text: '老師，三個系統打架時，我該信哪一邊？' },
        { who: 'A', text: '都不信。應該回頭看「神經網路」是不是斷掉了。' },
        { who: 'W', text: '神經網路？這不是 AI 用語嗎？' },
        { who: 'A', text: '我借這個比喻——感測層（IoT）→ 資料層（DW／資料湖）→ 應用層（WMS／TMS）→ 智慧層（AI／BI）。系統打架，通常是「應用層」沒對齊「資料層」。' },
        { who: 'W', text: '那要怎麼修？' },
        { who: 'A', text: '從「主資料治理」開始——SKU、客戶、儲位、車輛、駕駛這五張主表，必須是全公司唯一可信來源。' }
      ],
      summary: '本章把資訊系統視為物流的神經網路，分為感測層、資料層、應用層、智慧層四層架構。介紹維度／事實表設計、主資料治理（MDM）、介面整合三階段（檔案批次→ 訊息佇列→事件流），並把 AI／BI 落地架構嵌入此神經網路（不獨立成章），為後續 Ch 4 WMS、Ch 9 TMS 的整體架構章鋪路。'
    },

    ch03: {
      num: '3',
      title: '物流問題的解決邏輯',
      subtitle: '決策觀點',
      part: 'part1',
      figure: 'ch03.png',
      figCaption: '圖 3-1　兩階段決策金字塔（決策金字塔 2.0）',
      kri: ['兩階段金字塔', 'IPA', 'OGSM', 'Logi-Twin 成熟度'],
      axes: ['DX', 'SX'],
      status: 'done',
      version: 'v2_5',
      dialogue: [
        { who: 'N', text: '【場景】Route 在會議中報告月度 KPI 異常，老闆問「為什麼？」，他答不出來。' },
        { who: 'R', text: '老師，我能說出指標掉了，但說不出根因。' },
        { who: 'A', text: '因為你還在 KPI 層次。要往下看 KRI——關鍵結果指標的早期警訊。' },
        { who: 'R', text: '那再下面呢？' },
        { who: 'A', text: 'CFA 共同因子分析、EFA 探索性因子分析——這是金字塔的「分析階段」。' },
        { who: 'W', text: '分析完之後呢？' },
        { who: 'A', text: '進入「回應階段」——IPA 重要性績效分析 → OGSM 四欄展開 → 封閉迴圈。' },
        { who: 'R', text: '兩階段六步驟⋯⋯這就是決策金字塔 2.0？' },
        { who: 'A', text: '對。再用 Logi-Twin 成熟度模型四階，看你的組織能力走到哪一層。' }
      ],
      summary: '本章是全書原創方法論主軸——兩階段決策金字塔（亦稱決策金字塔 2.0）：分析階段 KRI → KPI → CFA → EFA，回應階段 IPA → OGSM → 封閉迴圈。搭配物流業雙軸轉型成熟度模型（Logi-Twin Transformation Maturity Model）四階（啟動／擴展／整合／領導），對齊 GHG Protocol 三範疇與 TCFD 揭露框架。'
    },

    ch04: {
      num: '4',
      title: '倉儲管理系統（WMS）架構',
      subtitle: '從模組到資料實體',
      part: 'part2',
      figure: 'ch04.png',
      figCaption: '圖 4-1　WMS 三大模組整體架構',
      kri: ['三大模組', '五大主檔', '七子項作業', '四介面模式'],
      axes: ['DX'],
      status: 'done',
      version: 'v2_2',
      dialogue: [
        { who: 'N', text: '【場景】Ware 接手台中履約中心，旺季前要評估現有 WMS 是否堪用。' },
        { who: 'W', text: '老師，我看 WMS 廠商提案像看天書——介面、模組、ER 圖一堆。' },
        { who: 'A', text: '把它拆三層就懂了——主檔層（誰）、作業層（做什麼）、報表層（看結果）。' },
        { who: 'W', text: '主檔有哪些？' },
        { who: 'A', text: 'SKU、儲位、客戶、貨主、批號／序號——五張主檔撐起整個 WMS。' },
        { who: 'W', text: '那 WMS 怎麼跟 ERP、OMS、WCS、TMS 接？' },
        { who: 'A', text: '四種介面：批次（Batch）、近即時（NRT）、事件（Event）、即時（Real-time）。選錯就會像我們開頭講的——三系統打架。' }
      ],
      summary: '本章是倉儲篇整體架構章。WMS 三大模組（作業 × 主檔 × 報表）× 五主實體 ER 圖（SKU／儲位／客戶／貨主／批號）× 七子項作業（收／存／揀／補／盤／發／報）× 四介面分工（ERP／OMS／WCS-WES／TMS）× 選型三原則（TCO／Fit／Exit）。後續 Ch 5–8 即在此架構下展開五個倉儲核心議題。'
    },

    ch05: {
      num: '5',
      title: '儲位規劃與空間優化',
      subtitle: '空間與路徑的權衡',
      part: 'part2',
      figure: 'ch05.png',
      figCaption: '圖 5-1　儲位編碼層級分解',
      kri: ['ABC×XYZ×EIQ', '適合度評分', '揀貨五路徑'],
      axes: ['DX'],
      status: 'done',
      version: 'v2_5',
      dialogue: [
        { who: 'N', text: '【場景】12 月初，旺季結束，Ware 與 Allen 在茶水間討論儲位重整。' },
        { who: 'W', text: '老師，我打算把週轉最高的 30 個 SKU 全搬到入口熱區。' },
        { who: 'A', text: '只看銷售額？還是也看共現度？' },
        { who: 'W', text: '共現度⋯⋯什麼意思？' },
        { who: 'A', text: '哪些 SKU 「常常一起被揀」。如果 A 高週轉、B 中週轉，但 A 與 B 在同一張訂單出現的機率超過 70%，把 A、B 放在同一走道才划算。' },
        { who: 'W', text: '那不是要算 EIQ 三軸？' },
        { who: 'A', text: '對——EIQ + ABC + XYZ 三層分類，再用「適合度評分（Suitability Score）」做加權。儲位規劃從來不是單變數問題。' }
      ],
      summary: '本章核心是「儲位規劃（Slotting）」——以 ABC（金額）× XYZ（穩定度）× EIQ（共現度）三層分類為基礎，導入「適合度評分（Suitability Score）」複合公式做儲位 → SKU 配對。涵蓋儲位主檔六層階層（倉／庫／道／排／層／格）、編碼五原則、空間 85–90% 甜蜜點、五種揀貨路徑（S-shape／Return／Mid-point／Largest-gap／Optimal）的對照。'
    },

    ch06: {
      num: '6',
      title: '入庫驗收與上架邏輯',
      subtitle: '精準資料的起點',
      part: 'part2',
      figure: 'ch06.png',
      figCaption: '圖 6-1　倉儲三層分工流程',
      kri: ['三層分工', 'GIGO 七維度', 'SRN/RTV/RTS'],
      axes: ['DX'],
      status: 'done',
      version: 'v2',
      dialogue: [
        { who: 'N', text: '【場景】雙 11 補貨日，台中履約中心 3 號碼頭三輛車同時到。' },
        { who: 'W', text: '老師，現場理貨、檢貨、揀貨三個動詞被混用，師傅們各說各話。' },
        { who: 'A', text: '先把動詞釐清。理貨是粗點對單分類，檢貨是 SOP 系統性查驗，揀貨留給出庫。' },
        { who: 'W', text: '那 GRN 簽放、SRN 退回、RTV 退供應商怎麼分？' },
        { who: 'A', text: '四類驗收鏈：ASN → 卸貨 → 理貨 → 檢貨 → QA → GRN／RTV。SRN 走獨立泳道。' },
        { who: 'W', text: '為什麼這麼計較？' },
        { who: 'A', text: '因為 GIGO——進來的資料有多髒，後面決策就有多荒謬。九成系統 + 一成人工，是入庫品質的紀律。' }
      ],
      summary: '本章建立「資料品質的起點」紀律。三層分工（Slotting／Putaway Rules／Putaway Process）× 四類驗收鏈（ASN／GRN／SRN／QA）× GIGO 七維度（完整／一致／準確／時效／唯一／有效／可讀）× 上架規則樹三分支（食品／高週轉 3C／耐久）× 上架作業三模式（RF 手持／PTL／AS-RS-AMR）× 五大入庫例外 SOP。'
    },

    ch07: {
      num: '7',
      title: '揀貨策略與庫存控管',
      subtitle: '效率與效益的防線',
      part: 'part2',
      figure: 'ch07.png',
      figCaption: '圖 7-1　揀貨三層分工流程',
      kri: ['EIQ 三軸', 'PCB 三概念', 'ABC 循環盤點'],
      axes: ['DX'],
      status: 'done',
      version: 'v2_1',
      dialogue: [
        { who: 'N', text: '【場景】Ware 報告 UPH（每小時揀貨次數）下滑 12%。' },
        { who: 'W', text: '老師，我們每天加班到八點，UPH 還是掉。' },
        { who: 'A', text: '加班是「效率（do things right）」的補救。但你問過「效益（do the right things）」嗎？' },
        { who: 'W', text: '效益怎麼問？' },
        { who: 'A', text: '把訂單拆成 EIQ 三軸——EQ／EN（訂單軸）、IQ／IK（貨品軸）、IA（共現軸）。先看你的訂單長什麼樣。' },
        { who: 'W', text: '所以問題不是揀得不夠快，是策略選錯？' },
        { who: 'A', text: '對。單一訂單／彙總／波次／分區四種策略，配 PCB 三概念（揀次數／揀項數／揀位數），UPH 不會掉。' }
      ],
      summary: '本章採 Drucker 區分（效率 vs 效益）為章名核心。揀貨三層分工（策略／指令／執行）× EIQ 三軸全章 DNA × 揀貨四策略（單一／彙總／波次／分區）× 揀貨四模式（RF／PTL／PTV／AS-RS）× PCB-aware 三概念分流（揀次數／揀項數／揀位數）× 揀誤四根因（人／單／位／資料）× ABC 循環盤點頻率階梯（A 週／B 月／C 季）。'
    },

    ch08: {
      num: '8',
      title: '流通加工、包裝與出庫裝載',
      subtitle: '加值服務與品質交付',
      part: 'part2',
      figure: 'ch08.png',
      figCaption: '圖 8-1　出庫三層分工流程',
      kri: ['VAS 七大類', 'Bin Packing', 'OTIF 紅線'],
      axes: ['DX', 'SX'],
      status: 'done',
      version: 'v2_1',
      dialogue: [
        { who: 'N', text: '【場景】Ware 接到客訴——客戶生日禮品被錯送了同名 SKU。' },
        { who: 'W', text: '老師，我們在出貨前已經三層核對，怎麼還是錯？' },
        { who: 'A', text: '揀錯到打包就會放大 4 倍——複合工序的痛點，不是查驗，是分流。' },
        { who: 'W', text: '什麼意思？' },
        { who: 'A', text: 'VAS 加值服務有早分流、中分流、晚分流三策略。早分流最安全，晚分流最危險。' },
        { who: 'W', text: '那 OTIF 紅線該怎麼設？' },
        { who: 'A', text: 'B2C 95%、B2B 98%、溫控藥品 99.5%。OTIF 是準時 + 全量無缺件 + 無錯送 + 品質無破損四項全達成——倉儲篇五章的綜合 KRI。' }
      ],
      summary: '本章是倉儲篇收束章。出庫三層分工（VAS／包裝／裝載）× VAS 七大類別（含贈品配對最易錯）× 包材選型四原則（保護>環保>回收>成本）× 棧板 × 貨車雙層 Bin Packing（FFD／GA／RL 三類解法）× OTIF 訂單履約率（倉儲篇綜合 KRI）× 人因工程章內節（站位設計三原則 75-110cm／60cm／15-30°）。'
    },

    ch09: {
      num: '9',
      title: '運輸管理系統（TMS）架構',
      subtitle: '訂單、路線與網絡',
      part: 'part3',
      figure: 'ch09.png',
      figCaption: '圖 9-1　TMS 三大模組整體架構',
      kri: ['TMS 三大模組', '五主實體', '網絡四型'],
      axes: ['DX'],
      status: 'done',
      version: 'v2_1',
      dialogue: [
        { who: 'N', text: '【場景】Route 升任全省營運副理，第一次到 Ware 的台中履約中心報到，帶了「假日宅配延遲熱圖」。' },
        { who: 'R', text: '老師、Ware，假日延遲集中在三條路線。我想重做派車邏輯。' },
        { who: 'A', text: 'TMS 跟 WMS 的世界觀不一樣——它是訂單軸，不是儲位軸。' },
        { who: 'R', text: '那五主實體是哪五個？' },
        { who: 'A', text: '訂單（核心）、派車單、送貨單、車輛、駕駛——加上運費交集表。' },
        { who: 'W', text: '派車單跟送貨單為什麼分開？' },
        { who: 'A', text: '因為派車是計畫，送貨是執行。台灣業界用「派車單 + 送貨單」雙模式，比歐美的 Waybill 單一單據更貼合宅配場景。' }
      ],
      summary: '本章是運輸篇整體架構章。TMS 三大模組（訂單 × 運輸計畫 × 執行追蹤）× 五主實體 ER（訂單 + 派車單 + 送貨單 + 車輛 + 駕駛 + 運費交集）× 運輸網絡四型（直線／軸輻式／多級轉運／混合）× TMS × WMS × OMS × DMS 四介面 × 四傳輸模式（Batch／NRT／Event／Real-time）× TCO/Fit/Exit 選型。'
    },

    ch10: {
      num: '10',
      title: '訂單指派與路線規劃',
      subtitle: '從規則到最佳化',
      part: 'part3',
      figure: 'ch10.png',
      figCaption: '圖 10-1　路線規劃三層分工流程',
      kri: ['VRP 三類問題', '解法階梯', '工具四選一'],
      axes: ['DX'],
      status: 'done',
      version: 'v2',
      dialogue: [
        { who: 'N', text: '【場景】Route 收到供應商提案——「導入 AI VRP 引擎，三個月見效」。' },
        { who: 'R', text: '老師，他們報價 800 萬，AI 演算法很厲害的樣子。' },
        { who: 'A', text: '先問你規模——50 台車以下，OR-Tools 開源就夠了。' },
        { who: 'R', text: 'OR-Tools 是 Google 開源的？' },
        { who: 'A', text: '對。CVRP、VRPTW、VRPPD 三類經典問題它都解。先用 SaaS 試半年，不行再考慮自建。' },
        { who: 'R', text: '老師你的鐵律是什麼？' },
        { who: 'A', text: '寧 SaaS 不自建，寧外包不從零開始。台灣中小物流走產學合作 → 工研院系統整合顧問 → 自建是三階段。' }
      ],
      summary: '本章採「演算法／工具識讀為主、實作為輔」教學立場。VRP 三類問題（CVRP／VRPTW／VRPPD）× 解法階梯（規則 → Savings → Sweep → Insertion → GA／SA／Tabu）× 工具特性矩陣（OR-Tools／LKH／VROOM／Jsprit 四選一）× 動態 VRP 三軸 KPI（派車異動率／路線執行率／回應時效）× 100 訣對照（陳慧娟 1994）× Allen「寧 SaaS 不自建」鐵律。'
    },

    ch11: {
      num: '11',
      title: '車輛管理與貨況追蹤',
      subtitle: '從監控到韌性應變',
      part: 'part3',
      figure: 'ch11.png',
      figCaption: '圖 11-1　車輛管理三層分工流程',
      kri: ['Telematics 六感測', '維護三階', 'BCP 韌性矩陣'],
      axes: ['DX', 'SX'],
      status: 'done',
      version: 'v2_2',
      dialogue: [
        { who: 'N', text: '【場景】Route 半夜接到電話，三輛冷藏車在高速公路上溫控警報。' },
        { who: 'R', text: '老師，每次出事我都被叫起來，這樣不是辦法。' },
        { who: 'A', text: 'Telematics 六感測器分 Stage A／B／C 三階——你還停在 A 階「事後通知」。' },
        { who: 'R', text: '那 B 階是？' },
        { who: 'A', text: '異常閾值動態校準 + 自動派工。再進到 C 階就是「預測式維護」（PdM），讓車在故障前進場。' },
        { who: 'R', text: '預測式維護不是大公司才用得起？' },
        { who: 'A', text: '錯。先用反應式維護打底、再升預防性、最後才預測式——三階依易到難排序，中小車隊也能起步。' }
      ],
      summary: '本章三層分工招牌「擷取 → 分析 → 應變」。Telematics 六感測器（GPS／OBD／溫度／重量／影像／駕駛行為）分 Stage A/B/C × 五類在途異常 × 駕駛行為四指標 × 電子圍籬三類 × 維護三階（反應式／預防性／預測式 PdM）× BCP 韌性矩陣 + 旺季三招（外車／共配／加班）+ 突發四類演練說服三層策略 + 自我決定理論落地。'
    },

    ch12: {
      num: '12',
      title: '送達簽收與回單管理（最後一哩）',
      subtitle: '資料閉環的核心節點',
      part: 'part3',
      figure: 'ch12.png',
      figCaption: '圖 12-1　簽收三層分工流程',
      kri: ['POD 三類', '異常 SOP 五類', '完美訂單率 POR'],
      axes: ['DX'],
      status: 'done',
      version: 'v2_1',
      dialogue: [
        { who: 'N', text: '【場景】Route 與會計部對帳到深夜，30% 的回單對不上。' },
        { who: 'R', text: '老師，紙本 POD 每月要花 200 工時對帳。' },
        { who: 'A', text: '導入 ePOD（電子簽收）。三類 POD——紙本／電子／異常——分流處理。' },
        { who: 'R', text: '異常 POD 怎麼分？' },
        { who: 'A', text: '客戶不在、改址、拒收、貨損、退貨——五類異常 SOP 三線分工。' },
        { who: 'R', text: '對帳爭議率怎麼降？' },
        { who: 'A', text: '結帳 5 個檢核點 + 資料閉環四階段，把 POR（完美訂單率）拉上來——這是最後一哩的學習機制。' }
      ],
      summary: '本章是運輸篇的「資料閉環核心節點」。三層分工「簽收 → 結帳 → 學習」× POD 三類分流（紙本／電子 ePOD／異常）× 五類異常處置 SOP 三線分工 × 結帳對帳 5 個檢核點 × 資料閉環四階段 × 完美訂單率（POR = OTD + OTIF + 無客訴 + 一次結帳成功 FFR）× DSO／對帳爭議率。'
    },

    ch13: {
      num: '13',
      title: '低碳運輸與碳盤查管理',
      subtitle: '從盤查到減量的三層架構',
      part: 'part3',
      figure: 'ch13.png',
      figCaption: '圖 13-1　碳盤查三層分工流程',
      kri: ['GHG Scope 1/2/3', 'SBTi 1.5°C', 'GPOR 綠色完美訂單率'],
      axes: ['SX'],
      status: 'done',
      version: 'v2_1',
      dialogue: [
        { who: 'N', text: '【場景】Route 收到歐洲客戶來信——「請提供 Scope 3 碳排揭露，否則 Q3 起停止採購」。' },
        { who: 'R', text: '老師，Scope 3 我連算都不會算。' },
        { who: 'A', text: '先盤、再設、後減——三層架構順序不能亂。Scope 1 自有車、Scope 2 倉庫照明、Scope 3 外包車與上下游。' },
        { who: 'R', text: '減量四招怎麼選？' },
        { who: 'A', text: '低碳調度 → 共配 → 車輛電動化 → 碳權對沖。先軟後硬鐵律。' },
        { who: 'R', text: '永續是有錢人的遊戲嗎？' },
        { who: 'A', text: '永續是「有方法的人」的遊戲。先做能做的——盤查、共配、調度都不貴，BEV 留到最後。' }
      ],
      summary: '本章是運輸篇收束章。三層分工「盤查 → 設定 → 減量」× GHG Protocol Scope 1/2/3 三範疇 × SBTi 1.5°C 路徑（每年減 4.2%）× 三框架識讀（TCFD／ISO 14064-1／EcoVadis）× 減量四招（低碳調度／共配／BEV／碳權）× 碳化 VRP 成本函數 × 三案例（momo／新竹物流／DHL 台灣）× GPOR 綠色完美訂單率（運輸篇綜合 KRI）。'
    },

    ch14: {
      num: '14',
      title: '後記：顧問的 10 個永遠問題',
      subtitle: '反思與收束',
      part: 'epilogue',
      figure: 'ch14.png',
      figCaption: '圖 14-1　全書 14 章收束視覺圖',
      kri: ['本體 × 作業 × 價值 × 收束'],
      axes: ['DX', 'SX'],
      status: 'done',
      version: 'v1_3',
      dialogue: [
        { who: 'N', text: '【場景】颱風後初秋傍晚，台中履約中心二樓會議室。Allen 顧問合約即將到期，決定婉拒續約準備寫書。' },
        { who: 'A', text: 'Ware、Route，這是我最後一次來——剩下的留 10 個問題給你們。' },
        { who: 'W', text: '老師，您不再來了？' },
        { who: 'A', text: '寫書去。30 年顧問，最重要的不是給答案，是留問題。' },
        { who: 'R', text: '哪 10 個問題？' },
        { who: 'A', text: '本體三題、作業三題、價值三題、收束一題——每題對應 1-2 章，讓你們回頭翻得到。' },
        { who: 'W', text: '最後一題是什麼？' },
        { who: 'A', text: '知己、知彼、知勢——保持永遠的好奇心、保持永遠的疑問、永遠回頭問這 10 個問題。' }
      ],
      summary: '後記不採完整 PBL 八區塊，只保留章前情境 + 10 個永遠問題 + 綠框摘要 + 簡化詞彙。10 題分四類：本體類（Q1-3）／作業類（Q4-6）／價值類（Q7-9）／收束類（Q10）。三角色合流告別，Allen 退場，Ware × Route 升任正式經理。章末白板金句：「從事物流不必然是你的夢想，但學好物流會讓你更接近夢想！」'
    }
  },

  // 名言（用於首頁 carousel + 分散在 sub-section）
  quotes: [
    { who: 'A', text: '知己、知彼、知勢——保持永遠的好奇心、保持永遠的疑問、永遠回頭問這 10 個問題。', cite: 'Ch 14 顧問 10 問 · Q10' },
    { who: 'A', text: '從事物流不必然是你的夢想，但學好物流會讓你更接近夢想！', cite: 'Ch 14 章末白板' },
    { who: 'A', text: '簡單但不簡化。五元組 + 三流程 + 雙網絡，覆蓋 90% 物流複雜度。', cite: 'Ch 1' },
    { who: 'A', text: '永續不是有錢人的遊戲，是「有方法的人」的遊戲。', cite: 'Ch 13' },
    { who: 'A', text: '寧 SaaS 不自建——AI 演算法選型的鐵律。', cite: 'Ch 10' },
    { who: 'A', text: '90% 系統 + 10% 人工——是入庫品質的紀律，不是技術配比。', cite: 'Ch 6' },
    { who: 'W', text: '為什麼三個系統會打架？', cite: 'Ch 2' },
    { who: 'R', text: 'Scope 3 我連算都不會算⋯⋯', cite: 'Ch 13' }
  ],

  // 試讀題（每章 1 題單選）
  trialQuestions: [
    { ch: 'ch01', q: '本書「五元組」指的是哪五個元素？', opts: ['人、車、貨、倉、路', '人、貨、場、車、路', '人、物、車、倉、路', '人、貨、倉、車、路'], ans: 'B', exp: '本書定版五元組為「人、貨、場、車、路」。「物→貨」「倉→場」是 v2_3 五元組命名規則升級。' },
    { ch: 'ch03', q: '兩階段決策金字塔的「分析階段」順序為何？', opts: ['KPI → KRI → CFA → EFA', 'KRI → KPI → CFA → EFA', 'EFA → CFA → KPI → KRI', 'KRI → CFA → KPI → EFA'], ans: 'B', exp: '分析階段為 KRI（早期警訊）→ KPI（常態指標）→ CFA（共同因子）→ EFA（探索性因子）。' },
    { ch: 'ch08', q: 'OTIF 包含哪四項全達成的條件？', opts: ['準時 + 全量 + 無錯送 + 品質無破損', '準時 + 滿載 + 一次結帳 + 客戶滿意', '時效 + 成本 + 品質 + 碳排', '訂單 + 派車 + 送貨 + 簽收'], ans: 'A', exp: 'OTIF = On-Time In-Full：準時送達 + 全量無缺件 + 無錯送 + 品質無破損四項全達成，倉儲篇五章綜合 KRI。' },
    { ch: 'ch13', q: 'GHG Protocol Scope 3 通常涵蓋什麼？', opts: ['倉庫照明用電', '自有車柴油', '外包車運輸與上下游間接排放', '可再生能源憑證'], ans: 'C', exp: 'Scope 1 = 自有設備直接排放（車輛柴油等）；Scope 2 = 外購電力／熱（倉庫照明）；Scope 3 = 間接排放（外包車輛、上下游採購等）。中小物流商盲點。' }
  ]
};
