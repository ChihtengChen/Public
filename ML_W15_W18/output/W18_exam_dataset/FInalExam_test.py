# %% [markdown]
# # 期末考環境檢查
# 逐一執行下列 cell,確認環境與資料就緒。

# %% 檢查項目 #1：套件 import 測試
import sys, sklearn, pandas, numpy, matplotlib, seaborn

print(f"Python: {sys.version.split()[0]}")
print(f"sklearn: {sklearn.__version__} (需 >= 1.0)")
print(f"pandas: {pandas.__version__} (需 >= 1.5)")
print(f"numpy: {numpy.__version__}")
print(f"matplotlib: {matplotlib.__version__}")
print(f"seaborn: {seaborn.__version__}")

# 任一套件 ImportError → 終端機執行：
#   pip install -U <套件名> --break-system-packages
