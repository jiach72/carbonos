
# Archive legacy project files
$exclude = @("carbonos", "docs", ".git", ".agent", ".shared", "_legacy_archive", "cleanup_legacy.ps1", ".gemini", ".brain")
$archiveDir = "_legacy_archive"

if (-not (Test-Path $archiveDir)) {
    New-Item -ItemType Directory -Path $archiveDir
}

Get-ChildItem -Path . -Exclude $exclude | ForEach-Object {
    Write-Host "Archiving: $($_.Name)"
    Move-Item -Path $_.FullName -Destination $archiveDir -Force
}

Write-Host "Cleanup complete. Legacy files moved to $archiveDir"
