@echo off
echo ========================================
echo  EcoRural 网站部署脚本
echo ========================================
echo.

echo [1/2] 启动本地服务器...
start "EcoRural Server" cmd /c "npm start"

echo.
echo [2/2] 启动公网映射...
echo 请访问下方生成的链接访问网站
echo.
lt --port 3000

echo.
pause
