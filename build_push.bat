@echo off

REM Delete the "docs" folder
rmdir /s /q docs

REM Run the "build" script defined in package.json
npm run build

REM Copy the "dist" folder to the "docs" folder
xcopy /E /Y dist docs /I

REM Stage all changes and commit with the current date and time
git add .

REM YYYY-MM-DD HH:MM:SS
git commit -m "build: %DATE% %TIME:~0,8%"

REM Push changes to remote repository
git push
