param(
  [string]$Path = "src-tauri\target\release\simple-calendar.exe",
  [int]$LimitBytes = 10485760
)

if (-not (Test-Path $Path)) {
  Write-Error "Missing artifact: $Path"
  exit 1
}

$sizeBytes = (Get-Item $Path).Length
$sizeMb = [math]::Round($sizeBytes / 1MB, 2)
$limitMb = [math]::Round($LimitBytes / 1MB, 2)

Write-Output "$Path: ${sizeMb}MB"

if ($sizeBytes -gt $LimitBytes) {
  Write-Error "Size check failed: ${sizeMb}MB is above ${limitMb}MB"
  exit 1
}

Write-Output "Size check passed: ${sizeMb}MB is within ${limitMb}MB"
