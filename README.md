# FlowFaker

A powerful Flow Launcher plugin that generates fake data using [FakerJS](https://fakerjs.dev/) (v10+).

## Features

- **Latest FakerJS**: Built on `@faker-js/faker` v10.1.0+.
- **Dynamic Generation**: Access any data-generating FakerJS module.
- **Improved Filtering**: Real-time suggestions for categories and modules.
- **Immediate Generation**: Instantly generate data on full command match.
- **Localization**: Support for all FakerJS locales (e.g., `vi`, `de`, `ja`).
- **Smart Parsing**: Handle arguments like ranges, booleans, JSON objects/arrays, and **quoted strings** (e.g., `string:"hello world"`).
- **Copy Options**: Context menu to copy results as newline-separated, comma-separated, or JSON.
- **Custom Name Order**: Specialized support for Vietnamese/Eastern name ordering.

## Supported Modules & Limitations

This plugin is designed to work with all data-generating modules in FakerJS. However, some internal modules are excluded from the suggestion list for a cleaner experience:

- **Excluded Categories**: `helpers`.
- **Note**: This plugin focuses on data generation. Helper methods that perform operations on existing data are not currently supported in the main interactive flow.

## Usage

Type `fake` to start.

### Basics
You could find all the module from [FakerJS](https://fakerjs.dev/api/). 
```
fake [category] [module] [parameters]
```

- `fake internet email` -> Generates an email.
- `fake person fullName` -> Generates a name.

### Parameters

Use `key:value` syntax to pass options to FakerJS methods.

- **Count**: `repeat:N` (Generate N items)
  - `fake internet email repeat:5`
- **Language**: `lang:code` (Set locale)
  - `fake person fullName lang:vi`
- **Method Arguments**:
  - `fake number int min:10 max:50`
  - `fake string alphanumeric length:15`
- **Custom Name Order**: (For `person.fullName` only)
  - `fake person fullName lang:vi nameOrder:last-first`

## Installation

1. Download the latest release `.zip`.
2. Drag and drop the `.zip` file into Flow Launcher.
3. Restart Flow Launcher.

## Development

1. Clone the repo.
2. `npm install`
3. `npm run build`
