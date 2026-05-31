# ML_W15_W18 — 機器學習視覺化整合單元 教材生成工具包

> 課程：《機器學習》W15-W18 視覺化整合段落
> 適用對象：智工系二年級
> 講師：陳志騰 (Allen)、吳佩蓉

本目錄包含 W15-W18 四週的教材生成程式，**檔名一律以 `W15_` / `W16_` / `W17_` / `W18_` 為前綴**，方便辨識週次。

> 📌 **講義改為 HTML 格式**（取代原本的 PDF）：HTML 在 Windows 上中文字型直接由瀏覽器處理、版面 RWD 自適應、學員雙擊即開；列印時用瀏覽器 Ctrl+P 轉 PDF 品質遠勝 WeasyPrint。原 `W15_build_pdf.py` 仍保留為備用，但**主推 `W15_build_html.py`**。

## 📁 目錄結構

```
ML_W15_W18/
├── README.md
├── requirements.txt              # Python 套件
├── package.json                  # Node 套件 (pptxgenjs)
├── templates/
│   └── pptx_template.js          # 共用 PPTX 版型 (Allen 設計系統)
│
├── W15_build_html.py                 # ✅ W15 講義 HTML
├── W15_build_pdf.py                  # W15 講義 PDF (備用)
├── W15_build_pptx.js                 # ✅ W15 簡報 PPTX (28 張)
├── W15_demo_visualization_cells.py   # ✅ W15 課堂示範 cells (4 PNG)
│
├── W16_build_html.py                 # ✅ W16 講義 HTML
├── W16_build_pptx.js                 # ✅ W16 簡報 PPTX (26 張)
├── W16_demo_pca_tsne_cells.py        # ✅ W16 課堂示範 cells (4 PNG)
│
├── W17_build_html.py                 # ✅ W17 講義 HTML
├── W17_build_pptx.js                 # ✅ W17 簡報 PPTX (26 張)
├── W17_demo_storytelling_cells.py    # ✅ W17 課堂示範 cells (4 PNG)
│
├── final_exam_practical_brief.md     # ✅ W18 期末考題本 (含監考流程)
├── final_exam_template.md            # ✅ W18 學員可直接套用範本
│
└── output/                           # 產出資料夾
    ├── W15_handout.html              # ✅ W15 講義
    ├── W15_slides.pptx               # ✅ W15 簡報
    ├── W15_demo/*.png                # ✅ W15 4 張示範圖
    ├── W16_handout.html              # ✅ W16 講義
    ├── W16_slides.pptx               # ✅ W16 簡報
    ├── W16_demo/*.png                # ✅ W16 4 張示範圖
    ├── W17_handout.html              # ✅ W17 講義
    ├── W17_slides.pptx               # ✅ W17 簡報
    └── W17_demo/*.png                # ✅ W17 4 張示範圖
```

---

## 🛠️ 一次性安裝

### Python 端（WeasyPrint + sklearn 視覺化）

```bash
cd D:\AI_Code\Allen_Courses\ML_W15_W18
pip install -r requirements.txt
```

**Windows 端額外步驟**：WeasyPrint 需要 GTK runtime。請至 [GTK for Windows Runtime Environment Installer](https://github.com/tschoonj/GTK-for-Windows-Runtime-Environment-Installer/releases) 下載最新 release 安裝。安裝後重啟 VS Code。

### Node.js 端（pptxgenjs）

```bash
cd D:\AI_Code\Allen_Courses\ML_W15_W18
npm install
```

---

## 📋 各週執行順序（固定 3 步驟）

### W15-W17 統一流程（每週都這 3 步驟）

```bash
# 步驟 1:先跑示範程式產出 4 張 demo PNG
python W15_demo_visualization_cells.py        # W15
python W16_demo_pca_tsne_cells.py             # W16
python W17_demo_storytelling_cells.py         # W17

# 步驟 2:產出講義 HTML(雙擊即開)
python W15_build_html.py
python W16_build_html.py
python W17_build_html.py

# 步驟 3:產出簡報 PPTX
node W15_build_pptx.js
node W16_build_pptx.js
node W17_build_pptx.js
```

### 一鍵全跑（推薦在 VS Code 終端機）

```bash
# Windows PowerShell
python W15_demo_visualization_cells.py; python W15_build_html.py; node W15_build_pptx.js
python W16_demo_pca_tsne_cells.py;       python W16_build_html.py; node W16_build_pptx.js
python W17_demo_storytelling_cells.py;   python W17_build_html.py; node W17_build_pptx.js
```

### W18 期末考

不需要程式產出，直接用 `final_exam_practical_brief.md` 與 `final_exam_template.md`。
這兩份檔案在 W17 第二堂發布到 TronClass。

### (備用) PDF 講義

若特別需要 PDF（需 GTK runtime）：`python W15_build_pdf.py`

---

## 🎨 Allen 設計系統色票（程式碼內共用）

| 色票名 | HEX | 用途 |
|---|---|---|
| primary (burnt sienna) | `#E76F51` | CTA、警示、未達標、章節主視覺 |
| secondary (persian green) | `#2A9D8F` | 達標、持續、次要訊息 |
| accent (saffron) | `#E9C46A` | 高亮、第三類 |
| textDark (charcoal) | `#264653` | 主文字 |

PDF / PPTX / matplotlib 三邊**共用同一套色票**——學員看到的視覺一致。

---

## ⚠️ 常見問題

**Q：WeasyPrint 在 Windows 報錯 `cannot load library 'libgobject-2.0-0'`？**
A：未安裝 GTK runtime。請依「一次性安裝」中的步驟下載並安裝。

**Q：PPTX 字型沒套上（變細明體）？**
A：確認你的 Windows 有「微軟正黑體」（預設應有）。Mac 用戶會自動 fallback 到 Heiti TC。

**Q：demo 跑出來圖開不起來？**
A：在 VS Code 安裝 **Python + Jupyter** 擴充功能，並使用 `Run Cell` 按鈕逐 cell 執行。
