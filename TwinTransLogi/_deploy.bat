@echo off
REM ============================================================
REM TwinTransLogi deploy script - push from local to GitHub Pages
REM Double-click to run, or run from terminal in
REM D:\AI_Code\Public\TwinTransLogi\
REM ============================================================
echo.
echo === TwinTransLogi Deploy ===
echo.

cd /D D:\AI_Code\Public

REM Remove stale lock if present
if exist .git\index.lock (
  echo [INFO] Removing stale .git\index.lock
  del /F .git\index.lock
)

echo [STEP 1/4] git add TwinTransLogi/
git add TwinTransLogi/
if errorlevel 1 goto :error

echo.
echo [STEP 2/4] git status (verify only TwinTransLogi is staged)
git status --short

echo.
echo [STEP 3/4] git commit
git commit -m "Add TwinTransLogi interactive book preview site"
if errorlevel 1 goto :error

echo.
echo [STEP 4/4] git push origin main
git push origin main
if errorlevel 1 goto :error

echo.
echo === Deploy succeeded ===
echo Live URL (after GitHub Pages is enabled):
echo   https://chihtengchen.github.io/Public/TwinTransLogi/
echo.
echo If this is the first deploy, go to GitHub Repo Settings ^> Pages:
echo   Source: Deploy from branch
echo   Branch: main / root
echo.
pause
exit /b 0

:error
echo.
echo === Deploy failed ===
echo Check error messages above.
pause
exit /b 1
