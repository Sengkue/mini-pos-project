@echo off
:start
set CURRENT_TIME=%DATE% %TIME%
git add .
git commit -m "commit %CURRENT_TIME%"
git push origin main
timeout /t 6
goto start
