// pptx_template.js — Allen 課程簡報共用版型
//
// 設計基準:
// - 版型 LAYOUT_WIDE(13.333" × 7.5"),配合多數投影機 + Zoom 直播
// - 配色:活力面對挑戰調(burnt sienna / persian green / saffron / charcoal)
// - 字型:微軟正黑體(Windows)/ Heiti TC (Mac)
//
// 沿用注意:每份 PPTX 各自一份獨立腳本(build_pptx_W*.js),
// 共用版型透過 require('./templates/pptx_template.js')

const PALETTE = {
  primary: "E76F51",      // burnt sienna - 行動、警示、主視覺
  secondary: "2A9D8F",    // persian green - 持續、達標、次要訊息
  accent: "E9C46A",       // saffron - 高亮、成就
  voteAccent: "F4A261",   // sandy brown - 互動投票配色
  textDark: "264653",     // charcoal - 主文字
  textMuted: "587D80",    // slate - 副文字
  textWhite: "FFFFFF",
  textGold: "FFD27A",     // 反白配色
  bgWhite: "FFFFFF",
  bgSoft: "FDFAF6",
  bgDark: "264653",
  bgPrimaryLight: "FBE7E0",
  border: "D9D9D9",
  borderDark: "8A8A8A",
};

const FONT = {
  primary: "微軟正黑體",
  mono: "Consolas",
};

const LAYOUT = {
  name: "LAYOUT_WIDE",
  width: 13.333,
  height: 7.5,
};

const SIZE = {
  coverTitle: 44,
  coverSubtitle: 20,
  sectionDivider: 36,
  slideTitle: 30,
  slideSubtitle: 18,
  body: 18,
  bodySmall: 15,
  caption: 13,
  voteOption: 40,
  voteNumber: 60,
  metaSmall: 11,
};

// === 課程脈絡(W15 智工系機器學習) ===
const COURSE = {
  organizer: "智工系二年級 ｜《機器學習》課程",
  fullTitle: "機器學習 W15-W18 視覺化整合單元",
  instructorLine: "陳志騰(Allen)、吳佩蓉 ｜ 智慧工程學系",
};

// === 共用版面元素 =============================================================

function addFooter(slide, pageNum, totalPages) {
  slide.addShape("line", {
    x: 0.5, y: 7.10, w: 12.333, h: 0,
    line: { color: PALETTE.border, width: 0.5 },
  });
  slide.addText(
    `${COURSE.organizer} ｜ ${COURSE.instructorLine}`,
    {
      x: 0.5, y: 7.18, w: 9, h: 0.25,
      fontSize: SIZE.metaSmall, fontFace: FONT.primary,
      color: PALETTE.textMuted, align: "left", valign: "middle",
    }
  );
  if (pageNum != null) {
    slide.addText(`${pageNum} / ${totalPages}`, {
      x: 11.5, y: 7.18, w: 1.333, h: 0.25,
      fontSize: SIZE.metaSmall, fontFace: FONT.primary,
      color: PALETTE.textMuted, align: "right", valign: "middle",
    });
  }
}

function addSlideTitle(slide, title, subtitle = null) {
  slide.addShape("rect", {
    x: 0.5, y: 0.4, w: 0.12, h: 0.65,
    fill: { color: PALETTE.primary }, line: { color: PALETTE.primary },
  });
  slide.addText(title, {
    x: 0.75, y: 0.35, w: 11.5, h: 0.5,
    fontSize: SIZE.slideTitle, fontFace: FONT.primary,
    bold: true, color: PALETTE.textDark, align: "left", valign: "middle",
    margin: 0,
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.75, y: 0.85, w: 11.5, h: 0.55,
      fontSize: SIZE.slideSubtitle, fontFace: FONT.primary,
      color: PALETTE.textMuted, align: "left", valign: "top",
      margin: 0,
    });
  }
}

// === 通用 slide 模板 =========================================================

