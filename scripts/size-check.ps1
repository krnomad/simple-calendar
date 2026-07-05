param(
  [string]$Path = "dist\simple-calendar-windows-x64",
  [int64]$LimitBytes = 10485760
)

if (-not (Test-Path $Path)) {
  Write-Error "Missing artifact: $Path"
  exit 1
}

$item = Get-Item $Path
if ($item.PSIsContainer) {
  $sizeBytes = (Get-ChildItem $Path -File -Recurse | Measure-Object -Property Length -Sum).Sum
} else {
  $sizeBytes = $item.Length
}

if ($null -eq $sizeBytes) {
  $sizeBytes = 0
}

$sizeMb = [math]::Round($sizeBytes / 1MB, 2)
$limitMb = [math]::Round($LimitBytes / 1MB, 2)

Write-Output "$Path: ${sizeMb}MB"

if ($sizeBytes -gt $LimitBytes) {
  Write-Error "Size check failed: ${sizeMb}MB is above ${limitMb}MB"
  exit 1
}

Write-Output "Size check passed: ${sizeMb}MB is within ${limitMb}MB"
