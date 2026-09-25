# deploy-local.ps1: Build the Node bundle and deploy to Flow Launcher local plugins folder
$ErrorActionPreference = "Stop"

$repoDir = Split-Path -Parent $PSScriptRoot
Set-Location $repoDir

Write-Host "==> Building Node bundle..." -ForegroundColor Cyan
$env:PATH += ";C:\Users\TankerChu\.bun\bin"
bun run build

$pluginsDir = "$env:APPDATA\FlowLauncher\Plugins"
$destDir = "$pluginsDir\FlowFaker"
$pluginId = (Get-Content ".\plugin.json" -Raw | ConvertFrom-Json).ID

# Stop Flow first: its long-lived plugin process runs inside the plugin folder and locks it
Write-Host "==> Stopping Flow Launcher..." -ForegroundColor Cyan
Stop-Process -Name "Flow.Launcher" -Force -ErrorAction SilentlyContinue
Start-Sleep -Milliseconds 800

# Replace any installed copy with the same plugin ID (e.g. a store install named "FlowFaker-1.0.2")
Get-ChildItem $pluginsDir -Directory | Where-Object {
    $manifest = Join-Path $_.FullName "plugin.json"
    # Plain text match: other plugins' manifests aren't always strict JSON
    (Test-Path $manifest) -and ((Get-Content $manifest -Raw) -match [regex]::Escape($pluginId))
} | ForEach-Object {
    Write-Host "==> Removing installed copy $($_.Name)..." -ForegroundColor Cyan
    Remove-Item -Recurse -Force $_.FullName
}

Write-Host "==> Deploying to $destDir..." -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path $destDir | Out-Null

Copy-Item ".\plugin.json" $destDir -Force
Copy-Item -Recurse -Force ".\Images" "$destDir\Images"
Copy-Item -Recurse -Force ".\dist" "$destDir\dist"

Write-Host "==> Starting Flow Launcher..." -ForegroundColor Cyan
Start-Process "C:\Users\TankerChu\AppData\Local\FlowLauncher\Flow.Launcher.exe"

Write-Host "==> Successfully deployed and restarted Flow Launcher!" -ForegroundColor Green
