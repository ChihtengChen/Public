#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""彙整 W15~W17 講義 (HTML) + 三份期末考文件 (MD) → 單一自包含 ML_DataVis.html

圖庫圖片以 base64 內嵌,產出單一可獨立發布的網頁。
"""
import base64
import re
from pathlib import Path

import markdown

ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / "output"
DEST = ROOT / "ML_DataVis.html"

# ---------------------------------------------------------------------------
# 1. 取出共用 CSS(來自 W15 講義的 <style> 區塊)
# ---------------------------------------------------------------------------
w15_html = (OUTPUT / "W15_handout.html").read_text(encoding="utf-8")
style_match = re.search(r"<style>(.*?)</style>", w15_html, re.S)
base_css = style_match.group(1)


def extract_body(path: Path) -> str:
    html = path.read_text(encoding="utf-8")
    m = re.search(r"<body>(.*?)</body>", html, re.S)
    return m.group(1).strip()


def embed_images(body: str) -> str:
    """把 <img src="W1x_demo/xxx.png"> 換成 base64 data URI(檔案位於 output/)。"""

    def repl(match: re.Match) -> str:
        src = match.group(1)
        img_path = OUTPUT / src
        if not img_path.exists():
            return match.group(0)
        data = base64.b64encode(img_path.read_bytes()).decode("ascii")
        return f'src="data:image/png;base64,{data}"'

    return re.sub(r'src="([^"]+\.png)"', repl, body)


def strip_local_anchors(body: str) -> str:
    """把指向本機檔案(非 http)的 <a> 連結轉成純文字,避免單檔網頁出現失效連結。"""

    def repl(match: re.Match) -> str:
        href = match.group(1)
        inner = match.group(2)
        if href.startswith("http"):
            return match.group(0)
        return f'<span class="ref">{inner}</span>'

    return re.sub(r'<a\s+href="([^"]+)"[^>]*>(.*?)</a>', repl, body, flags=re.S)


def prep_handout(path: Path) -> str:
    return strip_local_anchors(embed_images(extract_body(path)))


# ---------------------------------------------------------------------------
# 2. Markdown → HTML
# ---------------------------------------------------------------------------
def md_to_html(path: Path) -> str:
    text = path.read_text(encoding="utf-8")
    # 勾選框 → 符號(避免渲染成字面 [ ])
    text = re.sub(r"^(\s*)- \[ \] ", r"\1- ☐ ", text, flags=re.M)
    text = re.sub(r"^(\s*)- \[[xX]\] ", r"\1- ☑ ", text, flags=re.M)
    html = markdown.markdown(
        text,
        extensions=["tables", "fenced_code", "sane_lists", "nl2br"],
    )
    return f'<div class="md-body">{html}</div>'


# ---------------------------------------------------------------------------
# 3. 組裝
# ---------------------------------------------------------------------------
w15 = prep_handout(OUTPUT / "W15_handout.html")
w16 = prep_handout(OUTPUT / "W16_handout.html")
w17 = prep_handout(OUTPUT / "W17_handout.html")

brief = md_to_html(ROOT / "final_exam_practical_brief.md")
template = md_to_html(ROOT / "final_exam_template.md")
precheck = md_to_html(ROOT / "final_exam_pre_check.md")

extra_css = """
/* === 整合頁面外框與導覽 === */
html { scroll-behavior: smooth; }
body { max-width: 960px; padding-top: 0; }
.site-cover {
  background: linear-gradient(135deg, #264653 0%, #2A9D8F 100%);
  color: #fff;
  border-radius: 4px;
  padding: 34px 36px 30px;
  margin: 18px 0 0;
}
.site-cover .kicker { font-size: 13px; letter-spacing: .22em; opacity: .85; text-transform: uppercase; }
.site-cover h1 { font-size: 30px; margin: 8px 0 6px; color: #fff; line-height: 1.3; }
.site-cover .sub { font-size: 15px; opacity: .92; line-height: 1.7; }
.site-cover .meta { font-size: 13px; opacity: .8; margin-top: 12px; }
.site-nav {
  position: sticky; top: 0; z-index: 50;
  background: rgba(255,255,255,.96);
  backdrop-filter: blur(6px);
  border-bottom: 1.5px solid #E76F51;
  margin: 0 0 8px; padding: 9px 0;
  display: flex; flex-wrap: wrap; gap: 6px 8px;
}
.site-nav a {
  font-size: 13px; padding: 4px 11px; border-radius: 999px;
  border: 1px solid #D9D9D9; color: #264653; background: #fff;
  text-decoration: none; white-space: nowrap;
}
.site-nav a:hover { background: #E76F51; color: #fff; border-color: #E76F51; }
.doc-section { scroll-margin-top: 56px; }
.doc-divider {
  margin: 30px 0 4px; padding: 6px 0 4px;
  border-top: 2px dashed #E9C46A; font-size: 12px; color: #587D80; letter-spacing: .1em;
}
.ref { color: #587D80; font-weight: 600; border-bottom: 1px dotted #B7C4C4; }
.to-top {
  position: fixed; right: 18px; bottom: 18px; z-index: 60;
  background: #E76F51; color: #fff; text-decoration: none;
  width: 42px; height: 42px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; box-shadow: 0 2px 8px rgba(0,0,0,.18);
}

/* === Markdown 文件樣式 === */
.md-body { font-size: 14.5px; line-height: 1.75; color: #264653; }
.md-body h1 { font-size: 23px; color: #E76F51; border-bottom: 2px solid #E76F51; padding-bottom: 6px; margin: 4px 0 14px; }
.md-body h2 { font-size: 18px; color: #fff; background: #264653; padding: 6px 12px; border-radius: 3px; margin: 26px 0 12px; }
.md-body h3 { font-size: 16px; color: #264653; border-left: 4px solid #E76F51; padding-left: 9px; margin: 20px 0 9px; }
.md-body h4 { font-size: 14.5px; color: #2A9D8F; margin: 16px 0 7px; }
.md-body table { border-collapse: collapse; width: 100%; font-size: 13px; margin: 10px 0 16px; }
.md-body th { background: #264653; color: #fff; padding: 7px 9px; text-align: left; }
.md-body td { border: 1px solid #E0DACE; padding: 6px 9px; vertical-align: top; }
.md-body tr:nth-child(even) td { background: #FDFAF6; }
.md-body blockquote {
  background: #F0F9F8; border-left: 4px solid #2A9D8F;
  margin: 12px 0; padding: 8px 14px; color: #264653; border-radius: 0 3px 3px 0;
}
.md-body blockquote p { margin: 4px 0; }
.md-body code { background: #FDF2EE; color: #C0492B; padding: 1px 5px; border-radius: 3px; font-size: 13px; }
.md-body pre {
  background: #2B2B2B; color: #F0F0F0; padding: 13px 16px; border-radius: 5px;
  overflow-x: auto; font-size: 12.5px; line-height: 1.55; margin: 10px 0 16px;
}
.md-body pre code { background: none; color: inherit; padding: 0; }
.md-body ul, .md-body ol { padding-left: 22px; }
.md-body li { margin: 3px 0; }
.md-body hr { border: none; border-top: 1px dashed #D9D9D9; margin: 22px 0; }
.md-body strong { color: #C0492B; }
.md-body em { color: #587D80; }

@media (max-width: 640px) {
  body { padding: 12px 14px; }
  .site-cover { padding: 22px 18px; }
  .site-cover h1 { font-size: 23px; }
}
"""

nav_items = [
    ("w15", "W15 視覺化語彙"),
    ("w16", "W16 維度模型"),
    ("w17", "W17 數據敘事"),
    ("brief", "期末考題本"),
    ("template", "Notebook 範本"),
    ("precheck", "考前自查"),
]
nav_html = "\n".join(f'  <a href="#{i}">{label}</a>' for i, label in nav_items)


def section(_id: str, divider: str, content: str) -> str:
    return (
        f'<div class="doc-divider">{divider}</div>\n'
        f'<section id="{_id}" class="doc-section">\n{content}\n</section>'
    )


page = f"""<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ML 資料視覺化與敘事 (W15–W17) + W18 期末考｜機器學習</title>
<meta name="author" content="陳志騰(Allen)、吳佩蓉">
<meta name="description" content="《機器學習》智工系二年級 W15–W17 視覺化與數據敘事三週講義,以及 W18 期末考題本、Notebook 範本與考前自查清單的整合單頁。">
<style>
{base_css}
{extra_css}
</style>
</head>
<body>

<div class="site-cover">
  <div class="kicker">機器學習 ｜ 智工系二年級 ｜ 視覺化與數據敘事段落</div>
  <h1>ML 資料視覺化與敘事整合講義</h1>
  <div class="sub">W15 視覺化語彙 → W16 維度模型(降維)→ W17 數據敘事,串成「讓主管下決定的故事」;
  並附 W18 期末考題本、Notebook 範本與考前自查清單。</div>
  <div class="meta">講師:陳志騰(Allen)、吳佩蓉 ｜ 對齊 Unit 9 整合設計與數據敘事 ｜ 單一自包含網頁(圖片已內嵌)</div>
</div>

<nav class="site-nav">
{nav_html}
</nav>

{section("w15", "第一部分 ｜ W15 學員講義", w15)}
{section("w16", "第二部分 ｜ W16 學員講義", w16)}
{section("w17", "第三部分 ｜ W17 學員講義", w17)}
{section("brief", "第四部分 ｜ W18 期末考完整說明(題本)", brief)}
{section("template", "第五部分 ｜ W18 期末考 Notebook 與簡報範本", template)}
{section("precheck", "第六部分 ｜ W18 期末考考前自查清單", precheck)}

<div class="footer-note" style="margin-top:36px;">
  <strong>ML_DataVis.html</strong> ｜ 整合自 W15/W16/W17 講義與 W18 期末考三份文件
  ｜ 講師 陳志騰(Allen)、吳佩蓉 ｜ <em>單一自包含網頁,圖庫圖片已內嵌 base64</em>
</div>

<a class="to-top" href="#" title="回到頂端">↑</a>

</body>
</html>
"""

DEST.write_text(page, encoding="utf-8")
size_mb = DEST.stat().st_size / 1024 / 1024
print(f"OK: {DEST}  ({size_mb:.2f} MB)")
