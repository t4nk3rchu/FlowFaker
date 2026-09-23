# Design Specification: Port Data Faker to TypeScript & Bun Standalone Executable

**Date:** 2026-09-23  
**Status:** Approved  
**Topic:** Port Flow Launcher Data Faker Plugin from Python to TypeScript/Bun  

---

## 1. Overview & Objective

Port the Flow Launcher "Data Faker" plugin from Python to a pure TypeScript codebase compiled into a standalone Windows binary (`data-faker.exe`) using Bun (`bun build --compile`). 

The plugin replaces the legacy Python 3.11 implementation with full dynamic support for `@faker-js/faker` (25+ modules, hundreds of generator methods), complete removal of legacy Python residue (eliminating C-extension ABI crashes and large binary wheels), native Flow Launcher autocomplete via `Tab` / `Enter` (`ChangeQuery`), and dynamic locale switching.

---

## 2. Architecture & Distribution

### 2.1 Execution Model
* **Language Runtime:** Compiled Standalone Windows Binary (`Language: "executable"`).
* **Compiler:** Bun v1.4+ (`bun build --compile --minify ./src/index.ts --outfile ./bin/data-faker.exe`).
* **Dependency Footprint:** Zero dependencies required on the end-user machine (no Node.js, Python, or Bun installation required).

### 2.2 Manifest Specification (`plugin.json`)
```json
{
  "ID": "a6f2b0a6-513e-4078-8116-f33333333333",
  "ActionKeyword": "fake",
  "Name": "Data Faker",
  "Description": "Generate realistic test data from Flow Launcher using Faker.",
  "Author": "t4nk3rchu",
  "Version": "2.0.0",
  "Language": "executable",
  "ExecuteFileName": "bin\\data-faker.exe",
  "IcoPath": "Images\\app.svg"
}
```

### 2.3 JSON-RPC Communication
* **Invocation:** Flow Launcher invokes `bin\data-faker.exe "<JSON-RPC Request>"`.
* **Input Parsing:** Input is retrieved from `process.argv[2]`.
* **Output:** JSON-RPC response serialized to standard output via `console.log`.
* **Supported JSON-RPC Methods:**
  * `query`: Handles search box input and generates result cards.
  * `context_menu`: Returns secondary actions (e.g. repeat counts, copy variations).
  * `copy_to_clipboard`: Writes generated values to clipboard via PowerShell or Flow Launcher clipboard action.

---

## 3. Repository Restructuring & Python Residue Cleanup

### 3.1 Files to Remove
* Legacy Python Entrypoint: `main.py`
* Legacy Python Providers: `src/*.py` (`date.py`, `finance.py`, `i18n.py`, `internet.py`, `locale_support.py`, `location.py`, `lorem.py`, `person.py`, `phone.py`, `random.py`, `vehicle.py`)
* Legacy Python Dependencies: `lib/` (entire vendored ~25MB directory) and `requirements.txt`
* Vendored Wheels: `tmpwheel/` (entire 7MB `.whl` directory)
* Legacy CI Workflow: `.github/workflows/release.yml`

### 3.2 Target Directory Structure
```text
├── .github/workflows/
│   └── release.yml          # Automated Bun build, test, and release packaging
├── bin/
│   └── data-faker.exe       # Standalone compiled binary
├── src/
│   ├── index.ts             # JSON-RPC request dispatcher & CLI entrypoint
│   ├── dispatcher.ts        # Dynamic Faker module & method resolver
│   ├── parser.ts            # Query tokenizer & options parser (repeat, newline, locale)
│   ├── locales.ts           # Locale mapping & dynamic instance factory
│   └── types.ts             # Flow Launcher JSON-RPC type definitions
├── tests/
│   ├── parser.test.ts       # Query parsing & option tests
│   ├── dispatcher.test.ts   # Faker method resolution tests
│   └── locales.test.ts      # Multi-locale generation tests
├── Images/
│   └── app.svg              # Plugin icon
├── package.json             # Project dependencies (@faker-js/faker, types)
├── tsconfig.json            # Strict TypeScript configuration
└── plugin.json              # Flow Launcher manifest
```

---

## 4. Faker.js Engine & Universal Dispatcher

### 4.1 Full Module Support
The plugin dynamically discovers and dispatches calls to all `@faker-js/faker` modules:
* `airline`, `animal`, `color`, `commerce`, `company`, `database`, `datatype`, `date`, `finance`, `git`, `hacker`, `image`, `internet`, `location`, `lorem`, `music`, `number`, `person`, `phone`, `science`, `string`, `system`, `vehicle`, `word`.

### 4.2 Case Normalization & Backward-Compatibility
* Input keys normalize transparently across `camelCase` and `snake_case` (e.g., `first_name` and `firstName` resolve to the same method).
* Legacy aliases map seamlessly:
  * `random number` $\rightarrow$ `number.int`
  * `random image` $\rightarrow$ `image.urlPicsumPhotos`
  * `phone phone_number` $\rightarrow$ `phone.number`

### 4.3 Navigation & Autocomplete
* **Module Level (`fake` or `fake `):**
  * Displays list of all 25+ modules with descriptions.
  * Setting `AutoCompleteText: "fake <module> "` allows the user to press **`Tab`** to complete the module.
  * Pressing **`Enter`** triggers `Flow.Launcher.ChangeQuery("fake <module> ", true)` to explore module methods immediately.
* **Method Level (`fake <module> `):**
  * Displays methods belonging to the module with live preview values.
  * Pressing **`Tab`** autocompletes the method name.
  * Pressing **`Enter`** generates the final value, copies it to the clipboard, and closes Flow Launcher.
* **Direct Search (`fake <query>`):**
  * Searches across both module names and method names, allowing direct execution (e.g. `fake uuid` resolves to `string.uuid`).

---

## 5. Query Syntax & Options

### 5.1 Syntax Definition
```text
fake [module] [method] [options...]
```

### 5.2 Global Options
* `repeat:N`: Generates $N$ items (default `1`).
* `newline:true|false`: Formats multi-item output with newlines (`\n`) instead of comma-separated (`", "`).
* `locale:XX` / `lang:XX`: Dynamically switches locale for the query without mutating global state. Supported locales include `en`, `vi`, `ja`, `zh_CN`, `zh_TW`, `fr`, `de`, `es`, `ko`, etc.

### 5.3 Method-Specific Options
Method options (e.g., `min:10 max:100 symbol:$`) are parsed into typed key-value pairs and passed directly to Faker methods.

---

## 6. Error Handling & Resilience

1. **Unknown Input:** Returns a non-crashing informational card with suggested keywords rather than raising an uncaught exception.
2. **Invalid Options:** Faulty integer inputs (e.g., `repeat:abc`) fallback gracefully to safe defaults (`repeat:1`).
3. **Execution Guard:** Global `try/catch` wrapper ensures all unhandled runtime errors return a valid JSON-RPC error card explaining the issue to the user.

---

## 7. Verification & Testing

1. **Automated Unit Tests (`bun test`):**
   * Tokenizer & option parser correctness.
   * Universal dispatcher coverage across all Faker modules.
   * Locale isolation (verifying Vietnamese, Japanese, and fallback behaviors).
   * Result formatting (`AutoCompleteText`, `ChangeQuery`, copy actions).
2. **Binary Build Verification:**
   * Compile standalone executable via `bun build --compile`.
   * Execute `./bin/data-faker.exe` with JSON-RPC test payloads over standard input/argv.
   * Verify output speed, formatting, and clean exit codes.