function addCoverSlide(pres, opts) {
  const slide = pres.addSlide();
  slide.background = { color: PALETTE.bgDark };

  slide.addShape("rect", {
    x: 0, y: 0, w: 13.333, h: 0.4,
    fill: { color: PALETTE.primary }, line: { color: PALETTE.primary },
  });
  slide.addShape("rect", {
    x: 0, y: 7.1, w: 13.333, h: 0.4,
    fill: { color: PALETTE.accent }, line: { color: PALETTE.accent },
  });

  slide.addText(COURSE.organizer, {
    x: 0.7, y: 0.7, w: 12, h: 0.35,
    fontSize: 11, fontFace: FONT.primary,
    color: PALETTE.textGold, align: "left",
  });
  slide.addText(COURSE.fullTitle, {
    x: 0.7, y: 1.1, w: 12, h: 0.4,
    fontSize: 14, fontFace: FONT.primary,
    color: PALETTE.textWhite, align: "left",
  });

  slide.addText(opts.dayTag, {
    x: 0.7, y: 2.0, w: 6, h: 0.5,
    fontSize: 18, fontFace: FONT.primary, bold: true,
    color: PALETTE.accent, align: "left",
  });

  slide.addText(opts.unitTitle, {
    x: 0.7, y: 2.55, w: 12, h: 1.5,
    fontSize: SIZE.coverTitle, fontFace: FONT.primary, bold: true,
    color: PALETTE.textWhite, align: "left", valign: "top",
  });

  if (opts.unitSubtitle) {
    slide.addText(opts.unitSubtitle, {
      x: 0.7, y: 4.4, w: 12, h: 0.6,
      fontSize: SIZE.coverSubtitle, fontFace: FONT.primary,
      color: PALETTE.textGold, align: "left",
    });
  }

  slide.addText(COURSE.instructorLine, {
    x: 0.7, y: 6.0, w: 12, h: 0.4,
    fontSize: 13, fontFace: FONT.primary,
    color: PALETTE.textWhite, align: "left",
  });
  slide.addText(opts.dateTimeStr, {
    x: 0.7, y: 6.4, w: 12, h: 0.35,
    fontSize: 11, fontFace: FONT.primary,
    color: PALETTE.textMuted, align: "left",
  });
  return slide;
}

function addSectionDivider(pres, opts, pageNum, totalPages) {
  const slide = pres.addSlide();
  slide.background = { color: PALETTE.bgPrimaryLight };

  slide.addText(opts.sectionMark, {
    x: 0.5, y: 1.5, w: 5, h: 3,
    fontSize: 180, fontFace: FONT.primary, bold: true,
    color: PALETTE.primary, align: "left", valign: "middle",
    transparency: 30,
  });

  slide.addText(opts.title, {
    x: 5.5, y: 2.3, w: 7.3, h: 1.8,
    fontSize: SIZE.sectionDivider, fontFace: FONT.primary, bold: true,
    color: PALETTE.textDark, align: "left", valign: "top",
  });
  if (opts.subtitle) {
    slide.addText(opts.subtitle, {
      x: 5.5, y: 4.2, w: 7.3, h: 0.8,
      fontSize: 18, fontFace: FONT.primary,
      color: PALETTE.textMuted, align: "left", valign: "top",
    });
  }
  if (opts.timeRange) {
    slide.addText(opts.timeRange, {
      x: 5.5, y: 5.1, w: 7.3, h: 0.5,
      fontSize: 14, fontFace: FONT.primary, italic: true,
      color: PALETTE.secondary, align: "left",
    });
  }
  addFooter(slide, pageNum, totalPages);
  return slide;
}

function addContentSlide(pres, opts, pageNum, totalPages) {
  const slide = pres.addSlide();
  slide.background = { color: PALETTE.bgWhite };
  addSlideTitle(slide, opts.title, opts.subtitle);
  if (opts.body) opts.body(slide);
  addFooter(slide, pageNum, totalPages);
  return slide;
}

