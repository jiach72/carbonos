$ScriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Join-Path $ScriptPath ".."
Set-Location $ProjectRoot

# Build images using docker-compose
Write-Host "Building images..."
docker-compose build --no-cache

Write-Host "Starting services..."
docker-compose up -d

Write-Host "Build complete."
