# Data Faker Plugin v1.1.0

## Release Title
Data Faker v1.1.0 — Random & Vehicle providers, image previews, robust handlers

## New Features
- Random category:
  - `uuid4`: RFC4122 UUID v4 generation
  - `ean13`, `ean8`: valid checksum barcodes
  - `imageUrl width:{n} height:{n}`: placeholder image URLs with dimensions
  - `image width:{n} height:{n}`: local PNG generation with Flow preview
- Vehicle category:
  - `license`: realistic license plate (provider or fallback pattern)
  - `vin`: 17-character VIN
- Copy actions:
  - Enter copies single values; lists copy as comma-separated
  - Right arrow shows copy menu (newline/comma/space/JSON)

## Bug Fixes
- Fixed `random imageUrl` returning UUID due to case handling; now returns proper URL
- Removed hidden default returns and duplicate `handle()` functions across modules
- Normalized subtype handling to be case-insensitive and to raise clear errors on unknown subtypes
- Bundled Pillow for Python 3.11 (Windows) and added graceful error messaging when unavailable

## Known Issues
- Preview for remote image URLs may depend on Flow Launcher capabilities
- If Pillow import fails, reloading the plugin is recommended

## Breaking Changes
- Unknown subtypes now produce `Error: Unknown <category> subtype: ...` instead of silent fallbacks
- Subtype matching is case-insensitive; canonical keys shown in README

## Documentation
- README updated to cover random and vehicle commands, dependencies, usage examples, and troubleshooting

## Build & Packaging
- GitHub Actions creates `Flow.Launcher.Plugin.DataFaker.zip` and publishes a release tagged `v1.1.0`