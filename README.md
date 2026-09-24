# Data Faker Flow Launcher Plugin

Generate realistic test data from Flow Launcher with [Faker](https://fakerjs.dev), without leaving your keyboard. Every Faker module and method is available, with inline parameter hints, locale switching, and one-keystroke copy.

## Requirements
- Flow Launcher 2.x on Windows
- Node.js. The plugin runs as a Flow Launcher `JavaScript_V2` plugin. The first time it loads, Flow Launcher offers to download Node.js or lets you pick an existing `node.exe`; you can change it later in Flow Launcher's settings.

## Installation
1. Download `Data-Faker-Flow-Launcher-<version>.zip` from [Releases](https://github.com/t4nk3rchu/Data-Faker-Flow-Launcher-Plugin/releases).
2. Extract it into a new folder under `%APPDATA%\FlowLauncher\Plugins\`.
3. Restart Flow Launcher.

## Usage
The action keyword is `fake`.

| You type | You get |
|---|---|
| `fake ` | All Faker modules |
| `fake person ` | The module's methods, each with a live sample |
| `fake person fullName` | 5 generated values. Enter copies one |
| `fake person fullName ` (trailing space) | Parameter helpers for that method, no generated values |
| `fake person fullName s` | Only the helpers starting with `s` |

Helpers are tagged by where the parameter comes from:
- `sex:  [method]`: a parameter of the Faker method itself, read from Faker's docs.
- `repeat:  [global]`: a plugin option that works on every method.

Press Tab or Enter on a helper to add it to the query, then type its value.

### Global parameters
- `repeat:<n>`: put several values in each result (max 100).
- `newline:true`: separate repeated values with newlines instead of `, `.
- `locale:<code>` (or `lang:<code>`): `en`, `vi`, `ja`, `zh_cn`, `zh_tw`, `de`, `fr`, `es`, `ko`, `it`, `ru`, `pt_br`. Region forms like `vi_VN` and `pt-BR` also work.

### Method parameters
Every method accepts the parameters listed in the [Faker API docs](https://fakerjs.dev/api/). The plugin reads them from the installed Faker package at build time, so the helpers always match the bundled version. Pass them as `key:value`. Numbers and `true`/`false` are converted automatically.

### Copy options
Press → on a generated value for more options:
- Copy the current value.
- Generate and copy 5 or 10 values, comma- or newline-separated.

### Examples
```
fake person fullName sex:female lang:vi
fake internet email firstName:Jeanne lastName:Doe
fake date between from:2002-01-01 to:2002-02-01
fake date birthdate mode:age min:18 max:65
fake number int min:1 max:100 repeat:5
fake lorem words min:3 max:6
fake finance iban countryCode:DE
fake phone number style:international
fake string nanoid length:10
fake location city lang:ja
```

### Vietnamese names
With `lang:vi`, `person fullName` follows Vietnamese order (family name first), e.g. `Phùng Ngọc San`.

## Development
Uses [Bun](https://bun.sh) for tests and bundling. The shipped plugin is plain Node.js.

```
bun install
bun test
bun run build
```

- `bun run build` bundles `src/index.ts` and Faker into a single `dist/index.js`, so users need no `npm install`. It also copies Faker's license to `dist/FAKER-LICENSE.txt`.
- `src/faker-docs.ts` is a Bun macro. At build time it reads the JSDoc Faker ships in its `.d.ts` files and inlines every method's parameters, hints and descriptions. After upgrading `@faker-js/faker`, rebuild. `tests/faker-docs.test.ts` fails if the new version's layout can no longer be read.
- `src/index.ts` speaks Flow Launcher's v2 protocol: JSON-RPC 2.0 over stdio, `Content-Length` framed. Writing to stderr crashes the plugin, so it's silenced.
- `scripts/deploy-local.ps1` builds, copies the plugin into your Flow Launcher plugins folder, and restarts Flow Launcher:
  ```
  powershell -ExecutionPolicy Bypass -File .\scripts\deploy-local.ps1
  ```

Pushing a `v*` tag runs `.github/workflows/release.yml`. It builds, tests, and publishes the zip to GitHub Releases.

## Credits
All data generation comes from [Faker](https://fakerjs.dev) ([`@faker-js/faker`](https://github.com/faker-js/faker)), built and maintained by the Faker.js team and its contributors. The parameter hints and descriptions shown in the plugin are taken from Faker's own API documentation. Thank you for a wonderful library.

Faker is MIT-licensed. Its license ships with the plugin as `dist/FAKER-LICENSE.txt`.

This plugin is an independent project. It is **not affiliated with, endorsed by, or sponsored by** the Faker.js project. "Faker" is used only to describe the library the plugin is built on, and the plugin uses its own icon, not Faker's logo.

## License
MIT
