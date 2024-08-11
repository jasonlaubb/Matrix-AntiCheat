::[Bat To Exe Converter]
::
::YAwzoRdxOk+EWAnk
::fBw5plQjdG8=
::YAwzuBVtJxjWCl3EqQJgSA==
::ZR4luwNxJguZRRnk
::Yhs/ulQjdF+5
::cxAkpRVqdFKZSDk=
::cBs/ulQjdF+5
::ZR41oxFsdFKZSDk=
::eBoioBt6dFKZSDk=
::cRo6pxp7LAbNWATEpCI=
::egkzugNsPRvcWATEpCI=
::dAsiuh18IRvcCxnZtBJQ
::cRYluBh/LU+EWAnk
::YxY4rhs+aU+JeA==
::cxY6rQJ7JhzQF1fEqQJQ
::ZQ05rAF9IBncCkqN+0xwdVs0
::ZQ05rAF9IAHYFVzEqQJQ
::eg0/rx1wNQPfEVWB+kM9LVsJDGQ=
::fBEirQZwNQPfEVWB+kM9LVsJDGQ=
::cRolqwZ3JBvQF1fEqQJQ
::dhA7uBVwLU+EWDk=
::YQ03rBFzNR3SWATElA==
::dhAmsQZ3MwfNWATElA==
::ZQ0/vhVqMQ3MEVWAtB9wSA==
::Zg8zqx1/OA3MEVWAtB9wSA==
::dhA7pRFwIByZRRnk
::Zh4grVQjdCyDJGyX8VAjFDFVXwuMD16JOpET6/326uSTsXFTeeMraobD5pmPNPIa8gjle4Ik6ndbjNkFFFZaaxunagom52taswQ=
::YB416Ek+ZG8=
::
::
::978f952a14a936cc963da21a135fa983
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
call npm install
call npm install --prefix ./ac_BP/src
if exist "%~dp0ac_BP\src\node_modules\matrix-anticheat" rmdir /S /Q "%~dp0ac_BP\src\node_modules\matrix-anticheat"
: Build the javascript
if not exist "%~dp0ac_BP\scripts" mkdir "%~dp0ac_BP\scripts"
Xcopy "%~dp0ac_BP\src\node_modules" "%~dp0ac_BP\scripts\node_modules" /Y /E /H /C /I
call tsc --build ./tsconfig.json
: Build the language
call node ./ac_RP/texts/generator.js
: Create the right folder for generate
if not exist "%~dp0generated-package" mkdir "%~dp0generated-package"
if not exist "%~dp0generated-package\Matrix-anti_BP" mkdir "%~dp0generated-package\Matrix-anti_BP"
if not exist "%~dp0generated-package\Matrix-anti_RP" mkdir "%~dp0generated-package\Matrix-anti_RP"
: Copy the behavior pack
copy "%~dp0ac_BP\pack_icon.png" "%~dp0generated-package\Matrix-anti_BP" /Y
copy "%~dp0ac_BP\bug_pack_icon.png" "%~dp0generated-package\Matrix-anti_BP" /Y
copy "%~dp0ac_BP\manifest.json" "%~dp0generated-package\Matrix-anti_BP" /Y
copy "%~dp0LICENSE" "%~dp0generated-package\Matrix-anti_BP" /Y
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
copy "%~dp0LICENSE" "%~dp0generated-package\Matrix-anti_RP" /Y
if not exist "%~dp0generated-package\Matrix-anti_RP\texts" mkdir "%~dp0generated-package\Matrix-anti_RP\texts"
Xcopy "%~dp0ac_RP\textures" "%~dp0generated-package\Matrix-anti_RP\textures" /Y /E /H /C /I
Xcopy "%~dp0ac_RP\ui" "%~dp0generated-package\Matrix-anti_RP\ui" /Y /E /H /C /I
copy "%~dp0ac_RP\texts\*.lang" "%~dp0generated-package\Matrix-anti_RP\texts" /Y
copy "%~dp0ac_RP\texts\languages.json" "%~dp0generated-package\Matrix-anti_RP\texts" /Y
echo Process ended.
pause