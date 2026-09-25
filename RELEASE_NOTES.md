# FlowFaker v2.0.0

A new engine for FlowFaker. Everything you used in 1.x still works, and typing a command now guides you through each method's parameters.

## ✨ What's new
- **Parameter helpers.** Add a space after a method (`fake person fullName `) to see every parameter it accepts, with descriptions taken from Faker's docs. Each helper is tagged `[method]` (a Faker parameter) or `[global]` (a FlowFaker option such as `repeat:`).
- **Value hints in the search box.** Type `fake date birthdate mode:` and the accepted values (`age|year`) appear as greyed-out text after the cursor, with one result per value.
- **Cleaner method list.** `fake string ` lists `alpha`, `alphanumeric`, … and the suggestion reads `fake string alpha`, so there's no more guessing whether to type a dot.
- **Enter on a module or method opens it.** In 1.x it did nothing.
- **More options work.** Options that 1.x silently ignored are now passed through, e.g. `sex:` on `person firstName`, `length:` on `string nanoid`, and `extension:` on `system commonFileName`.
- **Plain dates.** Dates are copied as ISO strings (`2002-01-08T03:37:57.498Z`), without quotes.
- **A refreshed icon** that reads on light and dark themes.
- **Much smaller download:** about 1 MB instead of 9 MB.

## 🔁 Still here from 1.x
- All 76 Faker locales via `lang:<code>`. Codes are case-insensitive, `-` or `_` both work, and `vi_VN` falls back to `vi`.
- `repeat:N`, quoted values (`characters:"a b c"`), and JSON values (`header:{"alg":"HS256"}`).
- `nameOrder:last-first` (or `order:lf`) on `person fullName`. Vietnamese locales now use family-name-first order automatically.
- Copy formats in the → menu: space-, newline- or comma-separated, and JSON.

## ⚠️ Changed
- With `repeat:`, Enter now copies the values **comma-separated**. Add `newline:true` for one value per line, or pick a format from the → menu.
- FlowFaker now runs as a `JavaScript_V2` plugin, still on Node.js, which Flow Launcher can install for you.

## 📦 Install
- `pm install FlowFaker` in Flow Launcher, or
- download `Flow.Launcher.Plugin.FakerJS.zip` below and drag it into Flow Launcher.

Data generation is powered by [Faker](https://fakerjs.dev). FlowFaker is not affiliated with the Faker.js project.
