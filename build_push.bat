@echo off

REM Delete the "docs" folder
rmdir /s /q docs

REM Run the "build" script defined in package.json
npm run build

REM Copy the "dist" folder to the "docs" folder
xcopy /E /Y dist docs

REM Stage all changes and commit with the current date and time
git add .
git commit -m "build: %date:~10,4%-%date:~4,2%-%date:~7,2% %time:~0,2%:%time:~3,2%:%time:~6,2%"

REM Push changes to remote repository
git push
