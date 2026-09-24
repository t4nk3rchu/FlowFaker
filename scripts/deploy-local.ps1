# deploy-local.ps1: Build the Node bundle and deploy to Flow Launcher local plugins folder
$ErrorActionPreference = "Stop"

$repoDir = Split-Path -Parent $PSScriptRoot
Set-Location $repoDir

Write-Host "==> Building Node bundle..." -ForegroundColor Cyan
$env:PATH += ";C:\Users\TankerChu\.bun\bin"
bun run build

$pluginsDir = "$env:APPDATA\FlowLauncher\Plugins"
$destDir = "$pluginsDir\Data Faker-2.0.0"

# Stop Flow first: its long-lived plugin process runs inside $destDir and locks it
Write-Host "==> Stopping Flow Launcher..." -ForegroundColor Cyan
Stop-Process -Name "Flow.Launcher" -Force -ErrorAction SilentlyContinue
Start-Sleep -Milliseconds 800

Write-Host "==> Deploying to $destDir..." -ForegroundColor Cyan
if (Test-Path $destDir) {
    Remove-Item -Recurse -Force $destDir
}
New-Item -ItemType Directory -Force -Path $destDir | Out-Null

Copy-Item ".\plugin.json" $destDir -Force
Copy-Item -Recurse -Force ".\Images" "$destDir\Images"
Copy-Item -Recurse -Force ".\dist" "$destDir\dist"

Write-Host "==> Starting Flow Launcher..." -ForegroundColor Cyan
Start-Process "C:\Users\TankerChu\AppData\Local\FlowLauncher\Flow.Launcher.exe"

Write-Host "==> Successfully deployed and restarted Flow Launcher!" -ForegroundColor Green
