# Build and Packaging

## Framework Decision

Use Tauri 2 with a static HTML/CSS/JavaScript frontend.

Reasons:

- Windows and macOS support from one codebase.
- Uses the system WebView instead of bundling Chromium.
- Keeps the app suitable for the 10MB artifact target.
- The app only needs local UI, network fetch, and local cache storage, so no heavy desktop framework is needed.

References:

- Tauri describes itself as a framework for small, fast binaries across desktop platforms: https://v2.tauri.app/blog/tauri-20/
- Tauri build uses `build.frontendDist` for production assets: https://v2.tauri.app/reference/cli/
- Tauri uses Microsoft Edge WebView2 on Windows, and bundling a fixed WebView2 runtime would add roughly 180MB: https://v2.tauri.app/distribute/windows-installer/
- Microsoft documents that apps must ship the WebView2 loader code, either by static linking or by including the architecture-matched `WebView2Loader.dll`: https://learn.microsoft.com/en-us/microsoft-edge/webview2/concepts/distribution
- Nager.Date official API uses `/api/v4/Holidays/{CountryCode}/{Year}`: https://date.nager.at/api

Windows runtime note:

The portable Windows zip relies on the system WebView2 Runtime to stay below 10MB. Tauri documents WebView2 as preinstalled on Windows 11, while older Windows versions may need the Tauri installer path or a manual Microsoft Edge WebView2 Runtime installation to ensure WebView2 is present. The fixed-runtime option is intentionally not used because it would add roughly 180MB and exceed the size requirement.

The Windows portable release must include both:

- `simple-calendar.exe`
- `WebView2Loader.dll`

`WebView2Loader.dll` is not the full WebView2 Runtime. It is the small native loader that lets the executable locate the installed Runtime. A bare `.exe` can fail with a missing `WebView2Loader.dll` error.

## Prerequisites

- Node.js 20 or newer
- Rust stable toolchain
- Platform SDK for the target OS

macOS builds must run on macOS. Windows builds should run on Windows because Tauri's Windows bundling and WebView2 assumptions are Windows-native.

## Install

```sh
npm install
```

## Test

```sh
npm test
npm run check
```

## macOS Build

```sh
npm run build:mac
```

Expected portable app bundle:

```text
src-tauri/target/release/bundle/macos/Simple Calendar.app
```

Release copy used for handoff:

```text
dist/Simple Calendar.app
```

Size verification:

```sh
npm run size:mac
```

The script fails if the `.app` bundle is above 10MB. The DMG target is intentionally not the default target for this project. The primary macOS portable artifact is the `.app` bundle, which can be copied directly.

## Windows Portable Build

Run these commands on Windows:

```powershell
npm install
npm run build:portable
npm run package:windows
npm run size:windows
```

Expected portable zip:

```text
dist\Simple-Calendar-Windows-x64-portable.zip
```

Portable folder inside `dist`:

```text
dist\simple-calendar-windows-x64\
  simple-calendar.exe
  WebView2Loader.dll
```

This zip is the smallest Windows output that still includes the required WebView2 loader DLL. In this repository `npm run build` is intentionally mapped to `tauri build --no-bundle` for the portable target.

```powershell
npm run build
```

Installer outputs are useful for distribution but are not the primary artifact for the 10MB portable target. Use a platform-specific Tauri installer command if you want the installer to bootstrap WebView2 Runtime on machines that do not already have it.

## Windows Cross Build from macOS

The Windows portable executable can also be cross-built from macOS with the GNU Windows target:

```sh
rustup target add x86_64-pc-windows-gnu
brew install mingw-w64
npm run build:windows-cross
npm run package:windows-cross
```

Verify that the output is a GUI executable, not a console executable:

```sh
file dist/simple-calendar-windows-x64/simple-calendar.exe
```

Expected output includes:

```text
PE32+ executable (GUI) x86-64
```

## CI Build

The workflow at `.github/workflows/build.yml` builds:

- macOS `.app` bundle on `macos-latest`
- Windows portable `.zip` on `windows-latest`

Both jobs run the unit checks and the 10MB size check before uploading artifacts.

## Holiday Updates

The app fetches public holidays from:

```text
https://date.nager.at/api/v4/Holidays/{CountryCode}/{Year}
```

Supported default country codes:

- `KR`
- `US`
- `JP`
- `CN`

Holiday rows are cached in local storage per country and year. If a network update fails, the app keeps running and shows the latest cached data when available.
