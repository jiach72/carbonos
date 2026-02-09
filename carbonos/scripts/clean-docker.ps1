$ScriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Join-Path $ScriptPath ".."
Set-Location $ProjectRoot

# Stop all containers
Write-Host "Stopping containers..."
docker-compose down

# Remove project images
Write-Host "Removing project images..."
$images = docker images --format "{{.Repository}}:{{.Tag}}" | Select-String "carbonos"
if ($images) {
    foreach ($match in $images) {
        $imgName = $match.Line.Trim()
        if ($imgName) {
            Write-Host "Removing image: $imgName"
            docker rmi -f $imgName
        }
    }
}
else {
    Write-Host "No project images found."
}

# Remove dangling images
Write-Host "Removing dangling images..."
docker image prune -f

Write-Host "Docker cleanup complete."