function addVoteSlide(pres, opts, pageNum, totalPages) {
  const slide = pres.addSlide();
  slide.background = { color: PALETTE.bgSoft };

  slide.addText("AI 鷹架輔助", {
    x: 0.5, y: 0.4, w: 2.0, h: 0.4,
    fontSize: 13, fontFace: FONT.primary, bold: true,
    color: PALETTE.textWhite, align: "center", valign: "middle",
    fill: { color: PALETTE.voteAccent }, margin: 0,
  });

  slide.addText(opts.title, {
    x: 2.7, y: 0.4, w: 10.2, h: 0.5,
    fontSize: SIZE.slideTitle - 4, fontFace: FONT.primary, bold: true,
    color: PALETTE.textDark, align: "left", valign: "middle",
    margin: 0,
  });

  if (opts.prompt) {
    slide.addText(opts.prompt, {
      x: 0.5, y: 1.05, w: 12.333, h: 0.5,
      fontSize: 14, fontFace: FONT.primary, italic: true,
      color: PALETTE.textMuted, align: "left",
    });
  }

  const optsCount = opts.options.length;
  const totalWidth = 12.333;
  const gap = 0.25;
  const cardW = (totalWidth - gap * (optsCount - 1)) / optsCount;
  const cardY = 1.85, cardH = 3.6;

  opts.options.forEach((o, i) => {
    const cx = 0.5 + i * (cardW + gap);
    slide.addShape("rect", {
      x: cx, y: cardY, w: cardW, h: cardH,
      fill: { color: PALETTE.bgWhite },
      line: { color: PALETTE.border, width: 1 },
    });
    slide.addShape("rect", {
      x: cx, y: cardY, w: cardW, h: 0.15,
      fill: { color: PALETTE.primary }, line: { color: PALETTE.primary },
    });
    slide.addText(o.key, {
      x: cx, y: cardY + 0.3, w: cardW, h: 1.4,
      fontSize: SIZE.voteNumber, fontFace: FONT.primary, bold: true,
      color: PALETTE.primary, align: "center", valign: "middle",
    });
    slide.addText(o.label, {
      x: cx + 0.2, y: cardY + 1.7, w: cardW - 0.4, h: 0.7,
      fontSize: 18, fontFace: FONT.primary, bold: true,
      color: PALETTE.textDark, align: "center", valign: "top",
    });
    if (o.desc) {
      slide.addText(o.desc, {
        x: cx + 0.2, y: cardY + 2.4, w: cardW - 0.4, h: 1.1,
        fontSize: opts.descFontSize || 12, fontFace: FONT.primary,
        color: PALETTE.textMuted, align: "center", valign: "top",
      });
    }
  });

  if (opts.inputHint) {
    slide.addText(`📝 ${opts.inputHint}`, {
      x: 0.5, y: 5.7, w: 12.333, h: 0.4,
      fontSize: 14, fontFace: FONT.primary, bold: true,
      color: PALETTE.secondary, align: "left",
    });
  }
  if (opts.afterAction) {
    slide.addText(`👉 ${opts.afterAction}`, {
      x: 0.5, y: 6.15, w: 12.333, h: 0.4,
      fontSize: 12, fontFace: FONT.primary, italic: true,
      color: PALETTE.textMuted, align: "left",
    });
  }

  addFooter(slide, pageNum, totalPages);
  return slide;
}

// === 通用 body 元件 =========================================================

function bodyTwoCol(slide, leftOpts, rightOpts) {
  slide.addText(leftOpts.title || "", {
    x: 0.7, y: 1.4, w: 5.7, h: 0.4,
    fontSize: 17, fontFace: FONT.primary, bold: true,
    color: PALETTE.primary, align: "left",
  });
  slide.addText(leftOpts.body || "", {
    x: 0.7, y: 1.85, w: 5.7, h: 5.0,
    fontSize: SIZE.body, fontFace: FONT.primary,
    color: PALETTE.textDark, align: "left", valign: "top",
    paraSpaceAfter: 8,
  });
  slide.addText(rightOpts.title || "", {
    x: 6.9, y: 1.4, w: 5.7, h: 0.4,
    fontSize: 17, fontFace: FONT.primary, bold: true,
    color: PALETTE.secondary, align: "left",
  });
  slide.addText(rightOpts.body || "", {
    x: 6.9, y: 1.85, w: 5.7, h: 5.0,
    fontSize: SIZE.body, fontFace: FONT.primary,
    color: PALETTE.textDark, align: "left", valign: "top",
    paraSpaceAfter: 8,
  });
}

