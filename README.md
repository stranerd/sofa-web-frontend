# Getting Started

```bash
$ git clone https://github.com/stranerd/sofa-web-frontend
$ cd sofa-web-frontend
$ pnpm install

# To run web in dev mode
$ pnpm --filter ./apps/website dev

# To run android in dev mode
$ yarn run:android

# To run ios in dev mode
$ yarn run:ios

# To build web
$ pnpm --filter ./apps/website build

# To build android
$ yarn bin:project:appBuild android Release|Debug bundle|assemble

# To build ios
$ yarn bin:project:appBuild ios Release|Debug
```

## Dev Tools
- git
- node && pnpm
- xcode && xcodebuild (to build and sign ios app) (Comes with an installation of XCode. Make sure it is available in your PATH)
- apksigner && zipalign (to build and sign android app) (Comes with an installation of Android Studio. Make sure it is available in your PATH)
