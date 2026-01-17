
@echo off
echo Deploying updates to Vercel...
git add .
git commit -m "Update site via AI"
git push
echo Done! check your Vercel dashboard.
pause
