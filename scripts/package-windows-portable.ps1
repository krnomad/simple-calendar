param(
  [string]$ExePath = "src-tauri\target\release\simple-calendar.exe",
  [string]$OutDir = "dist\simple-calendar-windows-x64",
  [string]$ZipPath = "dist\Simple-Calendar-Windows-x64-portable.zip",
  [string]$WebView2LoaderPath = ""
)

if (-not (Test-Path $ExePath)) {
  Write-Error "Missing Windows executable: $ExePath"
  exit 1
}

if (-not $WebView2LoaderPath) {
  $cargoHome = if ($env:CARGO_HOME) { $env:CARGO_HOME } else { Join-Path $HOME ".cargo" }
  $registrySrc = Join-Path $cargoHome "registry\src"
  $loader = Get-ChildItem -Path $registrySrc -Recurse -Filter "WebView2Loader.dll" -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -match "\\webview2-com-sys-[^\\]+\\x64\\WebView2Loader\.dll$" } |
    Select-Object -First 1

  if ($loader) {
    $WebView2LoaderPath = $loader.FullName
  }
}

if (-not $WebView2LoaderPath -or -not (Test-Path $WebView2LoaderPath)) {
  Write-Error "Missing x64 WebView2Loader.dll. Build the app first or pass -WebView2LoaderPath."
  exit 1
}

New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
Copy-Item -Force $ExePath (Join-Path $OutDir "simple-calendar.exe")
Copy-Item -Force $WebView2LoaderPath (Join-Path $OutDir "WebView2Loader.dll")

if (Test-Path $ZipPath) {
  Remove-Item -Force $ZipPath
}

Compress-Archive -Path (Join-Path $OutDir "*") -DestinationPath $ZipPath -Force

Write-Output "Created $ZipPath"
Get-ChildItem $OutDir | ForEach-Object { Write-Output $_.FullName }
