/**
 * 招生說明廣宣表單 — 一鍵建表 Apps Script
 * ========================================================
 * 課程:2026 青年 AI 實戰養成班 · 智慧物流班
 * 機構口徑:工研院服科中心 × 國立臺中科大 AI 學程 · 工研院 DNA 的實戰課程
 * 用途:在 https://script.google.com/ 新建一個專案,把整檔貼入後執行 createForm()
 *        → 自動產出 Google Form + 串好 Google Sheet + 設定 onFormSubmit 觸發器
 * 版本:v0.1 / 2026-05-16
 * ========================================================
 */

// ============= 變數設定區(2026-05-16 Allen 確認版) =============
const CONFIG = {
  // 表單在 Google Form 顯示的標題(Allen 拍板 v2)
  FORM_TITLE: '招生說明會報名 - 智慧物流班 (2026)-工研院主辦',

  // 表單描述(對應草案的「引文 + 完訓門檻警示」)
  FORM_DESCRIPTION: [
    '工研院服科中心 × 國立臺中科大 AI 學程 · 工研院 DNA 的實戰課程',
    '',
    '240 小時 · 情境驅動 × 闖關式 × 角色進化',
    '完訓即享 5 萬獎勵金 + 物流業者媒合(+1 萬/月起薪)',
    '',
    '請花 3–5 分鐘讓我們認識您,我們將在 24 小時內回覆說明會連結。',
    '',
    '🚨 重要 · 完訓門檻請先衡量自身狀況:',
    '   ▸ 出席率必須 ≥ 90%(週一至週五 09:00–16:00 全天)',
    '   ▸ 綜合成績必須 ≥ 80 分',
    '   兩者缺一不可。未達標者仍可取得上課時數證明,',
    '   但 5 萬獎勵金與廠商媒合資格(+1 萬/月起薪)將不適用。'
  ].join('\n'),

  // 感謝頁文字(含課程諮詢社群引導 + v0.3 雙窗口 contact)
  CONFIRMATION_MESSAGE: [
    '✅ 已收到您的報名 — 感謝您的關注。',
    '',
    '我們會在 24 小時內以 email 寄出說明會連結與行前資訊。',
    '在此之前,您可以先到課程介紹頁了解架構:',
    'https://chihtengchen.github.io/Public/Youth_AI_LPage/',
    '',
    '💬 如您勾選了「加入課程諮詢社群」,連結將一併寄到您的 Email。',
    '   社群裡可隨時提問、查看其他學員的問答、收到第一手開課動態。',
    '',
    '若有急件或合作洽談,歡迎來信:',
    '   elinor@itri.org.tw 與 chen.chihteng@nutc.edu.tw',
    '— 工研院服科中心 × 國立臺中科大 AI 學程',
    '   工研院 DNA 的實戰課程 · 智慧物流班'
  ].join('\n'),

  // 說明會場次(2026-05-16 Allen 拍板:1 場線上)
  SESSIONS: [
    '✅ 可以參加 — 2026/06/12(五)12:10–13:00 · 線上',
    '🤔 暫時無法確定,請於說明會前再寄一次提醒',
    '❌ 我那天無法參加 — 改加入「課程諮詢社群」進行提問交流(請於下方 Q3 勾選)',
    '其他 / 客製安排(請於 Q4 備註說明)'
  ],

  // 通知信收件人(每提交一筆寄一封摘要 · v0.4 改陣列 · Elinor 也每筆收到)
  NOTIFY_EMAILS: [
    'chen.chihteng@gmail.com',   // Allen 個人通知信箱
    'elinor@itri.org.tw'         // 工研院 Elinor
  ],
  // 錯誤通知信只寄給 Allen(避免 stack trace 寄給 Elinor)
  ERROR_NOTIFY_EMAIL: 'chen.chihteng@gmail.com',

  // 是否限定 Google 登入:v0.4.1 從程式碼移除(僅 Workspace 域名帳號可用,
  // 個人 @gmail 連 false 都會丟 "operation not supported"。預設關閉符合 Allen 確認規格)
  // REQUIRE_LOGIN: false,

  // LPage 入口(感謝頁與通知信會帶這個連結)
  LPAGE_URL: 'https://chihtengchen.github.io/Public/Youth_AI_LPage/',

  // 課程諮詢社群連結(2026-05-16 Allen 提供短網址)
  COMMUNITY_URL: 'https://reurl.cc/xW4XX5'
};
// =================================================================


