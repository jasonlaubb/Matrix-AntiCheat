@echo off
echo ===== Matrix AntiCheat Developer Version =====
echo Hello, %USERNAME%:
echo This AntiCheat was made by jasonlaubb and Matrix AntiCheat Develop Team.
echo This is the development project setup tool for node.
echo GitHub Link: https://github.com/jasonlaubb/Matrix-AntiCheat
echo ===== Matrix AntiCheat Developer Version =====
echo Continuing: Are you sure you want to setup Matrix AntiCheat?
echo Warning: Node.js is required
timeout /t 1 /nobreak >nul
pause
call npm install --prefix ./src
call npm install
if exist "%~dp0\ac_BP\src\node_modules\matrix-anticheat" rmdir /S /Q "%~dp0\ac_BP\src\node_modules\matrix-anticheat"
:: if exist "%~dp0\ac_RP\scripts\AUTO_GENERATED" del /F "%~dp0\ac_RP\scripts\AUTO_GENERATED"
if not exist "%~dp0\ac_BP\scripts" mkdir "%~dp0\ac_BP\scripts"
call tsc --build tsconfig.json
:: Copy node_modules
Xcopy "%~dp0\ac_BP\src\node_modules" "%~dp0\ac_BP\scripts\node_modules" /Y /E /H /C /I
echo Result: Sucessfully setup or reload the packages
echo ===== Matrix AntiCheat Developer Version =====
echo Hello, %USERNAME%:
echo This AntiCheat was made by jasonlaubb and Matrix AntiCheat Develop Team.
echo This is the development project setup tool for node.
echo GitHub Link: https://github.com/jasonlaubb/Matrix-AntiCheat
echo ===== Matrix AntiCheat Developer Version =====
echo Continuing: Would you like to generate a runable package?
echo Warning: The generated package is under AGPL 3.0 License
pause
if not exist "%~dp0\generated-package" mkdir "%~dp0\generated-package"
if not exist "%~dp0\generated-package\Matrix-anti_BP" mkdir "%~dp0\generated-package\Matrix-anti_BP"
if not exist "%~dp0\generated-package\Matrix-anti_RP" mkdir "%~dp0\generated-package\Matrix-anti_RP"
Xcopy "%~dp0\ac_BP\scripts" "%~dp0\generated-package\Matrix-anti_BP\scripts" /Y /E /C /I
Xcopy "%~dp0\ac_BP\animations" "%~dp0\generated-package\Matrix-anti_BP\animations" /Y /E /C /I
Xcopy "%~dp0\ac_BP\functions" "%~dp0\generated-package\Matrix-anti_BP\functions" /Y /E /C /I
Xcopy "%~dp0\ac_BP\animation_controllers" "%~dp0\generated-package\Matrix-anti_BP\animation_controllers" /Y /E /C /I
Xcopy "%~dp0\ac_BP\entities" "%~dp0\generated-package\Matrix-anti_BP\entities" /Y /E /C /I
copy /Y "%~dp0\ac_BP\pack_icon.png" "%~dp0\generated-package\Matrix-anti_BP"
copy /Y "%~dp0\ac_BP\manifest.json" "%~dp0\generated-package\Matrix-anti_BP"
copy /Y "%~dp0\LICENSE" "%~dp0\generated-package\LICENSE"
if not exist "%~dp0\generated-package\texts" mkdir "%~dp0\generated-package\texts"
:: copy /Y "%~dp0\texts\*.lang" "%~dp0\generated-package\texts"
echo Result: Sucessfully generate a new runable package
echo ===== Matrix AntiCheat Developer Version =====
echo Hello, %USERNAME%:
echo This AntiCheat was made by jasonlaubb and Matrix AntiCheat Develop Team.
echo This is the development project setup tool for node.
echo GitHub Link: https://github.com/jasonlaubb/Matrix-AntiCheat
echo ===== Matrix AntiCheat Developer Version =====
echo Thanks for using our anticheat, %USERNAME%
timeout /t 1 /nobreak >nul
pause