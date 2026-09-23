// Generated parameter metadata for Faker methods
export interface MethodParamInfo {
  key: string;
  hint: string;
  desc: string;
}

export const METHOD_PARAM_MAP: Record<string, MethodParamInfo[]> = {
  "animal.dog": [],
  "animal.cat": [],
  "animal.snake": [],
  "animal.bear": [],
  "animal.lion": [],
  "animal.cetacean": [],
  "animal.horse": [],
  "animal.bird": [],
  "animal.cow": [],
  "animal.fish": [],
  "animal.crocodilia": [],
  "animal.insect": [],
  "animal.rabbit": [],
  "animal.rodent": [],
  "animal.type": [],
  "animal.petName": [],
  "book.author": [],
  "book.format": [],
  "book.genre": [],
  "book.publisher": [],
  "book.series": [],
  "book.title": [],
  "color.human": [],
  "color.space": [],
  "color.cssSupportedFunction": [],
  "color.cssSupportedSpace": [],
  "color.rgb": [
    {
      "key": "prefix",
      "hint": "prefix:<string>",
      "desc": "Prefix of the generated hex color. Only applied when 'hex' format is used. Defaults to `'#'`."
    },
    {
      "key": "casing",
      "hint": "casing:<upper|lower|mixed>",
      "desc": "Letter type case of the generated hex color. Only applied when `'hex'` format is used. Defaults to `'lower'`."
    },
    {
      "key": "format",
      "hint": "format:<string>",
      "desc": "Format of generated RGB color. Defaults to `hex`."
    },
    {
      "key": "includeAlpha",
      "hint": "includeAlpha:<bool>",
      "desc": "Adds an alpha value to the color (RGBA). Defaults to `false`."
    }
  ],
  "color.cmyk": [
    {
      "key": "format",
      "hint": "format:<string>",
      "desc": "Format of generated CMYK color. Defaults to `'decimal'`."
    }
  ],
  "color.hsl": [
    {
      "key": "format",
      "hint": "format:<string>",
      "desc": "Format of generated HSL color. Defaults to `'decimal'`."
    },
    {
      "key": "includeAlpha",
      "hint": "includeAlpha:<bool>",
      "desc": "Adds an alpha value to the color (RGBA). Defaults to `false`."
    }
  ],
  "color.hwb": [
    {
      "key": "format",
      "hint": "format:<string>",
      "desc": "Format of generated RGB color. Defaults to `'decimal'`."
    }
  ],
  "color.lab": [
    {
      "key": "format",
      "hint": "format:<string>",
      "desc": "Format of generated RGB color. Defaults to `'decimal'`."
    }
  ],
  "color.lch": [
    {
      "key": "format",
      "hint": "format:<string>",
      "desc": "Format of generated RGB color. Defaults to `'decimal'`."
    }
  ],
  "color.colorByCSSColorSpace": [
    {
      "key": "format",
      "hint": "format:<string>",
      "desc": "Format of generated RGB color. Defaults to `'decimal'`."
    },
    {
      "key": "space",
      "hint": "space:<value>",
      "desc": "Color space to generate the color for. Defaults to `'sRGB'`."
    }
  ],
  "commerce.department": [],
  "commerce.productName": [],
  "commerce.price": [
    {
      "key": "min",
      "hint": "min:<n>",
      "desc": "The minimum price. Defaults to `1`."
    },
    {
      "key": "max",
      "hint": "max:<n>",
      "desc": "The maximum price. Defaults to `1000`."
    },
    {
      "key": "dec",
      "hint": "dec:<n>",
      "desc": "The number of decimal places. Defaults to `2`."
    },
    {
      "key": "symbol",
      "hint": "symbol:<string>",
      "desc": "The currency value to use. Defaults to `''`."
    }
  ],
  "commerce.productAdjective": [],
  "commerce.productMaterial": [],
  "commerce.product": [],
  "commerce.productDescription": [],
  "commerce.isbn": [
    {
      "key": "variant",
      "hint": "variant:<value>",
      "desc": "The variant to return. Can be either `10` (10-digit format)"
    },
    {
      "key": "separator",
      "hint": "separator:<string>",
      "desc": "The separator to use in the format. Defaults to `'-'`."
    }
  ],
  "commerce.upc": [
    {
      "key": "prefix",
      "hint": "prefix:<string>",
      "desc": "Optional numeric prefix for the UPC body (0–11 digits)."
    }
  ],
  "company.name": [],
  "company.catchPhrase": [],
  "company.buzzPhrase": [],
  "company.catchPhraseAdjective": [],
  "company.catchPhraseDescriptor": [],
  "company.catchPhraseNoun": [],
  "company.buzzAdjective": [],
  "company.buzzVerb": [],
  "company.buzzNoun": [],
  "database.column": [],
  "database.type": [],
  "database.collation": [],
  "database.engine": [],
  "database.mongodbObjectId": [],
  "date.anytime": [
    {
      "key": "refDate",
      "hint": "refDate:<date>",
      "desc": "The date to use as reference point for the newly generated date. Defaults to `faker.defaultRefDate()`."
    }
  ],
  "date.past": [
    {
      "key": "years",
      "hint": "years:<n>",
      "desc": "The range of years the date may be in the past. Either as a fixed amount of years or as a year range. Defaults to `1`."
    },
    {
      "key": "refDate",
      "hint": "refDate:<date>",
      "desc": "The date to use as reference point for the newly generated date. Defaults to `faker.defaultRefDate()`."
    }
  ],
  "date.future": [
    {
      "key": "years",
      "hint": "years:<n>",
      "desc": "The range of years the date may be in the future. Either as a fixed amount of years or as a year range. Defaults to `1`."
    },
    {
      "key": "refDate",
      "hint": "refDate:<date>",
      "desc": "The date to use as reference point for the newly generated date. Defaults to `faker.defaultRefDate()`."
    }
  ],
  "date.between": [
    {
      "key": "from",
      "hint": "from:<date>",
      "desc": "The early date boundary."
    },
    {
      "key": "to",
      "hint": "to:<date>",
      "desc": "The late date boundary."
    }
  ],
  "date.betweens": [
    {
      "key": "from",
      "hint": "from:<date>",
      "desc": "The early date boundary."
    },
    {
      "key": "to",
      "hint": "to:<date>",
      "desc": "The late date boundary."
    },
    {
      "key": "count",
      "hint": "count:<n>",
      "desc": "The number of dates to generate. Defaults to `3`."
    }
  ],
  "date.recent": [
    {
      "key": "days",
      "hint": "days:<n>",
      "desc": "The range of days the date may be in the past. Either as a fixed amount of days or as a day range. Defaults to `1`."
    },
    {
      "key": "refDate",
      "hint": "refDate:<date>",
      "desc": "The date to use as reference point for the newly generated date. Defaults to `faker.defaultRefDate()`."
    },
    {
      "key": "min",
      "hint": "min:<n>",
      "desc": ""
    },
    {
      "key": "max",
      "hint": "max:<n>",
      "desc": ""
    }
  ],
  "date.soon": [
    {
      "key": "days",
      "hint": "days:<n>",
      "desc": "The range of days the date may be in the future. Either as a fixed amount of days or as a day range. Defaults to `1`."
    },
    {
      "key": "refDate",
      "hint": "refDate:<date>",
      "desc": "The date to use as reference point for the newly generated date. Defaults to `faker.defaultRefDate()`."
    },
    {
      "key": "min",
      "hint": "min:<n>",
      "desc": ""
    },
    {
      "key": "max",
      "hint": "max:<n>",
      "desc": ""
    }
  ],
  "date.birthdate": [
    {
      "key": "refDate",
      "hint": "refDate:<date>",
      "desc": "The date to use as reference point for the newly generated date. Defaults to `faker.defaultRefDate()`."
    },
    {
      "key": "mode",
      "hint": "mode:<value>",
      "desc": "`'age'` to generate a birthdate based on the age range. It is also possible to generate a birthdate based on a `'year'` range."
    },
    {
      "key": "min",
      "hint": "min:<n>",
      "desc": "The minimum age to generate a birthdate for."
    },
    {
      "key": "max",
      "hint": "max:<n>",
      "desc": "The maximum age to generate a birthdate for."
    }
  ],
  "date.month": [
    {
      "key": "abbreviated",
      "hint": "abbreviated:<value>",
      "desc": "Whether to return an abbreviation. Defaults to `false`."
    },
    {
      "key": "context",
      "hint": "context:<value>",
      "desc": "Whether to return the name of a month in the context of a date. In the default `en` locale this has no effect, however, in other locales like `fr` or `ru`, this may affect grammar or capitalization, for example `'январь'` with `{ context: false }` and `'января'` with `{ context: true }` in `ru`. Defaults to `false`."
    }
  ],
  "date.weekday": [
    {
      "key": "abbreviated",
      "hint": "abbreviated:<value>",
      "desc": "Whether to return an abbreviation. Defaults to `false`."
    },
    {
      "key": "context",
      "hint": "context:<value>",
      "desc": "Whether to return the day of the week in the context of a date. In the default `en` locale this has no effect, however, in other locales like `fr` or `ru`, this may affect grammar or capitalization, for example `'Lundi'` with `{ context: false }` and `'lundi'` with `{ context: true }` in `fr`. Defaults to `false`."
    }
  ],
  "date.timeZone": [],
  "finance.accountNumber": [
    {
      "key": "length",
      "hint": "length:<n>",
      "desc": "The length of the account number. Defaults to `8`."
    },
    {
      "key": "optionsOrLength",
      "hint": "optionsOrLength:<value>",
      "desc": "An options object or the length of the account number."
    }
  ],
  "finance.accountName": [],
  "finance.routingNumber": [],
  "finance.amount": [
    {
      "key": "min",
      "hint": "min:<n>",
      "desc": "The lower bound for the amount. Defaults to `0`."
    },
    {
      "key": "max",
      "hint": "max:<n>",
      "desc": "The upper bound for the amount. Defaults to `1000`."
    },
    {
      "key": "dec",
      "hint": "dec:<n>",
      "desc": "The number of decimal places for the amount. Defaults to `2`."
    },
    {
      "key": "symbol",
      "hint": "symbol:<string>",
      "desc": "The symbol used to prefix the amount. Defaults to `''`."
    },
    {
      "key": "autoFormat",
      "hint": "autoFormat:<bool>",
      "desc": "If true this method will use `Number.toLocaleString()`. Otherwise it will use `Number.toFixed()`."
    }
  ],
  "finance.transactionType": [],
  "finance.currency": [],
  "finance.currencyCode": [],
  "finance.currencyName": [],
  "finance.currencySymbol": [],
  "finance.currencyNumericCode": [],
  "finance.bitcoinAddress": [
    {
      "key": "type",
      "hint": "type:<value>",
      "desc": "The bitcoin address type (`'legacy'`, `'segwit'`, `'bech32'` or `'taproot'`). Defaults to a random address type."
    },
    {
      "key": "network",
      "hint": "network:<value>",
      "desc": "The bitcoin network (`'mainnet'` or `'testnet'`). Defaults to `'mainnet'`."
    }
  ],
  "finance.litecoinAddress": [],
  "finance.creditCardNumber": [
    {
      "key": "issuer",
      "hint": "issuer:<value>",
      "desc": "The name of the issuer (case-insensitive) or the format used to generate one."
    }
  ],
  "finance.creditCardCVV": [],
  "finance.creditCardIssuer": [],
  "finance.pin": [
    {
      "key": "length",
      "hint": "length:<n>",
      "desc": "The length of the PIN to generate. Defaults to `4`."
    }
  ],
  "finance.ethereumAddress": [],
  "finance.iban": [
    {
      "key": "formatted",
      "hint": "formatted:<value>",
      "desc": "Return a formatted version of the generated IBAN. Defaults to `false`."
    },
    {
      "key": "countryCode",
      "hint": "countryCode:<value>",
      "desc": "The country code from which you want to generate an IBAN, if none is provided a random country will be used."
    }
  ],
  "finance.bic": [
    {
      "key": "includeBranchCode",
      "hint": "includeBranchCode:<value>",
      "desc": "Whether to include a three-digit branch code at the end of the generated code. Defaults to a random boolean value."
    }
  ],
  "finance.transactionDescription": [],
  "food.adjective": [],
  "food.description": [],
  "food.dish": [],
  "food.ethnicCategory": [],
  "food.fruit": [],
  "food.ingredient": [],
  "food.meat": [],
  "food.spice": [],
  "food.vegetable": [],
  "git.branch": [],
  "git.commitEntry": [
    {
      "key": "merge",
      "hint": "merge:<value>",
      "desc": "Whether to generate a merge message line. Defaults to 20% `true` and 80% `false`."
    },
    {
      "key": "eol",
      "hint": "eol:<value>",
      "desc": "Choose the end of line character to use. Defaults to `'CRLF'`."
    },
    {
      "key": "refDate",
      "hint": "refDate:<date>",
      "desc": "The date to use as reference point for the commit. Defaults to `new Date()`."
    },
    {
      "key": "probability",
      "hint": "probability:<value>",
      "desc": ""
    }
  ],
  "git.commitMessage": [],
  "git.commitDate": [
    {
      "key": "refDate",
      "hint": "refDate:<date>",
      "desc": "The date to use as reference point for the commit. Defaults to `faker.defaultRefDate()`."
    }
  ],
  "git.commitSha": [
    {
      "key": "length",
      "hint": "length:<n>",
      "desc": "The length of the commit sha. Defaults to `40`."
    }
  ],
  "hacker.abbreviation": [],
  "hacker.adjective": [],
  "hacker.noun": [],
  "hacker.verb": [],
  "hacker.ingverb": [],
  "hacker.phrase": [],
  "helpers.slugify": [
    {
      "key": "string",
      "hint": "string:<value>",
      "desc": "The input to slugify. Defaults to `''`."
    }
  ],
  "helpers.replaceSymbols": [
    {
      "key": "string",
      "hint": "string:<value>",
      "desc": "The template string to parse. Defaults to `''`."
    }
  ],
  "helpers.replaceCreditCardSymbols": [
    {
      "key": "string",
      "hint": "string:<value>",
      "desc": "The credit card format pattern. Defaults to `'6453-####-####-####-###L'`."
    },
    {
      "key": "symbol",
      "hint": "symbol:<string>",
      "desc": "The symbol to replace with a digit. Defaults to `'#'`."
    }
  ],
  "helpers.fromRegExp": [
    {
      "key": "pattern",
      "hint": "pattern:<value>",
      "desc": "The template stringRegExp to generate a matching string for."
    }
  ],
  "helpers.mustache": [
    {
      "key": "list",
      "hint": "list:<value>",
      "desc": "The array to shuffle."
    },
    {
      "key": "inplace",
      "hint": "inplace:<value>",
      "desc": "Whether to shuffle the array in place or return a new array. Defaults to `false`."
    },
    {
      "key": "source",
      "hint": "source:<value>",
      "desc": "The strings to choose from or a function that generates a string."
    },
    {
      "key": "length",
      "hint": "length:<n>",
      "desc": "The number of elements to generate."
    },
    {
      "key": "text",
      "hint": "text:<value>",
      "desc": "The template string to parse."
    },
    {
      "key": "data",
      "hint": "data:<value>",
      "desc": "The data used to populate the placeholders."
    }
  ],
  "helpers.rangeToNumber": [
    {
      "key": "callback",
      "hint": "callback:<value>",
      "desc": "The callback that will be invoked if the probability check was successful."
    },
    {
      "key": "probability",
      "hint": "probability:<value>",
      "desc": "The probability (`[0.00, 1.00]`) of the callback being invoked. Defaults to `0.5`."
    },
    {
      "key": "object",
      "hint": "object:<value>",
      "desc": "The object to be used."
    },
    {
      "key": "array",
      "hint": "array:<value>",
      "desc": "The array to pick the value from."
    },
    {
      "key": "count",
      "hint": "count:<n>",
      "desc": "Number or range of elements to pick."
    },
    {
      "key": "enumObject",
      "hint": "enumObject:<value>",
      "desc": "Enum to pick the value from."
    },
    {
      "key": "numberOrRange",
      "hint": "numberOrRange:<value>",
      "desc": "The number or range to convert."
    },
    {
      "key": "min",
      "hint": "min:<n>",
      "desc": "The minimum value for the range."
    },
    {
      "key": "max",
      "hint": "max:<n>",
      "desc": "The maximum value for the range."
    }
  ],
  "helpers.fake": [
    {
      "key": "pattern",
      "hint": "pattern:<value>",
      "desc": "The pattern string that will get interpolated."
    },
    {
      "key": "patterns",
      "hint": "patterns:<value>",
      "desc": "The array to select a pattern from, that will then get interpolated. Must not be empty."
    }
  ],
  "person.firstName": [
    {
      "key": "sex",
      "hint": "sex:<female|male>",
      "desc": "The optional sex to use."
    }
  ],
  "person.lastName": [
    {
      "key": "sex",
      "hint": "sex:<female|male>",
      "desc": "The optional sex to use."
    }
  ],
  "person.middleName": [
    {
      "key": "sex",
      "hint": "sex:<female|male>",
      "desc": "The optional sex to use."
    }
  ],
  "person.fullName": [
    {
      "key": "firstName",
      "hint": "firstName:<value>",
      "desc": "The optional first name to use. If not specified a random one will be chosen."
    },
    {
      "key": "lastName",
      "hint": "lastName:<value>",
      "desc": "The optional last name to use. If not specified a random one will be chosen."
    },
    {
      "key": "sex",
      "hint": "sex:<female|male>",
      "desc": "The optional sex to use. Can be either `'female'` or `'male'`."
    }
  ],
  "person.gender": [],
  "person.sex": [],
  "person.sexType": [
    {
      "key": "includeGeneric",
      "hint": "includeGeneric:<value>",
      "desc": "Whether `'generic'` should be included in the potential outputs."
    }
  ],
  "person.bio": [],
  "person.prefix": [
    {
      "key": "sex",
      "hint": "sex:<female|male>",
      "desc": "The optional sex to use. Can be either `'female'` or `'male'`."
    }
  ],
  "person.suffix": [],
  "person.jobTitle": [],
  "person.jobDescriptor": [],
  "person.jobArea": [],
  "person.jobType": [],
  "person.zodiacSign": [],
  "image.avatar": [],
  "image.avatarGitHub": [],
  "image.personPortrait": [
    {
      "key": "sex",
      "hint": "sex:<female|male>",
      "desc": "The sex of the person for the avatar. Can be `'female'` or `'male'`. If not provided or `'generic'`, defaults to a random selection."
    },
    {
      "key": "size",
      "hint": "size:<value>",
      "desc": "The size of the image. Can be `512`, `256`, `128`, `64` or `32`. If not provided, defaults to `512`."
    }
  ],
  "image.url": [
    {
      "key": "width",
      "hint": "width:<value>",
      "desc": "The width of the image. Defaults to a random integer between `1` and `3999`."
    },
    {
      "key": "height",
      "hint": "height:<value>",
      "desc": "The height of the image. Defaults to a random integer between `1` and `3999`."
    },
    {
      "key": "min",
      "hint": "min:<n>",
      "desc": ""
    },
    {
      "key": "max",
      "hint": "max:<n>",
      "desc": ""
    }
  ],
  "image.urlLoremFlickr": [
    {
      "key": "width",
      "hint": "width:<value>",
      "desc": "The width of the image. Defaults to a random integer between `1` and `3999`."
    },
    {
      "key": "height",
      "hint": "height:<value>",
      "desc": "The height of the image. Defaults to a random integer between `1` and `3999`."
    },
    {
      "key": "category",
      "hint": "category:<value>",
      "desc": "Category to use for the image."
    },
    {
      "key": "min",
      "hint": "min:<n>",
      "desc": ""
    },
    {
      "key": "max",
      "hint": "max:<n>",
      "desc": ""
    }
  ],
  "image.urlPicsumPhotos": [
    {
      "key": "width",
      "hint": "width:<value>",
      "desc": "The width of the image. Defaults to a random integer between `1` and `3999`."
    },
    {
      "key": "height",
      "hint": "height:<value>",
      "desc": "The height of the image. Defaults to a random integer between `1` and `3999`."
    },
    {
      "key": "grayscale",
      "hint": "grayscale:<value>",
      "desc": "Whether the image should be grayscale. Defaults to a random boolean value."
    },
    {
      "key": "blur",
      "hint": "blur:<value>",
      "desc": "Whether the image should be blurred. `0` disables the blur. Defaults to a random integer between `0` and `10`."
    },
    {
      "key": "min",
      "hint": "min:<n>",
      "desc": ""
    },
    {
      "key": "max",
      "hint": "max:<n>",
      "desc": ""
    }
  ],
  "image.dataUri": [
    {
      "key": "width",
      "hint": "width:<value>",
      "desc": "The width of the image. Defaults to a random integer between `1` and `3999`."
    },
    {
      "key": "height",
      "hint": "height:<value>",
      "desc": "The height of the image. Defaults to a random integer between `1` and `3999`."
    },
    {
      "key": "color",
      "hint": "color:<value>",
      "desc": "The color of the image. Must be a color supported by svg. Defaults to a random color."
    },
    {
      "key": "type",
      "hint": "type:<value>",
      "desc": "The type of the image. Defaults to a random type."
    },
    {
      "key": "min",
      "hint": "min:<n>",
      "desc": ""
    },
    {
      "key": "max",
      "hint": "max:<n>",
      "desc": ""
    }
  ],
  "internet.email": [
    {
      "key": "firstName",
      "hint": "firstName:<value>",
      "desc": "The optional first name to use. If not specified, a random one will be chosen."
    },
    {
      "key": "lastName",
      "hint": "lastName:<value>",
      "desc": "The optional last name to use. If not specified, a random one will be chosen."
    },
    {
      "key": "provider",
      "hint": "provider:<string>",
      "desc": "The mail provider domain to use. If not specified, a random free mail provider will be chosen."
    },
    {
      "key": "allowSpecialCharacters",
      "hint": "allowSpecialCharacters:<value>",
      "desc": "Whether special characters such as ``.!#$%&'+-=?^_`{|}~`` should be included"
    }
  ],
  "internet.exampleEmail": [
    {
      "key": "firstName",
      "hint": "firstName:<value>",
      "desc": "The optional first name to use. If not specified, a random one will be chosen."
    },
    {
      "key": "lastName",
      "hint": "lastName:<value>",
      "desc": "The optional last name to use. If not specified, a random one will be chosen."
    },
    {
      "key": "allowSpecialCharacters",
      "hint": "allowSpecialCharacters:<value>",
      "desc": "Whether special characters such as ``.!#$%&'+-=?^_`{|}~`` should be included"
    }
  ],
  "internet.username": [
    {
      "key": "firstName",
      "hint": "firstName:<value>",
      "desc": "The optional first name to use. If not specified, a random one will be chosen."
    },
    {
      "key": "lastName",
      "hint": "lastName:<value>",
      "desc": "The optional last name to use. If not specified, a random one will be chosen."
    }
  ],
  "internet.displayName": [
    {
      "key": "firstName",
      "hint": "firstName:<value>",
      "desc": "The optional first name to use. If not specified, a random one will be chosen."
    },
    {
      "key": "lastName",
      "hint": "lastName:<value>",
      "desc": "The optional last name to use. If not specified, a random one will be chosen."
    }
  ],
  "internet.protocol": [],
  "internet.httpMethod": [],
  "internet.httpStatusCode": [
    {
      "key": "types",
      "hint": "types:<value>",
      "desc": "A list of the HTTP status code types that should be used."
    }
  ],
  "internet.url": [
    {
      "key": "appendSlash",
      "hint": "appendSlash:<value>",
      "desc": "Whether to append a slash to the end of the url (path). Defaults to a random boolean value."
    },
    {
      "key": "protocol",
      "hint": "protocol:<value>",
      "desc": "The protocol to use. Defaults to `'https'`."
    }
  ],
  "internet.domainName": [],
  "internet.domainSuffix": [],
  "internet.domainWord": [],
  "internet.ip": [],
  "internet.ipv4": [
    {
      "key": "cidrBlock",
      "hint": "cidrBlock:<value>",
      "desc": "The optional CIDR block to use. Must be in the format `x.x.x.xy`. Defaults to `'0.0.0.00'`."
    },
    {
      "key": "network",
      "hint": "network:<value>",
      "desc": "The optional network to use. This is intended as an alias for well-known `cidrBlock`s. Defaults to `'any'`."
    }
  ],
  "internet.ipv6": [],
  "internet.port": [],
  "internet.userAgent": [],
  "internet.mac": [
    {
      "key": "separator",
      "hint": "separator:<string>",
      "desc": "The optional separator to use. Can be either `':'`, `'-'` or `''`. Defaults to `':'`."
    }
  ],
  "internet.password": [
    {
      "key": "length",
      "hint": "length:<n>",
      "desc": "The length of the password to generate. Defaults to `15`."
    },
    {
      "key": "memorable",
      "hint": "memorable:<value>",
      "desc": "Whether the generated password should be memorable. Defaults to `false`."
    },
    {
      "key": "pattern",
      "hint": "pattern:<value>",
      "desc": "The pattern that all chars should match."
    },
    {
      "key": "prefix",
      "hint": "prefix:<string>",
      "desc": "The prefix to use. Defaults to `''`."
    }
  ],
  "internet.emoji": [
    {
      "key": "types",
      "hint": "types:<value>",
      "desc": "A list of the emoji types that should be included. Possible values are `'smiley'`, `'body'`, `'person'`, `'nature'`, `'food'`, `'travel'`, `'activity'`, `'object'`, `'symbol'`, `'flag'`. By default, emojis from any type will be included."
    }
  ],
  "internet.jwtAlgorithm": [],
  "internet.jwt": [
    {
      "key": "header",
      "hint": "header:<value>",
      "desc": "The Header to use for the token. Defaults to a random object with the following fields: `alg` and `typ`."
    },
    {
      "key": "payload",
      "hint": "payload:<value>",
      "desc": "The Payload to use for the token. Defaults to a random object with the following fields: `iat`, `exp`, `nbf`, `iss`, `sub`, `aud`, and `jti`."
    },
    {
      "key": "refDate",
      "hint": "refDate:<date>",
      "desc": "The date to use as reference point for the newly generated date."
    },
    {
      "key": "alg",
      "hint": "alg:<value>",
      "desc": ""
    },
    {
      "key": "typ",
      "hint": "typ:<value>",
      "desc": ""
    }
  ],
  "location.latitude": [
    {
      "key": "max",
      "hint": "max:<n>",
      "desc": "The upper bound for the latitude to generate. Defaults to `90`."
    },
    {
      "key": "min",
      "hint": "min:<n>",
      "desc": "The lower bound for the latitude to generate. Defaults to `-90`."
    },
    {
      "key": "precision",
      "hint": "precision:<n>",
      "desc": "The number of decimal points of precision for the latitude. Defaults to `4`."
    }
  ],
  "location.longitude": [
    {
      "key": "max",
      "hint": "max:<n>",
      "desc": "The upper bound for the longitude to generate. Defaults to `180`."
    },
    {
      "key": "min",
      "hint": "min:<n>",
      "desc": "The lower bound for the longitude to generate. Defaults to `-180`."
    },
    {
      "key": "precision",
      "hint": "precision:<n>",
      "desc": "The number of decimal points of precision for the longitude. Defaults to `4`."
    }
  ],
  "location.nearbyGPSCoordinate": [
    {
      "key": "origin",
      "hint": "origin:<value>",
      "desc": "The original coordinate to get a new coordinate close to."
    },
    {
      "key": "radius",
      "hint": "radius:<value>",
      "desc": "The maximum distance from the given coordinate to the new coordinate. Defaults to `10`."
    },
    {
      "key": "isMetric",
      "hint": "isMetric:<value>",
      "desc": "If `true` assume the radius to be in kilometers. If `false` for miles. Defaults to `false`."
    },
    {
      "key": "latitude",
      "hint": "latitude:<value>",
      "desc": ""
    },
    {
      "key": "longitude",
      "hint": "longitude:<value>",
      "desc": ""
    }
  ],
  "location.zipCode": [
    {
      "key": "state",
      "hint": "state:<value>",
      "desc": "The state to generate the zip code for."
    },
    {
      "key": "format",
      "hint": "format:<string>",
      "desc": "The optional format used to generate the zip code."
    }
  ],
  "location.city": [],
  "location.buildingNumber": [],
  "location.street": [],
  "location.streetAddress": [
    {
      "key": "useFullAddress",
      "hint": "useFullAddress:<value>",
      "desc": "When true this will generate a full address."
    }
  ],
  "location.postalAddress": [],
  "location.secondaryAddress": [],
  "location.county": [],
  "location.country": [],
  "location.continent": [],
  "location.countryCode": [
    {
      "key": "variant",
      "hint": "variant:<value>",
      "desc": "The variant to return. Can be one of:"
    }
  ],
  "location.state": [
    {
      "key": "abbreviated",
      "hint": "abbreviated:<value>",
      "desc": "If true this will return abbreviated first-level administrative entity names."
    }
  ],
  "location.direction": [
    {
      "key": "abbreviated",
      "hint": "abbreviated:<value>",
      "desc": "If true this will return abbreviated directions (NW, E, etc)."
    }
  ],
  "location.cardinalDirection": [
    {
      "key": "abbreviated",
      "hint": "abbreviated:<value>",
      "desc": "If true this will return abbreviated directions (N, E, etc)."
    }
  ],
  "location.ordinalDirection": [
    {
      "key": "abbreviated",
      "hint": "abbreviated:<value>",
      "desc": "If true this will return abbreviated directions (NW, SE, etc)."
    }
  ],
  "location.timeZone": [],
  "location.language": [],
  "lorem.word": [
    {
      "key": "length",
      "hint": "length:<n>",
      "desc": "The expected length of the word."
    },
    {
      "key": "strategy",
      "hint": "strategy:<fail|shortest|longest>",
      "desc": "The strategy to apply when no words with a matching length are found. Defaults to `'fail'`."
    }
  ],
  "lorem.words": [
    {
      "key": "wordCount",
      "hint": "wordCount:<n>",
      "desc": "The number of words to generate. Defaults to `3`."
    },
    {
      "key": "min",
      "hint": "min:<n>",
      "desc": "The minimum number of words to generate."
    },
    {
      "key": "max",
      "hint": "max:<n>",
      "desc": "The maximum number of words to generate."
    }
  ],
  "lorem.sentence": [
    {
      "key": "wordCount",
      "hint": "wordCount:<n>",
      "desc": "The number of words, that should be in the sentence. Defaults to a random number between `3` and `10`."
    },
    {
      "key": "min",
      "hint": "min:<n>",
      "desc": "The minimum number of words to generate. Defaults to `3`."
    },
    {
      "key": "max",
      "hint": "max:<n>",
      "desc": "The maximum number of words to generate. Defaults to `10`."
    }
  ],
  "lorem.slug": [
    {
      "key": "wordCount",
      "hint": "wordCount:<n>",
      "desc": "The number of words to generate. Defaults to `3`."
    },
    {
      "key": "min",
      "hint": "min:<n>",
      "desc": "The minimum number of words to generate."
    },
    {
      "key": "max",
      "hint": "max:<n>",
      "desc": "The maximum number of words to generate."
    }
  ],
  "lorem.sentences": [
    {
      "key": "sentenceCount",
      "hint": "sentenceCount:<n>",
      "desc": "The number of sentences to generate. Defaults to a random number between `2` and `6`."
    },
    {
      "key": "min",
      "hint": "min:<n>",
      "desc": "The minimum number of sentences to generate. Defaults to `2`."
    },
    {
      "key": "max",
      "hint": "max:<n>",
      "desc": "The maximum number of sentences to generate. Defaults to `6`."
    },
    {
      "key": "separator",
      "hint": "separator:<string>",
      "desc": "The separator to add between sentences. Defaults to `' '`."
    }
  ],
  "lorem.paragraph": [
    {
      "key": "sentenceCount",
      "hint": "sentenceCount:<n>",
      "desc": "The number of sentences to generate. Defaults to `3`."
    },
    {
      "key": "min",
      "hint": "min:<n>",
      "desc": "The minimum number of sentences to generate."
    },
    {
      "key": "max",
      "hint": "max:<n>",
      "desc": "The maximum number of sentences to generate."
    }
  ],
  "lorem.paragraphs": [
    {
      "key": "paragraphCount",
      "hint": "paragraphCount:<n>",
      "desc": "The number of paragraphs to generate. Defaults to `3`."
    },
    {
      "key": "min",
      "hint": "min:<n>",
      "desc": "The minimum number of paragraphs to generate."
    },
    {
      "key": "max",
      "hint": "max:<n>",
      "desc": "The maximum number of paragraphs to generate."
    },
    {
      "key": "separator",
      "hint": "separator:<string>",
      "desc": "The separator to use. Defaults to `'\\n'`."
    }
  ],
  "lorem.text": [],
  "lorem.lines": [
    {
      "key": "lineCount",
      "hint": "lineCount:<n>",
      "desc": "The number of lines to generate. Defaults to a random number between `1` and `5`."
    },
    {
      "key": "min",
      "hint": "min:<n>",
      "desc": "The minimum number of lines to generate. Defaults to `1`."
    },
    {
      "key": "max",
      "hint": "max:<n>",
      "desc": "The maximum number of lines to generate. Defaults to `5`."
    }
  ],
  "music.album": [],
  "music.artist": [],
  "music.genre": [],
  "music.songName": [],
  "phone.number": [
    {
      "key": "style",
      "hint": "style:<value>",
      "desc": "Style of the phone number. Defaults to `'human'`."
    },
    {
      "key": "number",
      "hint": "number:<value>",
      "desc": ""
    }
  ],
  "phone.imei": [],
  "science.chemicalElement": [],
  "science.unit": [],
  "system.fileName": [
    {
      "key": "extensionCount",
      "hint": "extensionCount:<n>",
      "desc": "Define how many extensions the file name should have. Defaults to `1`."
    }
  ],
  "system.commonFileName": [
    {
      "key": "extension",
      "hint": "extension:<value>",
      "desc": "The file extension to use. Empty string is considered to be not set."
    }
  ],
  "system.mimeType": [],
  "system.commonFileType": [],
  "system.commonFileExt": [],
  "system.fileType": [],
  "system.fileExt": [
    {
      "key": "mimeType",
      "hint": "mimeType:<value>",
      "desc": "Valid [mime-type](https:github.comjshttpmime-dbblobmasterdb.json)"
    }
  ],
  "system.directoryPath": [],
  "system.filePath": [],
  "system.semver": [],
  "system.networkInterface": [
    {
      "key": "interfaceType",
      "hint": "interfaceType:<value>",
      "desc": "The interface type. Can be one of `en`, `wl`, `ww`."
    },
    {
      "key": "interfaceSchema",
      "hint": "interfaceSchema:<value>",
      "desc": "The interface schema. Can be one of `index`, `slot`, `mac`, `pci`."
    }
  ],
  "system.cron": [
    {
      "key": "includeYear",
      "hint": "includeYear:<value>",
      "desc": "Whether to include a year in the generated expression. Defaults to `false`."
    },
    {
      "key": "includeNonStandard",
      "hint": "includeNonStandard:<value>",
      "desc": "Whether to include a `@yearly`, `@monthly`, `@daily`, etc text labels in the generated expression. Defaults to `false`."
    }
  ],
  "vehicle.vehicle": [],
  "vehicle.manufacturer": [],
  "vehicle.model": [],
  "vehicle.type": [],
  "vehicle.fuel": [],
  "vehicle.vin": [],
  "vehicle.color": [],
  "vehicle.vrm": [],
  "vehicle.bicycle": [],
  "word.adjective": [
    {
      "key": "length",
      "hint": "length:<n>",
      "desc": "The expected length of the word."
    },
    {
      "key": "strategy",
      "hint": "strategy:<fail|shortest|longest>",
      "desc": "The strategy to apply when no words with a matching length are found."
    }
  ],
  "word.adverb": [
    {
      "key": "length",
      "hint": "length:<n>",
      "desc": "The expected length of the word."
    },
    {
      "key": "strategy",
      "hint": "strategy:<fail|shortest|longest>",
      "desc": "The strategy to apply when no words with a matching length are found."
    }
  ],
  "word.conjunction": [
    {
      "key": "length",
      "hint": "length:<n>",
      "desc": "The expected length of the word."
    },
    {
      "key": "strategy",
      "hint": "strategy:<fail|shortest|longest>",
      "desc": "The strategy to apply when no words with a matching length are found."
    }
  ],
  "word.interjection": [
    {
      "key": "length",
      "hint": "length:<n>",
      "desc": "The expected length of the word."
    },
    {
      "key": "strategy",
      "hint": "strategy:<fail|shortest|longest>",
      "desc": "The strategy to apply when no words with a matching length are found."
    }
  ],
  "word.noun": [
    {
      "key": "length",
      "hint": "length:<n>",
      "desc": "The expected length of the word."
    },
    {
      "key": "strategy",
      "hint": "strategy:<fail|shortest|longest>",
      "desc": "The strategy to apply when no words with a matching length are found."
    }
  ],
  "word.preposition": [
    {
      "key": "length",
      "hint": "length:<n>",
      "desc": "The expected length of the word."
    },
    {
      "key": "strategy",
      "hint": "strategy:<fail|shortest|longest>",
      "desc": "The strategy to apply when no words with a matching length are found."
    }
  ],
  "word.verb": [
    {
      "key": "length",
      "hint": "length:<n>",
      "desc": "The expected length of the word."
    },
    {
      "key": "strategy",
      "hint": "strategy:<fail|shortest|longest>",
      "desc": "The strategy to apply when no words with a matching length are found."
    }
  ],
  "word.sample": [
    {
      "key": "length",
      "hint": "length:<n>",
      "desc": "The expected length of the word."
    },
    {
      "key": "strategy",
      "hint": "strategy:<fail|shortest|longest>",
      "desc": "The strategy to apply when no words with a matching length are found."
    }
  ],
  "word.words": [
    {
      "key": "count",
      "hint": "count:<n>",
      "desc": "The number of words to return. Defaults to a random value between `1` and `3`."
    }
  ],
  "datatype.boolean": [
    {
      "key": "probability",
      "hint": "probability:<value>",
      "desc": "The probability (`[0.00, 1.00]`) of returning `true`. Defaults to `0.5`."
    }
  ],
  "number.int": [
    {
      "key": "min",
      "hint": "min:<n>",
      "desc": "Lower bound for generated number. Defaults to `0`."
    },
    {
      "key": "max",
      "hint": "max:<n>",
      "desc": "Upper bound for generated number. Defaults to `Number.MAX_SAFE_INTEGER`."
    },
    {
      "key": "multipleOf",
      "hint": "multipleOf:<n>",
      "desc": "Generated number will be a multiple of the given integer. Defaults to `1`."
    },
    {
      "key": "distributor",
      "hint": "distributor:<value>",
      "desc": "A function to determine the distribution of generated values. Defaults to `uniformDistributor()`."
    }
  ],
  "number.float": [
    {
      "key": "min",
      "hint": "min:<n>",
      "desc": "Lower bound for generated number, inclusive. Defaults to `0.0`."
    },
    {
      "key": "max",
      "hint": "max:<n>",
      "desc": "Upper bound for generated number, exclusive, unless `multipleOf` or `fractionDigits` are passed. Defaults to `1.0`."
    },
    {
      "key": "multipleOf",
      "hint": "multipleOf:<n>",
      "desc": "The generated number will be a multiple of this parameter. Only one of `multipleOf` or `fractionDigits` should be passed."
    },
    {
      "key": "fractionDigits",
      "hint": "fractionDigits:<n>",
      "desc": "The maximum number of digits to appear after the decimal point, for example `2` will round to 2 decimal points. Only one of `multipleOf` or `fractionDigits` should be passed."
    },
    {
      "key": "distributor",
      "hint": "distributor:<value>",
      "desc": "A function to determine the distribution of generated values. Defaults to `uniformDistributor()`."
    }
  ],
  "number.binary": [
    {
      "key": "min",
      "hint": "min:<n>",
      "desc": "Lower bound for generated number. Defaults to `0`."
    },
    {
      "key": "max",
      "hint": "max:<n>",
      "desc": "Upper bound for generated number. Defaults to `1`."
    }
  ],
  "number.octal": [
    {
      "key": "min",
      "hint": "min:<n>",
      "desc": "Lower bound for generated number. Defaults to `0`."
    },
    {
      "key": "max",
      "hint": "max:<n>",
      "desc": "Upper bound for generated number. Defaults to `7`."
    }
  ],
  "number.hex": [
    {
      "key": "min",
      "hint": "min:<n>",
      "desc": "Lower bound for generated number. Defaults to `0`."
    },
    {
      "key": "max",
      "hint": "max:<n>",
      "desc": "Upper bound for generated number. Defaults to `15`."
    }
  ],
  "number.bigInt": [
    {
      "key": "min",
      "hint": "min:<n>",
      "desc": "Lower bound for generated bigint. Defaults to `0n`."
    },
    {
      "key": "max",
      "hint": "max:<n>",
      "desc": "Upper bound for generated bigint. Defaults to `min + 999999999999999n`."
    },
    {
      "key": "multipleOf",
      "hint": "multipleOf:<n>",
      "desc": "The generated bigint will be a multiple of this parameter. Defaults to `1n`."
    }
  ],
  "number.romanNumeral": [
    {
      "key": "min",
      "hint": "min:<n>",
      "desc": "Lower bound for generated roman numerals. Defaults to `1`."
    },
    {
      "key": "max",
      "hint": "max:<n>",
      "desc": "Upper bound for generated roman numerals. Defaults to `3999`."
    }
  ],
  "string.fromCharacters": [
    {
      "key": "characters",
      "hint": "characters:<value>",
      "desc": "The characters to use for the string. Can be a string or an array of characters."
    },
    {
      "key": "length",
      "hint": "length:<n>",
      "desc": "The length of the string to generate either as a fixed length or as a length range. Defaults to `1`."
    },
    {
      "key": "min",
      "hint": "min:<n>",
      "desc": "The minimum length of the string to generate."
    },
    {
      "key": "max",
      "hint": "max:<n>",
      "desc": "The maximum length of the string to generate."
    }
  ],
  "string.alpha": [
    {
      "key": "length",
      "hint": "length:<n>",
      "desc": "The length of the string to generate either as a fixed length or as a length range. Defaults to `1`."
    },
    {
      "key": "casing",
      "hint": "casing:<upper|lower|mixed>",
      "desc": "The casing of the characters. Defaults to `'mixed'`."
    },
    {
      "key": "exclude",
      "hint": "exclude:<value>",
      "desc": "An array with characters which should be excluded in the generated string. Defaults to `[]`."
    }
  ],
  "string.alphanumeric": [
    {
      "key": "length",
      "hint": "length:<n>",
      "desc": "The length of the string to generate either as a fixed length or as a length range. Defaults to `1`."
    },
    {
      "key": "casing",
      "hint": "casing:<upper|lower|mixed>",
      "desc": "The casing of the characters. Defaults to `'mixed'`."
    },
    {
      "key": "exclude",
      "hint": "exclude:<value>",
      "desc": "An array of characters and digits which should be excluded in the generated string. Defaults to `[]`."
    }
  ],
  "string.binary": [
    {
      "key": "length",
      "hint": "length:<n>",
      "desc": "The length of the string (excluding the prefix) to generate either as a fixed length or as a length range. Defaults to `1`."
    },
    {
      "key": "prefix",
      "hint": "prefix:<string>",
      "desc": "Prefix for the generated number. Defaults to `'0b'`."
    }
  ],
  "string.octal": [
    {
      "key": "length",
      "hint": "length:<n>",
      "desc": "The length of the string (excluding the prefix) to generate either as a fixed length or as a length range. Defaults to `1`."
    },
    {
      "key": "prefix",
      "hint": "prefix:<string>",
      "desc": "Prefix for the generated number. Defaults to `'0o'`."
    }
  ],
  "string.hexadecimal": [
    {
      "key": "length",
      "hint": "length:<n>",
      "desc": "The length of the string (excluding the prefix) to generate either as a fixed length or as a length range. Defaults to `1`."
    },
    {
      "key": "casing",
      "hint": "casing:<upper|lower|mixed>",
      "desc": "Casing of the generated number. Defaults to `'mixed'`."
    },
    {
      "key": "prefix",
      "hint": "prefix:<string>",
      "desc": "Prefix for the generated number. Defaults to `'0x'`."
    }
  ],
  "string.numeric": [
    {
      "key": "length",
      "hint": "length:<n>",
      "desc": "The length of the string to generate either as a fixed length or as a length range. Defaults to `1`."
    },
    {
      "key": "allowLeadingZeros",
      "hint": "allowLeadingZeros:<value>",
      "desc": "Whether leading zeros are allowed or not. Defaults to `true`."
    },
    {
      "key": "exclude",
      "hint": "exclude:<value>",
      "desc": "An array of digits which should be excluded in the generated string. Defaults to `[]`."
    }
  ],
  "string.sample": [
    {
      "key": "length",
      "hint": "length:<n>",
      "desc": "The length of the string to generate either as a fixed length or as a length range. Defaults to `10`."
    },
    {
      "key": "min",
      "hint": "min:<n>",
      "desc": "The minimum length of the string to generate."
    },
    {
      "key": "max",
      "hint": "max:<n>",
      "desc": "The maximum length of the string to generate."
    }
  ],
  "string.uuid": [
    {
      "key": "version",
      "hint": "version:<value>",
      "desc": "The specific UUID version to use."
    },
    {
      "key": "refDate",
      "hint": "refDate:<date>",
      "desc": "The timestamp to encode into the uuid."
    }
  ],
  "string.ulid": [
    {
      "key": "refDate",
      "hint": "refDate:<date>",
      "desc": "The timestamp to encode into the ULID."
    },
    {
      "key": "01T00",
      "hint": "01T00:<value>",
      "desc": ""
    },
    {
      "key": "00",
      "hint": "00:<value>",
      "desc": ""
    },
    {
      "key": "02T05",
      "hint": "02T05:<value>",
      "desc": ""
    },
    {
      "key": "31",
      "hint": "31:<value>",
      "desc": ""
    }
  ],
  "string.nanoid": [
    {
      "key": "length",
      "hint": "length:<n>",
      "desc": "The length of the string to generate either as a fixed length or as a length range. Defaults to `21`."
    },
    {
      "key": "min",
      "hint": "min:<n>",
      "desc": "The minimum length of the Nano ID to generate."
    },
    {
      "key": "max",
      "hint": "max:<n>",
      "desc": "The maximum length of the Nano ID to generate."
    }
  ],
  "string.symbol": [
    {
      "key": "length",
      "hint": "length:<n>",
      "desc": "The length of the string to generate either as a fixed length or as a length range. Defaults to `1`."
    },
    {
      "key": "min",
      "hint": "min:<n>",
      "desc": "The minimum length of the string to generate."
    },
    {
      "key": "max",
      "hint": "max:<n>",
      "desc": "The maximum length of the string to generate."
    }
  ],
  "airline.airport": [],
  "airline.airline": [],
  "airline.airplane": [],
  "airline.recordLocator": [
    {
      "key": "allowNumerics",
      "hint": "allowNumerics:<value>",
      "desc": "Whether to allow numeric characters. Defaults to `false`."
    },
    {
      "key": "allowVisuallySimilarCharacters",
      "hint": "allowVisuallySimilarCharacters:<value>",
      "desc": "Whether to allow visually similar characters such as '1' and 'I'. Defaults to `false`."
    }
  ],
  "airline.seat": [
    {
      "key": "aircraftType",
      "hint": "aircraftType:<value>",
      "desc": "The aircraft type. Can be one of `narrowbody`, `regional`, `widebody`. Defaults to `narrowbody`."
    }
  ],
  "airline.aircraftType": [],
  "airline.flightNumber": [
    {
      "key": "length",
      "hint": "length:<n>",
      "desc": "The number or range of digits to generate. Defaults to `{ min: 1, max: 4 }`."
    },
    {
      "key": "addLeadingZeros",
      "hint": "addLeadingZeros:<value>",
      "desc": "Whether to pad the flight number up to 4 digits with leading zeros. Defaults to `false`."
    },
    {
      "key": "min",
      "hint": "min:<n>",
      "desc": ""
    },
    {
      "key": "max",
      "hint": "max:<n>",
      "desc": ""
    }
  ]
};

