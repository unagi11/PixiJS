rm -r docs
npm run build
cp -R dist docs
git add .
git commit -m "build $('+%Y-%m-%d %H:%M:%S')"
git push