function bodyTable(slide, rows, opts = {}) {
  const x = opts.x || 0.7;
  const y = opts.y || 1.5;
  const w = opts.w || 11.9;
  const colW = opts.colW;
  const rowH = opts.rowH || 0.55;
  const headerFontSize = opts.headerFontSize || 17;
  const bodyFontSize = opts.fontSize || 16;

  const tableData = rows.map((row, ri) => {
    return row.map((cell) => {
      if (ri === 0) {
        return {
          text: typeof cell === "string" ? cell : cell.text || "",
          options: {
            bold: true, color: PALETTE.textWhite, fontSize: headerFontSize,
            fontFace: FONT.primary,
            fill: { color: PALETTE.textDark },
            valign: "middle", align: "left",
          },
        };
      } else {
        return {
          text: typeof cell === "string" ? cell : cell.text || "",
          options: {
            color: PALETTE.textDark, fontSize: bodyFontSize,
            fontFace: FONT.primary,
            fill: { color: ri % 2 === 0 ? PALETTE.bgSoft : PALETTE.bgWhite },
            valign: "middle", align: "left",
            ...(typeof cell === "object" ? cell.options || {} : {}),
          },
        };
      }
    });
  });

  slide.addTable(tableData, {
    x, y, w,
    colW,
    rowH,
    border: { type: "solid", color: PALETTE.border, pt: 0.5 },
  });
}

function bodyCallout(slide, mainText, subText) {
  const calloutY = 5.55;
  const calloutH = subText ? 1.45 : 0.95;

  slide.addShape("rect", {
    x: 0.5, y: calloutY, w: 12.333, h: calloutH,
    fill: { color: PALETTE.bgPrimaryLight },
    line: { color: PALETTE.primary, width: 0 },
  });
  slide.addShape("rect", {
    x: 0.5, y: calloutY, w: 0.12, h: calloutH,
    fill: { color: PALETTE.primary },
    line: { color: PALETTE.primary, width: 0 },
  });

  slide.addText(mainText, {
    x: 0.85, y: calloutY + 0.1, w: 11.8, h: subText ? 0.7 : 0.75,
    fontSize: 19, fontFace: FONT.primary, bold: true,
    color: PALETTE.primary, align: "left", valign: "middle",
  });
  if (subText) {
    slide.addText(subText, {
      x: 0.85, y: calloutY + 0.85, w: 11.8, h: 0.55,
      fontSize: 15, fontFace: FONT.primary, italic: true,
      color: PALETTE.textDark, align: "left", valign: "middle",
    });
  }
}

function bodyBullets(slide, items, opts = {}) {
  const x = opts.x || 0.7;
  const y = opts.y || 1.4;
  const w = opts.w || 11.9;
  const h = opts.h || 5.5;
  const fontSize = opts.fontSize || SIZE.body;

  const richText = items.map((item, i) => {
    const isLast = i === items.length - 1;
    if (typeof item === "string") {
      return { text: item, options: { bullet: true, breakLine: !isLast } };
    } else {
      return {
        text: item.text,
        options: {
          bullet: true, breakLine: !isLast,
          bold: item.bold || false,
          color: item.color || PALETTE.textDark,
          indentLevel: item.indent || 0,
        },
      };
    }
  });

  slide.addText(richText, {
    x, y, w, h,
    fontSize, fontFace: FONT.primary,
    color: PALETTE.textDark, valign: "top",
    paraSpaceAfter: 10,
  });
}

module.exports = {
  PALETTE, FONT, LAYOUT, SIZE, COURSE,
  addFooter, addSlideTitle,
  addCoverSlide, addSectionDivider, addContentSlide, addVoteSlide,
  bodyTwoCol, bodyTable, bodyCallout, bodyBullets,
};
