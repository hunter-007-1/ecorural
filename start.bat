@echo off
chcp 65001 >nul
echo ========================================
echo   乡村碳足迹 (EcoRural) 启动脚本
echo ========================================
echo.

:: 检查 Node.js 是否安装
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Node.js，请先安装 Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

echo [信息] 检测到 Node.js 版本:
node --version
echo.

:: 检查 node_modules 是否存在
if not exist "node_modules" (
    echo [信息] 检测到未安装依赖，正在安装...
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo [错误] 依赖安装失败
        pause
        exit /b 1
    )
    echo.
    echo [成功] 依赖安装完成
    echo.
) else (
    echo [信息] 依赖已存在，跳过安装步骤
    echo.
)

:: 启动开发服务器
echo [信息] 正在启动开发服务器...
echo [信息] 服务器地址: http://localhost:3000
echo [信息] 按 Ctrl+C 停止服务器
echo.
echo ========================================
echo.

call npm run dev

pause



