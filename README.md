# Data Faker Flow Launcher Plugin

Generate realistic test data directly from Flow Launcher using the Faker python library (with a little tweak to the Vietnamese locale to support it better). Quickly produce names, dates, finance details, internet data, locations, lorem text, and phone numbers with localized output, copy options, and command validation.

## Description
- Purpose: Accelerate development and testing by generating fake data from your launcher without context switching.
- Core Functionality: Category-based commands with options; returns multiple results; supports locale override and copy formats.
- Key Features:
  - Rich command set: person, date, finance, internet, location, lorem, phone
  - Locale support via `lang:{locale}` (e.g., `vi_VN`, `en_US`)
  - Better support for Vietnamese locale
  - Validation prevents incomplete commands from showing results
  - Copy options: newline, comma, space, JSON
- Supported Platforms: Flow Launcher 2.x on Windows; runtime built on Python 3.11.
- Dependencies: `faker`, `pyflowlauncher`, `pyperclip` (bundled into `lib` via CI packaging).

## Installation
- Download `Flow.Launcher.Plugin.DataFaker.zip` from Releases
- Extract pasted the unzip folder to the directory in `FlowLauncher\Plugins`.
- Ensure Flow Launcher 2.x is installed.

## Configuration
- Common options (apply to most commands):
  - `lang:{locale}`: Override locale (e.g., `vi_VN`, `en_US`)
  - `repeat:{n}`: Generate multiple values per result line
- Copy options: Press right arrow on a result to select newline, comma, space, or JSON copy.

## Usage Examples
- `faker date anytime`
- `faker date between from:2002-01-01 to:2002-02-01`
- `faker internet email first:Jeanne last:Doe`
- `faker person orderedName last middle first lang:vi_VN`
- `faker lorem sentence length:8 repeat:3 newline`

## Command Reference

### date
- `faker date anytime`
  - Description: Random date
  - Parameters: none
  - Example: `faker date anytime`
  - Output: Single ISO date string

- `faker date between from:YYYY-MM-DD|today to:YYYY-MM-DD|today`
  - Description: Date between absolute bounds
  - Required: `from`, `to` (use `today` or ISO `YYYY-MM-DD`)
  - Example: `faker date between from:2002-01-01 to:2002-02-01`
  - Output: Date within range

- `faker date between from:-{n}y|M|d to:+{n}y|M|d`
  - Description: Date between relative offsets (years/months/days)
  - Required: `from`, `to` (e.g., `-30y`, `+10d`)
  - Example: `faker date between from:-2y to:+1y`
  - Output: Date within relative range

- `faker date birthdate mode:age min:{n} max:{n}`
  - Description: Birthdate constrained by age range
  - Required: `mode:age`, `min`, `max`
  - Example: `faker date birthdate mode:age min:18 max:65`
  - Output: Date of birth

- `faker date birthdate mode:year min:{n} max:{n}`
  - Description: Birthdate constrained by year range
  - Required: `mode:year`, `min`, `max`
  - Example: `faker date birthdate mode:year min:1990 max:2000`
  - Output: Synthetic birthdate within year range

### finance
- `faker finance accountName`
  - Description: Company-style account name
  - Example: `faker finance accountName`
  - Output: Text string

- `faker finance accountNumber length:{n}`
  - Description: Numeric account number
  - Optional: `length` (default 8)
  - Example: `faker finance accountNumber length:12`
  - Output: Numeric string

- `faker finance creditCardCVV`
  - Description: Credit card CVV
  - Output: Numeric string

- `faker finance creditCardNumber`
  - Description: Credit card number
  - Optional: `issuer` (uses Faker’s supported card types)
  - Output: Numeric string

### internet
- `faker internet displayName first:{firstName} last:{lastName}`
  - Description: Display name using given names
  - Optional: `first`, `last`
  - Example: `faker internet displayName first:John last:Doe`
  - Output: Text string

- `faker internet domainName`
  - Description: Domain name

- `faker internet email first:{firstName} last:{lastName}`
  - Description: Email with optional name parts
  - Example: `faker internet email first:Jeanne last:Doe`

- `faker internet ipv4`
  - Description: IPv4 address

- `faker internet ipv6`
  - Description: IPv6 address

- `faker internet username first:{firstName} last:{lastName}`
  - Description: Username derived from names

- `faker internet password length:{n}`
  - Description: Password of given length
  - Optional: `length` (default 12)

### location
- `faker location streetAddress`
- `faker location state`
- `faker location city`

### lorem
- `faker lorem words length:{n}`
  - Description: Space-separated words
  - Optional: `length` (default 5)

- `faker lorem slug length:{n}`
  - Description: Lowercase hyphenated words
  - Optional: `length` (default 3)

- `faker lorem sentence length:{n}`
  - Description: Sentence of given word count
  - Optional: `length` (default 8)

- `faker lorem paragraph length:{n}`
  - Description: Paragraph of given sentence count
  - Optional: `length` (default 3)

### person
- `faker person fullName sex:male|female`
  - Description: Full name, honoring sex where supported

- `faker person firstName sex:male|female`
  - Description: First name; when sex not provided, randomizes male/female where available

- `faker person lastName sex:male|female`
  - Description: Last name honoring sex where supported

- `faker person middleName`
  - Description: Middle name when available; falls back to localized first names

- `faker person jobTitle`
  - Description: Job title

- `faker person bio`
  - Description: Short bio text

- `faker person orderedName first last`
  - Description: Outputs `lastName firstName` in the current locale
  - Required: `first last` tokens
  - Example: `faker person orderedName first last`

- `faker person orderedName last first lang:{language}`
  - Description: Outputs `lastName firstName` in specified locale; falls back when invalid
  - Required: `last first` tokens
  - Optional: `lang:{locale}` (e.g., `vi_VN`)

- `faker person orderedName last middle first lang:{language}`
  - Description: Outputs ordered triplet using `last`, `middle`, `first` tokens
  - Required: Three tokens composed of `first|middle|last`
  - Optional: `lang:{locale}`

### phone
- `faker phone imei`
  - Description: IMEI number

- `faker phone number style:human|international|national`
  - Description: Phone number formatted by style
  - Optional: `style` (default `human`)

## Troubleshooting
- Incomplete commands show suggestions, not results. Provide all required tokens/options.
- Placeholders like `{n}` and `{language}` in suggestions are templates; replace them with real values.
- `date between` accepts ISO dates and relative tokens. Use `today` or `YYYY-MM-DD`.
- `orderedName` ignores `lang:{language}` placeholders; uses default locale when invalid.

## Development
- Runtime path setup: `main.py` includes `lib` so dependencies work without user pip install.
- Build and release:
  - CI installs dependencies into `lib` and zips project.
  - Tag is derived from `plugin.json` `Version`.

## Testing
Run unit tests:
```
python -m unittest discover -s tests
```

## Contribution Guidelines
- Fork, create a feature branch, add tests, and open a pull request.
- Keep commands and validation consistent with existing patterns.

## License
MIT License
