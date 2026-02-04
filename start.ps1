# 乡村碳足迹 (EcoRural) 启动脚本 (PowerShell)
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  乡村碳足迹 (EcoRural) 启动脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查 Node.js 是否安装
try {
    $nodeVersion = node --version
    Write-Host "[信息] 检测到 Node.js 版本: $nodeVersion" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "[错误] 未检测到 Node.js，请先安装 Node.js" -ForegroundColor Red
    Write-Host "下载地址: https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "按 Enter 键退出"
    exit 1
}

# 检查 node_modules 是否存在
if (-not (Test-Path "node_modules")) {
    Write-Host "[信息] 检测到未安装依赖，正在安装..." -ForegroundColor Yellow
    Write-Host ""
    
    npm install
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[错误] 依赖安装失败" -ForegroundColor Red
        Read-Host "按 Enter 键退出"
        exit 1
    }
    
    Write-Host ""
    Write-Host "[成功] 依赖安装完成" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "[信息] 依赖已存在，跳过安装步骤" -ForegroundColor Green
    Write-Host ""
}

# 启动开发服务器
Write-Host "[信息] 正在启动开发服务器..." -ForegroundColor Yellow
Write-Host "[信息] 服务器地址: http://localhost:3000" -ForegroundColor Cyan
Write-Host "[信息] 按 Ctrl+C 停止服务器" -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

npm run dev