/**
 * ✅ 唯一可執行函式 — 線性建表 + setGoToPage 跳轉
 * 在 script.google.com 把整檔貼入後,選此函式按執行即可
 * 順序:Section 1 → A → (skip B/C) → B → (skip C) → C → 共用尾段
 *
 * v0.4.1:移除 setRequireLogin(個人 @gmail.com 不支援);
 *         刪除 createForm_doc_only_DO_NOT_RUN(下拉誤選風險)
 */
function createForm() {
  const form = FormApp.create(CONFIG.FORM_TITLE);
  form.setDescription(CONFIG.FORM_DESCRIPTION)
      .setConfirmationMessage(CONFIG.CONFIRMATION_MESSAGE)
      .setCollectEmail(true)
      // setRequireLogin(...) 已移除 — 僅 Workspace 域名帳號可用,本表預設不強制登入
      .setAllowResponseEdits(true)
      .setShowLinkToRespondAgain(false);

  // === Section 1 · 基本資料 ===
  form.addTextItem().setTitle('姓名').setRequired(true);
  form.addTextItem().setTitle('Email')
      .setHelpText('後續有關培育相關訊息連結、簡章皆寄此')
      .setValidation(FormApp.createTextValidation().requireTextIsEmail().build())
      .setRequired(true);
  form.addTextItem()
      .setTitle('手機')
      .setHelpText('(選填)開課前重要通知用 — 留下可加快聯繫')
      .setRequired(false);

  // 身分題 — 暫不設 choice,稍後 setChoices 帶 GoToPage
  const identityItem = form.addMultipleChoiceItem()
      .setTitle('您的身分')
      .setHelpText('💡 若您代表物流業者 / 企業 HR,請改填廠商說明會表單,本表不涵蓋。')
      .setRequired(true);

  form.addTextItem().setTitle('居住 / 服務地點(縣市)').setRequired(false);
  form.addMultipleChoiceItem()
      .setTitle('您從哪裡得知本課程?')
      .setChoiceValues(['社群媒體', '朋友介紹', '學校公告', '媒體報導', '合作機構', '其他'])
      .setRequired(false);

  // === A 分支 · 青年本人 ===
  const pageYouth = form.addPageBreakItem().setTitle('A · 青年本人');
  form.addMultipleChoiceItem()
      .setTitle('A1 · 年齡區間')
      .setChoiceValues(['18–22', '23–26', '27–29', '30–35', '其他'])
      .setRequired(true);
  form.addMultipleChoiceItem()
      .setTitle('A2 · 目前狀態')
      .setChoiceValues(['在學', '應屆', '待業', '在職轉職', '其他'])
      .setRequired(true);
  form.addTextItem()
      .setTitle('A3 · 最高學歷與科系')
      .setHelpText('例:○○大學資管系 大四')
      .setRequired(true);
  form.addCheckboxItem()
      .setTitle('A4 · 您對課程哪些面向最有興趣?(複選,至多 3 項)')
      .setChoiceValues([
        'Week 1 資料驅動師(ETL × Orange 3 / Python)',
        'Week 2 管理工程師(供應鏈管理 × 工程化)',
        'Week 3 AI 價值師(GenAI × 物流場景)',
        'Week 4 智慧架構師(系統整合 × Python)',
        'Week 5–8 BOSS 闖關 · 企業真題實作',
        '5 萬獎勵金 + 物流業者媒合(+1 萬/月起薪)',
        '智慧營運優化工程師 職涯路徑'
      ])
      .setRequired(true);
  form.addMultipleChoiceItem()
      .setTitle('A5 · 完訓門檻自我評估 — 請務必認真選擇')
      .setHelpText([
        '🚨 完訓門檻(對外口徑,不可商量):',
        '   ▸ 出席率 ≥ 90%(週一至週五 09:00–16:00 全天 · 共 8 週 · 240 小時)',
        '   ▸ 綜合成績 ≥ 80 分(含每日任務 + W/S/Q + BOSS 關卡 + Milestone)',
        '   兩者缺一不可。',
        '',
        '⚠️ 未達標者僅取得「上課時數證明」,5 萬獎勵金 + 物流業者媒合 +1 萬/月起薪皆不適用。',
        '⚠️ 若工作 / 課業 / 家庭因素無法配合全天出席,請誠實選 ❌ 或 🤔,我們會在說明會上協助評估。'
      ].join('\n'))
      .setChoiceValues([
        '✅ 可以 — 我已了解完訓門檻、能配合全天出席與評量強度',
        '🤔 想了解 — 需先在說明會聽完細節再決定',
        '❌ 不能 — 但仍想了解未來梯次或完訓認列是否有放寬或其他替代方案'
      ])
      .setRequired(true);
  form.addParagraphTextItem()
      .setTitle('A6 · 想在說明會上特別了解的事')
      .setRequired(false);
  // A 結束跳轉 placeholder(稍後設 GoToPage 到 pageCommon)
  const aEndBreak = form.addPageBreakItem().setTitle('— 進入共用尾段 —');

  // === B 分支 · 學校 / 教師 ===
  const pageSchool = form.addPageBreakItem().setTitle('B · 學校 / 教師');
  form.addTextItem().setTitle('B1 · 學校 / 系所').setRequired(true);
  form.addTextItem()
      .setTitle('B2 · 您的職稱')
      .setHelpText('例:○○系副教授、職涯輔導組長')
      .setRequired(true);
  form.addCheckboxItem()
      .setTitle('B3 · 合作意向')
      .setHelpText('本表主要服務「推薦學員」,其他合作意向可於 B5 補述。')
      .setChoiceValues([
        '學生推薦來源(轉介適合學員)',
        '其他(請於 B5 補充)'
      ])
      .setRequired(true);
  form.addMultipleChoiceItem()
      .setTitle('B4 · 預估可推薦的學生數')
      .setChoiceValues(['<5', '5–10', '11–20', '21+', '不確定'])
      .setRequired(false);
  form.addParagraphTextItem().setTitle('B5 · 想討論的主題').setRequired(false);
  const bEndBreak = form.addPageBreakItem().setTitle('— 進入共用尾段 —');

  // === C 分支 · 一般有興趣者 ===
  const pageGeneral = form.addPageBreakItem().setTitle('C · 一般有興趣者');
  form.addMultipleChoiceItem()
      .setTitle('C1 · 您是?')
      .setChoiceValues(['家長', '學員朋友推薦', '媒體', '政府或公部門', '其他'])
      .setRequired(true);
  form.addCheckboxItem()
      .setTitle('C2 · 您主要想了解的面向(複選,至多 3 項)')
      .setChoiceValues([
        '課程內容與時程',
        '學員獎勵金與媒合機制',
        '完訓條件與成效追蹤',
        '師資與業師陣容',
        '合作機會(學校 / 企業 / 媒體曝光)',
        '其他'
      ])
      .setRequired(true);
  form.addParagraphTextItem().setTitle('C3 · 其他補充').setRequired(false);
  // C 分支自然進入下一頁(共用尾段)

  // === 共用尾段 ===
  const pageCommon = form.addPageBreakItem().setTitle('說明會場次與通知設定');
  form.addMultipleChoiceItem()
      .setTitle('Q1 · 是否參加 2026/06/12(五)12:10–13:00 線上說明會?')
      .setHelpText('本梯次說明會為線上單場 · 50 分鐘(午休時段);說明約 30 分鐘,Q&A 約 20 分鐘。若無法參加,可在 Q3 加入「課程諮詢社群」隨時提問。')
      .setChoiceValues(CONFIG.SESSIONS)
      .setRequired(true);
  form.addMultipleChoiceItem()
      .setTitle('Q2 · 是否同意接收後續招生資訊、簡章、開課通知?')
      .setChoiceValues([
        '✅ 同意,請將招生資訊寄到上方填寫的 Email',
        '⬜ 不同意,僅參加本次說明會即可'
      ])
      .setRequired(true);
  form.addMultipleChoiceItem()
      .setTitle('Q3 · 是否加入「課程諮詢社群」?')
      .setHelpText('💬 課程諮詢社群可隨時提問、看其他學員的問答、第一手收到開課動態。加入連結將寄到您的 Email。\n課程諮詢社群|' + CONFIG.COMMUNITY_URL + '(請點連結加入)')
      .setChoiceValues([
        '✅ 是 — 請寄社群加入連結到我的 Email',
        '⬜ 否 — 暫時不需要'
      ])
      .setRequired(true);
  form.addParagraphTextItem().setTitle('Q4 · 其他備註(選填)').setRequired(false);

  // === 設定分支:身分題 → 對應頁,並把 A/B 結束跳轉指向共用尾段 ===
  identityItem.setChoices([
    identityItem.createChoice('A. 我是青年本人 · 有興趣參加本訓練', pageYouth),
    identityItem.createChoice('B. 我代表學校 / 系所 / 教師 · 想了解校系合作', pageSchool),
    identityItem.createChoice('C. 我是家長 / 朋友 / 一般有興趣者', pageGeneral)
  ]);
  aEndBreak.setGoToPage(pageCommon);
  bEndBreak.setGoToPage(pageCommon);

  // === 建立 Sheet 接資料 + 設定 onFormSubmit 觸發器 ===
  const ss = SpreadsheetApp.create(CONFIG.FORM_TITLE + ' - 回應');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
  ScriptApp.newTrigger('onFormSubmit')
           .forForm(form)
           .onFormSubmit()
           .create();

  // === 輸出資訊 ===
  const editUrl = form.getEditUrl();
  const publicUrl = form.getPublishedUrl();
  const embedUrl = publicUrl.replace('/viewform', '/viewform?embedded=true');
  const sheetUrl = ss.getUrl();

  Logger.log('======== 表單建立完成 ========');
  Logger.log('編輯網址(自己用):' + editUrl);
  Logger.log('公開填寫網址(放 LPage CTA):' + publicUrl);
  Logger.log('iframe 嵌入網址:' + embedUrl);
  Logger.log('Google Sheet 回應收集:' + sheetUrl);

  return { editUrl, publicUrl, embedUrl, sheetUrl };
}


