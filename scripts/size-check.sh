#!/usr/bin/env sh
set -eu

LIMIT_KB="${LIMIT_KB:-10240}"
APP_PATH="${1:-src-tauri/target/release/bundle/macos/Simple Calendar.app}"

if [ ! -e "$APP_PATH" ]; then
  echo "Missing artifact: $APP_PATH" >&2
  exit 1
fi

SIZE_KB="$(du -sk "$APP_PATH" | awk '{print $1}')"
SIZE_MB="$(awk "BEGIN { printf \"%.2f\", $SIZE_KB / 1024 }")"
LIMIT_MB="$(awk "BEGIN { printf \"%.2f\", $LIMIT_KB / 1024 }")"

echo "$APP_PATH: ${SIZE_MB}MB"

if [ "$SIZE_KB" -gt "$LIMIT_KB" ]; then
  echo "Size check failed: ${SIZE_MB}MB is above ${LIMIT_MB}MB" >&2
  exit 1
fi

echo "Size check passed: ${SIZE_MB}MB is within ${LIMIT_MB}MB"
