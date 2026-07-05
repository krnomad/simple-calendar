# Simple Calendar

Small Windows and macOS desktop calendar app with Korean, English, Japanese, and Chinese UI support.

## 한국어

Simple Calendar는 Windows와 macOS에서 실행되는 작은 데스크톱 달력 앱입니다. Tauri 2와 정적 HTML/CSS/JavaScript로 만들어져 운영체제의 WebView를 사용하며, 가벼운 portable 산출물을 목표로 합니다.

### 주요 기능

- 월간 달력 보기
- 이전 달, 다음 달, 오늘로 이동
- 날짜 선택 및 선택한 날짜의 공휴일 표시
- 한국어, 영어, 일본어, 중국어 UI
- 대한민국, 미국, 일본, 중국 공휴일 선택
- Nager.Date 공개 API를 통한 공휴일 업데이트
- 네트워크 실패 시 최근 공휴일 캐시 사용
- macOS 앱 번들과 Windows portable exe 빌드

### 개발

```sh
npm install
npm test
npm run dev
```

### 검증

```sh
npm run check
```

### 빌드

macOS:

```sh
npm run build:mac
npm run size:mac
```

Windows portable exe, Windows에서 실행:

```powershell
npm install
npm run build:portable
npm run size:windows
```

Windows portable exe, macOS에서 cross-build:

```sh
rustup target add x86_64-pc-windows-gnu
brew install mingw-w64
npm run build:windows-cross
cp src-tauri/target/x86_64-pc-windows-gnu/release/simple-calendar.exe dist/simple-calendar.exe
```

자세한 빌드 설명은 [docs/build.md](docs/build.md)를 참고하세요.

## English

Simple Calendar is a small desktop calendar app for Windows and macOS. It is built with Tauri 2 and static HTML/CSS/JavaScript, uses the operating system WebView, and targets compact portable artifacts.

### Features

- Monthly calendar view
- Previous month, next month, and today navigation
- Date selection with holiday details for the selected date
- Korean, English, Japanese, and Chinese UI
- Holiday country selection for South Korea, the United States, Japan, and China
- Public holiday updates from the Nager.Date public API
- Recent holiday cache fallback when the network update fails
- macOS app bundle and Windows portable exe builds

### Development

```sh
npm install
npm test
npm run dev
```

### Verification

```sh
npm run check
```

### Build

macOS:

```sh
npm run build:mac
npm run size:mac
```

Windows portable exe, on Windows:

```powershell
npm install
npm run build:portable
npm run size:windows
```

Windows portable exe, cross-build from macOS:

```sh
rustup target add x86_64-pc-windows-gnu
brew install mingw-w64
npm run build:windows-cross
cp src-tauri/target/x86_64-pc-windows-gnu/release/simple-calendar.exe dist/simple-calendar.exe
```

See [docs/build.md](docs/build.md) for platform-specific outputs and verification.

## 日本語

Simple Calendarは、WindowsとmacOSで動作する小さなデスクトップカレンダーアプリです。Tauri 2と静的なHTML/CSS/JavaScriptで作られており、OSのWebViewを使用して軽量なportable成果物を目指しています。

### 主な機能

- 月間カレンダー表示
- 前月、次月、今日への移動
- 日付選択と選択日の祝日表示
- 韓国語、英語、日本語、中国語UI
- 韓国、米国、日本、中国の祝日国選択
- Nager.Date公開APIによる祝日更新
- ネットワーク更新に失敗した場合の最近の祝日キャッシュ利用
- macOSアプリバンドルとWindows portable exeのビルド

### 開発

```sh
npm install
npm test
npm run dev
```

### 検証

```sh
npm run check
```

### ビルド

macOS:

```sh
npm run build:mac
npm run size:mac
```

Windows portable exeをWindowsで作成:

```powershell
npm install
npm run build:portable
npm run size:windows
```

Windows portable exeをmacOSからcross-build:

```sh
rustup target add x86_64-pc-windows-gnu
brew install mingw-w64
npm run build:windows-cross
cp src-tauri/target/x86_64-pc-windows-gnu/release/simple-calendar.exe dist/simple-calendar.exe
```

プラットフォーム別の成果物と検証方法は[docs/build.md](docs/build.md)を参照してください。

## 中文

Simple Calendar是一款适用于Windows和macOS的小型桌面日历应用。它使用Tauri 2和静态HTML/CSS/JavaScript构建，依赖操作系统WebView，目标是生成轻量的portable发布文件。

### 主要功能

- 月历视图
- 上个月、下个月、今天导航
- 日期选择和所选日期的公共假日显示
- 韩语、英语、日语、中文UI
- 韩国、美国、日本、中国公共假日国家选择
- 通过Nager.Date公开API更新公共假日
- 网络更新失败时使用最近的公共假日缓存
- macOS app bundle和Windows portable exe构建

### 开发

```sh
npm install
npm test
npm run dev
```

### 验证

```sh
npm run check
```

### 构建

macOS:

```sh
npm run build:mac
npm run size:mac
```

Windows portable exe，在Windows上运行:

```powershell
npm install
npm run build:portable
npm run size:windows
```

Windows portable exe，从macOS cross-build:

```sh
rustup target add x86_64-pc-windows-gnu
brew install mingw-w64
npm run build:windows-cross
cp src-tauri/target/x86_64-pc-windows-gnu/release/simple-calendar.exe dist/simple-calendar.exe
```

平台相关输出和验证说明请参考[docs/build.md](docs/build.md)。

## Release Artifacts

The release assets are generated from the build output:

- `Simple-Calendar-macOS-arm64.zip`: macOS app bundle
- `simple-calendar-windows-x64.exe`: Windows portable executable

The app uses the system WebView. Windows 11 includes WebView2 by default; older Windows versions may need WebView2 installed separately.
