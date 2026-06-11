$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $scriptDir "backend"
$frontendDir = Join-Path $scriptDir "frontend"

Write-Host "Starting backend in: $backendDir"
Push-Location $backendDir
Start-Process php -ArgumentList "artisan", "serve"
Pop-Location

Write-Host "Starting frontend in: $frontendDir"
Push-Location $frontendDir
Start-Process npm -ArgumentList "start"
Pop-Location

Write-Host "Backend and frontend start commands have been launched."
Write-Host "If PowerShell execution policy prevents running this script, use:`n  powershell -ExecutionPolicy Bypass -File .\start.ps1"