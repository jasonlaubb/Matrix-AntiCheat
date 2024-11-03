@echo off
echo Please check if you have installed NodeJS. It's required when building.
echo This anticheat project is under AGPL 3.0 license. Please follow it.
echo Github link: https://github.com/jasonlaubb/Matrix-AntiCheat
set /p user_input=Would you like to continue? (Y/N)
if /i "%user_input%" neq "Y" (
    echo Process ended.
    pause
    exit /b
)
: Install the node modules
call npm install -g typescript
call npm install
call npm install --prefix ./ac_BP/src
if exist "%~dp0ac_BP\src\node_modules\matrix-anticheat" rmdir /S /Q "%~dp0ac_BP\src\node_modules\matrix-anticheat"
: Build the javascript
if not exist "%~dp0ac_BP\scripts" mkdir "%~dp0ac_BP\scripts"
Xcopy "%~dp0ac_BP\src\node_modules" "%~dp0ac_BP\scripts\node_modules" /Y /E /H /C /I
call tsc --build
: Build the language
call node ./lang-handler.mjs
: Create the right folder for generate
if not exist "%~dp0generated-package" mkdir "%~dp0generated-package"
if not exist "%~dp0generated-package\Matrix-anti_BP" mkdir "%~dp0generated-package\Matrix-anti_BP"
if not exist "%~dp0generated-package\Matrix-anti_RP" mkdir "%~dp0generated-package\Matrix-anti_RP"
: Copy the behavior pack
copy "%~dp0ac_BP\pack_icon.png" "%~dp0generated-package\Matrix-anti_BP" /Y
copy "%~dp0ac_BP\bug_pack_icon.png" "%~dp0generated-package\Matrix-anti_BP" /Y
copy "%~dp0ac_BP\manifest.json" "%~dp0generated-package\Matrix-anti_BP" /Y
copy "%~dp0LICENSE.md" "%~dp0generated-package\Matrix-anti_BP" /Y
if not exist "%~dp0generated-package\Matrix-anti_BP\texts" mkdir "%~dp0generated-package\Matrix-anti_BP\texts"
copy "%~dp0ac_BP\texts\*.lang" "%~dp0generated-package\Matrix-anti_BP\texts" /Y
copy "%~dp0ac_BP\texts\languages.json" "%~dp0generated-package\Matrix-anti_BP\texts" /Y
Xcopy "%~dp0ac_BP\scripts" "%~dp0generated-package\Matrix-anti_BP\scripts" /Y /E /H /C /I
Xcopy "%~dp0ac_BP\animations" "%~dp0generated-package\Matrix-anti_BP\animations" /Y /E /H /C /I
Xcopy "%~dp0ac_BP\functions" "%~dp0generated-package\Matrix-anti_BP\functions" /Y /E /H /C /I
Xcopy "%~dp0ac_BP\animation_controllers" "%~dp0generated-package\Matrix-anti_BP\animation_controllers" /Y /E /H /C /I
Xcopy "%~dp0ac_BP\items" "%~dp0generated-package\Matrix-anti_BP\items" /Y /E /H /C /I
Xcopy "%~dp0ac_BP\recipes" "%~dp0generated-package\Matrix-anti_BP\recipes" /Y /E /H /C /I
Xcopy "%~dp0ac_BP\entities" "%~dp0generated-package\Matrix-anti_BP\entities" /Y /E /H /C /I
: Copy the resource pack
copy "%~dp0ac_RP\pack_icon.png" "%~dp0generated-package\Matrix-anti_RP" /Y
copy "%~dp0ac_BP\bug_pack_icon.png" "%~dp0generated-package\Matrix-anti_BP" /Y
copy "%~dp0ac_RP\manifest.json" "%~dp0generated-package\Matrix-anti_RP" /Y
copy "%~dp0LICENSE.md" "%~dp0generated-package\Matrix-anti_RP" /Y
if not exist "%~dp0generated-package\Matrix-anti_RP\texts" mkdir "%~dp0generated-package\Matrix-anti_RP\texts"
Xcopy "%~dp0ac_RP\textures" "%~dp0generated-package\Matrix-anti_RP\textures" /Y /E /H /C /I
Xcopy "%~dp0ac_RP\ui" "%~dp0generated-package\Matrix-anti_RP\ui" /Y /E /H /C /I
Xcopy "%~dp0ac_RP\subpacks" "%~dp0generated-package\Matrix-anti_RP\subpacks" /Y /E /H /C /I
Xcopy "%~dp0ac_RP\sounds" "%~dp0generated-package\Matrix-anti_RP\sounds" /Y /E /H /C /I
copy "%~dp0ac_RP\texts\*.lang" "%~dp0generated-package\Matrix-anti_RP\texts" /Y
copy "%~dp0ac_RP\texts\languages.json" "%~dp0generated-package\Matrix-anti_RP\texts" /Y
:: Compress the code
call node ./compresser.mjs
echo Process ended.
pause
