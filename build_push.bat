@echo off

REM Delete the "docs" folder
rmdir /s /q docs

REM Run the "build" script defined in package.json
npm run build

REM Copy the "dist" folder to the "docs" folder
xcopy /E /Y dist docs

REM Stage all changes and commit with the current date and time
git add .
set datetime=%DATE:~10,4%-%DATE:~4,2%-%DATE:~7,2% %TIME:~0,2%:%TIME:~3,2%:%TIME:~6,2%
git commit -m "build: %datetime%"

REM Push changes to remote repository
git push