export const METHOD_DESCRIPTIONS: Record<string, string> = {
  "animal.dog": "Returns a random dog breed.",
  "animal.cat": "Returns a random cat breed.",
  "animal.snake": "Returns a random snake species.",
  "animal.bear": "Returns a random bear species.",
  "animal.lion": "Returns a random lion species.",
  "animal.cetacean": "Returns a random cetacean species.",
  "animal.horse": "Returns a random horse breed.",
  "animal.bird": "Returns a random bird species.",
  "animal.cow": "Returns a random cow species.",
  "animal.fish": "Returns a random fish species.",
  "animal.crocodilia": "Returns a random crocodilian species.",
  "animal.insect": "Returns a random insect species.",
  "animal.rabbit": "Returns a random rabbit species.",
  "animal.rodent": "Returns a random rodent breed.",
  "animal.type": "Returns a random animal type.",
  "animal.petName": "Returns a random pet name.",
  "book.author": "Returns a random author name.",
  "book.format": "Returns a random book format.",
  "book.genre": "Returns a random genre.",
  "book.publisher": "Returns a random publisher.",
  "book.series": "Returns a random series.",
  "book.title": "Returns a random title.",
  "color.human": "Returns a random human-readable color name.",
  "color.space": "Returns a random color space name from the worldwide accepted color spaces.",
  "color.cssSupportedFunction": "Returns a random CSS-supported color function name.",
  "color.cssSupportedSpace": "Returns a random CSS-supported color space name.",
  "color.rgb": "Returns an RGB color.",
  "color.cmyk": "Returns a CMYK color.",
  "color.hsl": "Returns an HSL color.",
  "color.hwb": "Returns an HWB color.",
  "color.lab": "Returns a LAB (CIELAB) color.",
  "color.lch": "Returns an LCH color. Even though upper bound of",
  "color.colorByCSSColorSpace": "Returns a random color based on CSS color space specified.",
  "commerce.department": "Returns a department inside a shop.",
  "commerce.productName": "Generates a random descriptive product name.",
  "commerce.price": "Generates a price between min and max (inclusive).",
  "commerce.productAdjective": "Returns an adjective describing a product.",
  "commerce.productMaterial": "Returns a material of a product.",
  "commerce.product": "Returns a short product name.",
  "commerce.productDescription": "Returns a product description.",
  "commerce.isbn": "Returns a random [ISBN](https://en.wikipedia.org/wiki/ISBN) identifier.",
  "commerce.upc": "Returns a valid [UPC‑A](https://en.wikipedia.org/wiki/Universal_Product_Code) (12 digits).",
  "company.name": "Generates a random company name.",
  "company.catchPhrase": "Generates a random catch phrase that can be displayed to an end user.",
  "company.buzzPhrase": "Generates a random buzz phrase that can be used to demonstrate data being viewed by a manager.",
  "company.catchPhraseAdjective": "Returns a random catch phrase adjective that can be displayed to an end user.",
  "company.catchPhraseDescriptor": "Returns a random catch phrase descriptor that can be displayed to an end user.",
  "company.catchPhraseNoun": "Returns a random catch phrase noun that can be displayed to an end user.",
  "company.buzzAdjective": "Returns a random buzz adjective that can be used to demonstrate data being viewed by a manager.",
  "company.buzzVerb": "Returns a random buzz verb that can be used to demonstrate data being viewed by a manager.",
  "company.buzzNoun": "Returns a random buzz noun that can be used to demonstrate data being viewed by a manager.",
  "database.column": "Returns a random database column name.",
  "database.type": "Returns a random database column type.",
  "database.collation": "Returns a random database collation.",
  "database.engine": "Returns a random database engine.",
  "database.mongodbObjectId": "Returns a MongoDB [ObjectId](https://docs.mongodb.com/manual/reference/method/ObjectId/) string.",
  "date.anytime": "Generates a random date that can be either in the past or in the future.",
  "date.past": "Generates a random date in the past.",
  "date.future": "Generates a random date in the future.",
  "date.between": "Generates a random date between the given boundaries.",
  "date.betweens": "Generates random dates between the given boundaries. The dates will be returned in an array sorted in chronological order.",
  "date.recent": "Generates a random date in the recent past.",
  "date.soon": "Generates a random date in the near future.",
  "date.birthdate": "Returns a random birthdate. By default, the birthdate is generated for an adult between 18 and 80 years old.",
  "date.month": "Returns a random name of a month.",
  "date.weekday": "Returns a random day of the week.",
  "date.timeZone": "Returns a random IANA time zone name.",
  "finance.accountNumber": "Generates a random account number.",
  "finance.accountName": "Generates a random account name.",
  "finance.routingNumber": "Generates a random [ABA routing number](https://en.wikipedia.org/wiki/ABA_routing_transit_number).",
  "finance.amount": "Generates a random amount between the given bounds (inclusive).",
  "finance.transactionType": "Returns a random transaction type.",
  "finance.currency": "Returns a random currency object, containing `code`, `name`, `symbol`, and `numericCode` properties.",
  "finance.currencyCode": "Returns a random currency code.",
  "finance.currencyName": "Returns a random currency name.",
  "finance.currencySymbol": "Returns a random currency symbol.",
  "finance.currencyNumericCode": "Returns a random currency numeric code.",
  "finance.bitcoinAddress": "Generates a random Bitcoin address.",
  "finance.litecoinAddress": "Generates a random Litecoin address.",
  "finance.creditCardNumber": "Generates a random credit card number.",
  "finance.creditCardCVV": "Generates a random credit card CVV.",
  "finance.creditCardIssuer": "Returns a random credit card issuer.",
  "finance.pin": "Generates a random PIN number.",
  "finance.ethereumAddress": "Creates a random, non-checksum Ethereum address.",
  "finance.iban": "Generates a random IBAN.",
  "finance.bic": "Generates a random SWIFT/BIC code based on the [ISO-9362](https://en.wikipedia.org/wiki/ISO_9362) format.",
  "finance.transactionDescription": "Generates a random transaction description.",
  "food.adjective": "Generates a random dish adjective.",
  "food.description": "Generates a random dish description.",
  "food.dish": "Generates a random dish name.",
  "food.ethnicCategory": "Generates a random food's ethnic category.",
  "food.fruit": "Generates a random fruit name.",
  "food.ingredient": "Generates a random ingredient name.",
  "food.meat": "Generates a random meat.",
  "food.spice": "Generates a random spice name.",
  "food.vegetable": "Generates a random vegetable name.",
  "git.branch": "Generates a random branch name.",
  "git.commitEntry": "Generates a random commit entry as printed by `git log`.",
  "git.commitMessage": "Generates a random commit message.",
  "git.commitDate": "Generates a date string for a git commit using the same format as `git log`.",
  "git.commitSha": "Generates a random commit sha.",
  "hacker.abbreviation": "Returns a random hacker/IT abbreviation.",
  "hacker.adjective": "Returns a random hacker/IT adjective.",
  "hacker.noun": "Returns a random hacker/IT noun.",
  "hacker.verb": "Returns a random hacker/IT verb.",
  "hacker.ingverb": "Returns a random hacker/IT verb for continuous actions (en: ing suffix; e.g. hacking).",
  "hacker.phrase": "Generates a random hacker/IT phrase.",
  "helpers.slugify": "Slugifies the given string.",
  "helpers.replaceSymbols": "Parses the given string symbol by symbol and replaces the placeholder appropriately.",
  "helpers.replaceCreditCardSymbols": "Replaces the symbols and patterns in a credit card schema including Luhn checksum.",
  "helpers.fromRegExp": "Generates a string matching the given regex like expressions.",
  "helpers.mustache": "Takes an array and randomizes it in place then returns it.",
  "helpers.rangeToNumber": "Returns the result of the callback if the probability check was successful, otherwise `undefined`.",
  "helpers.fake": "Generator for combining faker methods based on a static string input.",
  "person.firstName": "Returns a random first name.",
  "person.lastName": "Returns a random last name.",
  "person.middleName": "Returns a random middle name.",
  "person.fullName": "Generates a random full name.",
  "person.gender": "Returns a random gender.",
  "person.sex": "Returns a random sex.",
  "person.sexType": "Returns a random sex type. The `SexType` is intended to be used in parameters and conditions.",
  "person.bio": "Returns a random short biography",
  "person.prefix": "Returns a random person prefix.",
  "person.suffix": "Returns a random person suffix.",
  "person.jobTitle": "Generates a random job title.",
  "person.jobDescriptor": "Generates a random job descriptor.",
  "person.jobArea": "Generates a random job area.",
  "person.jobType": "Generates a random job type.",
  "person.zodiacSign": "Returns a random zodiac sign.",
  "image.avatar": "Generates a random avatar image url.",
  "image.avatarGitHub": "Generates a random avatar from GitHub.",
  "image.personPortrait": "Generates a random square portrait (avatar) of a person.",
  "image.url": "Generates a random image url.",
  "image.urlLoremFlickr": "Generates a random image url provided via https://loremflickr.com.",
  "image.urlPicsumPhotos": "Generates a random image url provided via https://picsum.photos.",
  "image.dataUri": "Generates a random data uri containing an URL-encoded SVG image or a Base64-encoded SVG image.",
  "internet.email": "Generates an email address using the given person's name as base.",
  "internet.exampleEmail": "Generates an email address using an example mail provider using the given person's name as base.",
  "internet.username": "Generates a username using the given person's name as base.",
  "internet.displayName": "Generates a display name using the given person's name as base.",
  "internet.protocol": "Returns a random web protocol. Either `http` or `https`.",
  "internet.httpMethod": "Returns a random http method.",
  "internet.httpStatusCode": "Generates a random HTTP status code.",
  "internet.url": "Generates a random http(s) url.",
  "internet.domainName": "Generates a random domain name.",
  "internet.domainSuffix": "Returns a random domain suffix.",
  "internet.domainWord": "Generates a random domain word.",
  "internet.ip": "Generates a random IPv4 or IPv6 address.",
  "internet.ipv4": "Generates a random IPv4 address.",
  "internet.ipv6": "Generates a random IPv6 address.",
  "internet.port": "Generates a random port number.",
  "internet.userAgent": "Generates a random user agent string.",
  "internet.mac": "Generates a random mac address.",
  "internet.password": "Generates a random password-like string. Do not use this method for generating actual passwords for users.",
  "internet.emoji": "Generates a random emoji.",
  "internet.jwtAlgorithm": "Generates a random JWT (JSON Web Token) Algorithm.",
  "internet.jwt": "Generates a random JWT (JSON Web Token).",
  "location.latitude": "Generates a random latitude.",
  "location.longitude": "Generates a random longitude.",
  "location.nearbyGPSCoordinate": "Generates a random GPS coordinate within the specified radius from the given coordinate.",
  "location.zipCode": "Generates random zip code from specified format. If format is not specified,",
  "location.city": "Generates a random localized city name.",
  "location.buildingNumber": "Generates a random building number.",
  "location.street": "Generates a random localized street name.",
  "location.streetAddress": "Generates a random localized street address.",
  "location.postalAddress": "Generates a random localized full postal address, which may include a street address, secondary address, city, state, and zip code. To ensure you get locale-specific address formats, use a localized Faker instance.",
  "location.secondaryAddress": "Generates a random localized secondary address. This refers to a specific location at a given address",
  "location.county": "Returns a random localized county, or other equivalent second-level administrative entity for the locale's country such as a district or department.",
  "location.country": "Returns a random country name.",
  "location.continent": "Returns a random continent name.",
  "location.countryCode": "Returns a random [ISO_3166-1](https://en.wikipedia.org/wiki/ISO_3166-1) country code.",
  "location.state": "Returns a random localized state, or other equivalent first-level administrative entity for the locale's country such as a province or region.",
  "location.direction": "Returns a random direction (cardinal and ordinal; northwest, east, etc).",
  "location.cardinalDirection": "Returns a random cardinal direction (north, east, south, west).",
  "location.ordinalDirection": "Returns a random ordinal direction (northwest, southeast, etc).",
  "location.timeZone": "Returns a random IANA time zone relevant to this locale.",
  "location.language": "Returns a random spoken language.",
  "lorem.word": "Generates a word of a specified length.",
  "lorem.words": "Generates a space separated list of words.",
  "lorem.sentence": "Generates a space separated list of words beginning with a capital letter and ending with a period.",
  "lorem.slug": "Generates a slugified text consisting of the given number of hyphen separated words.",
  "lorem.sentences": "Generates the given number of sentences.",
  "lorem.paragraph": "Generates a paragraph with the given number of sentences.",
  "lorem.paragraphs": "Generates the given number of paragraphs.",
  "lorem.text": "Generates a random text based on a random lorem method.",
  "lorem.lines": "Generates the given number lines of lorem separated by `'\\n'`.",
  "music.album": "Returns a random album name.",
  "music.artist": "Returns a random artist name.",
  "music.genre": "Returns a random music genre.",
  "music.songName": "Returns a random song name.",
  "phone.number": "Generates a random phone number.",
  "phone.imei": "Generates IMEI number.",
  "science.chemicalElement": "Returns a random periodic table element.",
  "science.unit": "Returns a random scientific unit.",
  "system.fileName": "Returns a random file name with extension.",
  "system.commonFileName": "Returns a random file name with a given extension or a commonly used extension.",
  "system.mimeType": "Returns a mime-type.",
  "system.commonFileType": "Returns a commonly used file type.",
  "system.commonFileExt": "Returns a commonly used file extension.",
  "system.fileType": "Returns a file type.",
  "system.fileExt": "Returns a file extension.",
  "system.directoryPath": "Returns a directory path.",
  "system.filePath": "Returns a file path.",
  "system.semver": "Returns a [semantic version](https://semver.org).",
  "system.networkInterface": "Returns a random [network interface](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/networking_guide/sec-understanding_the_predictable_network_interface_device_names).",
  "system.cron": "Returns a random cron expression.",
  "vehicle.vehicle": "Returns a random vehicle.",
  "vehicle.manufacturer": "Returns a manufacturer name.",
  "vehicle.model": "Returns a vehicle model.",
  "vehicle.type": "Returns a vehicle type.",
  "vehicle.fuel": "Returns a fuel type.",
  "vehicle.vin": "Returns a vehicle identification number (VIN).",
  "vehicle.color": "Returns a vehicle color.",
  "vehicle.vrm": "Returns a vehicle registration number (Vehicle Registration Mark - VRM)",
  "vehicle.bicycle": "Returns a type of bicycle.",
  "word.adjective": "Returns a random adjective.",
  "word.adverb": "Returns a random adverb.",
  "word.conjunction": "Returns a random conjunction.",
  "word.interjection": "Returns a random interjection.",
  "word.noun": "Returns a random noun.",
  "word.preposition": "Returns a random preposition.",
  "word.verb": "Returns a random verb.",
  "word.sample": "Returns a random word, that can be an adjective, adverb, conjunction, interjection, noun, preposition, or verb.",
  "word.words": "Returns a random string containing some words separated by spaces.",
  "datatype.boolean": "Returns the boolean value true or false.",
  "number.int": "Returns a single random integer between zero and the given max value or the given range.",
  "number.float": "Returns a single random floating-point number, by default between `0.0` and `1.0`. To change the range, pass a `min` and `max` value. To limit the number of decimal places, pass a `multipleOf` or `fractionDigits` parameter.",
  "number.binary": "Returns a [binary](https://en.wikipedia.org/wiki/Binary_number) number.",
  "number.octal": "Returns an [octal](https://en.wikipedia.org/wiki/Octal) number.",
  "number.hex": "Returns a lowercase [hexadecimal](https://en.wikipedia.org/wiki/Hexadecimal) number.",
  "number.bigInt": "Returns a [BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#bigint_type) number.",
  "number.romanNumeral": "Returns a roman numeral in String format.",
  "string.fromCharacters": "Generates a string from the given characters.",
  "string.alpha": "Generating a string consisting of letters in the English alphabet.",
  "string.alphanumeric": "Generating a string consisting of alpha characters and digits.",
  "string.binary": "Returns a [binary](https://en.wikipedia.org/wiki/Binary_number) string.",
  "string.octal": "Returns an [octal](https://en.wikipedia.org/wiki/Octal) string.",
  "string.hexadecimal": "Returns a [hexadecimal](https://en.wikipedia.org/wiki/Hexadecimal) string.",
  "string.numeric": "Generates a given length string of digits.",
  "string.sample": "Returns a string containing UTF-16 chars between 33 and 125 (`!` to `}`).",
  "string.uuid": "Returns a UUID ([Universally Unique Identifier](https://en.wikipedia.org/wiki/Universally_unique_identifier)).",
  "string.ulid": "Returns a ULID ([Universally Unique Lexicographically Sortable Identifier](https://github.com/ulid/spec)).",
  "string.nanoid": "Generates a [Nano ID](https://github.com/ai/nanoid).",
  "string.symbol": "Returns a string containing only special characters from the following list:",
  "airline.airport": "Generates a random airport.",
  "airline.airline": "Generates a random airline.",
  "airline.airplane": "Generates a random airplane.",
  "airline.recordLocator": "Generates a random [record locator](https://en.wikipedia.org/wiki/Record_locator). Record locators",
  "airline.seat": "Generates a random seat.",
  "airline.aircraftType": "Returns a random aircraft type.",
  "airline.flightNumber": "Returns a random flight number. Flight numbers are always 1 to 4 digits long. Sometimes they are"
};