/**
 * onFormSubmit 觸發器 — 收件分流 + 寄通知信給 Allen
 */
function onFormSubmit(e) {
  try {
    const responses = e.response.getItemResponses();
    const data = {};
    responses.forEach(r => { data[r.getItem().getTitle()] = r.getResponse(); });

    // 身分判別(從 1.4 「您的身分」題的答案開頭字母取)
    const identity = (data['您的身分'] || '').charAt(0);
    const tagMap = { 'A': '青年', 'B': '學校', 'C': '一般' };
    const tag = tagMap[identity] || '未分類';

    // 寄通知信給 Allen
    const subject = `[招生留資][${tag}] ${data['姓名'] || '匿名'} - ${data['您從哪裡得知本課程?'] || '未填來源'}`;
    const body = [
      '【新留資】2026 智慧物流班 · 招生說明會報名',
      '----------------------------------------',
      '身分分類:' + tag,
      '姓名:' + (data['姓名'] || ''),
      'Email:' + (data['Email'] || ''),
      '手機:' + (data['手機'] || ''),
      '地點:' + (data['居住 / 服務地點(縣市)'] || ''),
      '來源:' + (data['您從哪裡得知本課程?'] || ''),
      '',
      '說明會出席:' + (data['Q1 · 是否參加 2026/06/12(五)12:10–13:00 線上說明會?'] || ''),
      '同意收後續資訊:' + (data['Q2 · 是否同意接收後續招生資訊、簡章、開課通知?'] || ''),
      '加入諮詢社群:' + (data['Q3 · 是否加入「課程諮詢社群」?'] || ''),
      '備註:' + (data['Q4 · 其他備註(選填)'] || ''),
      '',
      '----------------------------------------',
      '完整資料請看 Google Sheet。',
      'LPage:' + CONFIG.LPAGE_URL
    ].join('\n');

    MailApp.sendEmail(CONFIG.NOTIFY_EMAILS.join(','), subject, body);

    // 自動分流到對應分頁(青年/學校/一般)
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const mainSheet = ss.getSheets()[0];
    let subSheet = ss.getSheetByName(tag);
    if (!subSheet) {
      subSheet = ss.insertSheet(tag);
      subSheet.appendRow(mainSheet.getRange(1, 1, 1, mainSheet.getLastColumn()).getValues()[0]);
    }
    const lastRow = mainSheet.getLastRow();
    const rowValues = mainSheet.getRange(lastRow, 1, 1, mainSheet.getLastColumn()).getValues()[0];
    subSheet.appendRow(rowValues);

  } catch (err) {
    Logger.log('onFormSubmit error: ' + err);
    MailApp.sendEmail(CONFIG.ERROR_NOTIFY_EMAIL,
      '[招生表單錯誤] onFormSubmit 失敗', err.toString());
  }
}
