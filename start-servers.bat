@echo off
SETLOCAL

REM Base directory of this script
set ROOT=%~dp0

REM Open dev servers in Windows Terminal (multiple tabs)
wt ^
new-tab --title "Client User" -p "Command Prompt" -d "%ROOT%client\user" cmd /k "npm run dev" ^
; new-tab --title "Client Owner" -p "Command Prompt" -d "%ROOT%client\owner" cmd /k "npm run dev" ^
; new-tab --title "Backend Server" -p "Command Prompt" -d "%ROOT%server" cmd /k "nodemon start"

REM Give servers time to boot
timeout /t 5 >nul

REM Open apps in Edge
start "" msedge http://localhost:5173
start "" msedge http://localhost:5174

ENDLOCAL
