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
if exist "%~dp0\src\node_modules\matrix-anticheat" rmdir /S /Q "%~dp0\src\node_modules\matrix-anticheat"
if exist "%~dp0\scripts\AUTO_GENERATED" del /F "%~dp0\scripts\AUTO_GENERATED"
call node ./texts/.generator.js
if not exist "%~dp0\scripts" mkdir "%~dp0\scripts"
call tsc --build tsconfig.json
:: Copy node_modules
Xcopy "%~dp0\src\node_modules" "%~dp0\scripts\node_modules" /Y /E /H /C /I
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
Xcopy "%~dp0\scripts" "%~dp0\generated-package\scripts" /Y /E /C /I
Xcopy "%~dp0\animations" "%~dp0\generated-package\animations" /Y /E /C /I
Xcopy "%~dp0\functions" "%~dp0\generated-package\functions" /Y /E /C /I
Xcopy "%~dp0\animation_controllers" "%~dp0\generated-package\animation_controllers" /Y /E /C /I
Xcopy "%~dp0\entities" "%~dp0\generated-package\entities" /Y /E /C /I
copy /Y "%~dp0\pack_icon.png" "%~dp0\generated-package"
copy /Y "%~dp0\manifest.json" "%~dp0\generated-package"
copy /Y "%~dp0\LICENSE" "%~dp0\generated-package\LICENSE"
if not exist "%~dp0\generated-package\texts" mkdir "%~dp0\generated-package\texts"
copy /Y "%~dp0\texts\*.lang" "%~dp0\generated-package\texts"
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