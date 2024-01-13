# Getting Started

```bash
$ git clone https://github.com/stranerd/sofa-web-frontend
$ cd sofa-web-frontend
$ pnpm install

# To run web in dev mode
$ pnpm dev

# To run android in dev mode
$ pnpm run:android

# To run ios in dev mode
$ pnpm run:ios

# To build web
$ pnpm build

# To build android
$ pnpm bin:project:appBuild android Release|Debug bundle|assemble

# To build ios
$ pnpm bin:project:appBuild ios Release|Debug
```

## Dev Tools
- git
- node && pnpm
- xcode && xcodebuild (to build and sign ios app) (Comes with an installation of XCode. Make sure it is available in your PATH)
- apksigner && zipalign (to build and sign android app) (Comes with an installation of Android Studio. Make sure it is available in your PATH)
