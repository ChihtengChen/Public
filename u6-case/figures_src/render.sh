#!/usr/bin/env bash
# 用 Chrome 無頭模式把 figures_src/*.html 截圖成 PNG。
# 用法：bash render.sh <輸出資料夾> [檔名(不含副檔名)...]
#   bash render.sh ..              # 全部輸出到 u6-case/
#   bash render.sh /tmp/out 檔名    # 只輸出指定圖
set -e
cd "$(dirname "$0")"
OUT="${1:-..}"; shift || true
CHROME="/c/Program Files/Google/Chrome/Application/chrome.exe"
declare -A SIZE=(
  ["U6_學習地圖_U6五步連貫"]="1920,900"
  ["U6_生命週期階段圖_Cradle-to-Gate"]="1920,900"
  ["U6_廠區配置圖_中科扣件台中廠"]="1920,1200"
  ["U6_價值鏈地圖_中科扣件關係人"]="1920,1200"
  ["U6_六段製程圖_一顆螺絲的誕生"]="1920,1080"
)
NAMES=("$@"); [ ${#NAMES[@]} -eq 0 ] && NAMES=("${!SIZE[@]}")
mkdir -p "$OUT"
for n in "${NAMES[@]}"; do
  src="$(cygpath -w "$PWD/$n.html")"; dst="$(cygpath -w "$(cd "$OUT" && pwd)/$n.png")"
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --window-size="${SIZE[$n]}" --screenshot="$dst" "file:///${src//\\//}" >/dev/null 2>&1
  echo "rendered $n -> $dst"
done
