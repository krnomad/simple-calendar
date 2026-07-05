#!/usr/bin/env sh
set -eu

TARGET="${TARGET:-x86_64-pc-windows-gnu}"
EXE_PATH="${EXE_PATH:-src-tauri/target/$TARGET/release/simple-calendar.exe}"
OUT_DIR="${OUT_DIR:-dist/simple-calendar-windows-x64}"
ZIP_PATH="${ZIP_PATH:-dist/Simple-Calendar-Windows-x64-portable.zip}"
WEBVIEW2_LOADER_PATH="${WEBVIEW2_LOADER_PATH:-}"

if [ ! -f "$EXE_PATH" ]; then
  echo "Missing Windows executable: $EXE_PATH" >&2
  exit 1
fi

if [ -z "$WEBVIEW2_LOADER_PATH" ]; then
  CARGO_HOME_DIR="${CARGO_HOME:-$HOME/.cargo}"
  WEBVIEW2_LOADER_PATH="$(
    find "$CARGO_HOME_DIR/registry/src" -path "*/webview2-com-sys-*/x64/WebView2Loader.dll" -type f 2>/dev/null |
      sort |
      tail -n 1
  )"
fi

if [ -z "$WEBVIEW2_LOADER_PATH" ] || [ ! -f "$WEBVIEW2_LOADER_PATH" ]; then
  echo "Missing x64 WebView2Loader.dll. Build the app first or set WEBVIEW2_LOADER_PATH." >&2
  exit 1
fi

mkdir -p "$OUT_DIR"
cp "$EXE_PATH" "$OUT_DIR/simple-calendar.exe"
cp "$WEBVIEW2_LOADER_PATH" "$OUT_DIR/WebView2Loader.dll"

rm -f "$ZIP_PATH"
(cd "$(dirname "$OUT_DIR")" && zip -qr "$(basename "$ZIP_PATH")" "$(basename "$OUT_DIR")")

echo "Created $ZIP_PATH"
find "$OUT_DIR" -maxdepth 1 -type f -print | sort
