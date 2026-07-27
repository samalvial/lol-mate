param (
    [string]$msg = "feat: Update RiftCoach AI application"
)

$gitPath = "C:\Program Files (x86)\Microsoft Visual Studio\2019\BuildTools\Common7\IDE\CommonExtensions\Microsoft\TeamFoundation\Team Explorer\Git\cmd"
$ghPath = "C:\Program Files\GitHub CLI"

$env:Path = "$env:Path;$gitPath;$ghPath"

Set-Location "E:\seba-ai\lol-mate"

Write-Host "Syncing changes to GitHub: $msg..."
git add .
git commit -m "$msg"
git push origin master

Write-Host "✅ Changes pushed successfully to GitHub!"
