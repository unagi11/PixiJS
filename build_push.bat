rmdir /s /q docs
@REM npm run build
xcopy /E /Y dist docs /I
git add .
git commit -m "build: %DATE% %TIME:~0,8%"
git push

echo Build complete.
pause