import { allFakers } from '@faker-js/faker';
import clipboardy from 'clipboardy';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
// ESM compatibility: manually define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Load metadata
let metadata = {};
try {
    const metaPath = path.join(__dirname, 'metadata.json');
    if (fs.existsSync(metaPath)) {
        metadata = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    }
}
catch (e) {
    // ignore
}
const input = JSON.parse(process.argv[2]);
const { method, parameters } = input;
// Suppress console.warn to avoid breaking Flow Launcher JSON parsing with FakerJS deprecation warnings
console.warn = () => { };
/**
 * Get all method names from a FakerJS module object, including prototype methods (for v10 classes).
 */
function getModuleKeys(obj) {
    const keys = new Set();
    let current = obj;
    while (current && current !== Object.prototype) {
        Object.getOwnPropertyNames(current).forEach(k => {
            if (typeof obj[k] === 'function' && k !== 'constructor' && !k.startsWith('_')) {
                keys.add(k);
            }
        });
        current = Object.getPrototypeOf(current);
    }
    return Array.from(keys);
}
/**
 * Tokenize query string while respecting quotes.
 */
function tokenize(input) {
    const result = [];
    let current = '';
    let inQuote = null;
    for (let i = 0; i < input.length; i++) {
        const char = input[i];
        if ((char === '"' || char === "'") && (inQuote === null || inQuote === char)) {
            inQuote = inQuote === null ? char : null;
            current += char;
        }
        else if (char === ' ' && inQuote === null) {
            if (current.length > 0) {
                result.push(current);
                current = '';
            }
        }
        else {
            current += char;
        }
    }
    if (current.length > 0) {
        result.push(current);
    }
    return result;
}
const EXCLUDED_CATEGORIES = ['definitions', 'locales', 'rawDefinitions', 'helpers'];
async function handleQuery(queryString) {
    let lang = 'en';
    let count = 1;
    let category = '';
    let module = '';
    const args = {};
    const isTrailingSpace = queryString.endsWith(' ');
    const rawParts = tokenize(queryString.trim());
    // Detect parameters and non-parameter parts
    const queryTokens = [];
    for (let part of rawParts) {
        // Remove surrounding quotes if present (e.g. "hello world" -> hello world)
        if (part.includes(':')) {
            let [key, val] = part.split(/:(.+)/); // Split only on first colon
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                val = val.substring(1, val.length - 1);
            }
            if (key === 'lang') {
                lang = val;
            }
            else if (key === 'repeat') {
                count = parseInt(val, 10) || 1;
            }
            else {
                if (!isNaN(Number(val)))
                    args[key] = Number(val);
                else if (val === 'true')
                    args[key] = true;
                else if (val === 'false')
                    args[key] = false;
                else if (val.startsWith('{') || val.startsWith('[')) {
                    try {
                        args[key] = JSON.parse(val);
                    }
                    catch (e) {
                        args[key] = val;
                    }
                }
                else {
                    args[key] = val;
                }
            }
        }
        else {
            queryTokens.push(part);
        }
    }
    const faker = allFakers[lang] || allFakers['en'];
    const results = [];
    // Determine view state:
    // 1. No tokens -> List all categories
    // 2. 1 token, no space -> Filter categories
    // 3. 1 token, space -> List category modules
    // 4. 2 tokens, no space -> Filter modules
    // 5. 2 tokens, space -> Generate data
    // 6. >2 tokens -> Generate data
    if (queryTokens.length === 0) {
        // List all categories
        const categories = Object.keys(faker).filter(k => typeof faker[k] === 'object' &&
            !k.startsWith('_') &&
            !EXCLUDED_CATEGORIES.includes(k));
        categories.sort();
        categories.forEach(cat => {
            results.push({
                Title: cat,
                Subtitle: `Browse ${cat} modules`,
                JsonRPCAction: { method: 'change_query', parameters: [`fake ${cat} `] },
                ContextData: [],
                IcoPath: 'Images\\app.png'
            });
        });
    }
    else if (queryTokens.length === 1 && !isTrailingSpace) {
        // Filter categories OR show modules if exact match
        const filter = queryTokens[0].toLowerCase();
        const categories = Object.keys(faker).filter(k => typeof faker[k] === 'object' &&
            !k.startsWith('_') &&
            !EXCLUDED_CATEGORIES.includes(k) &&
            k.toLowerCase().startsWith(filter));
        categories.sort();
        const exactMatch = categories.find(c => c.toLowerCase() === filter);
        // If exact match found, we hide the category itself and only list all modules of that category
        if (exactMatch) {
            const catObj = faker[exactMatch];
            const modules = getModuleKeys(catObj);
            modules.sort();
            modules.forEach(mod => {
                let subtitle = `Generate ${exactMatch}.${mod}`;
                const meta = metadata[exactMatch]?.[mod];
                if (meta) {
                    if (meta.description)
                        subtitle = meta.description;
                    if (meta.params && meta.params.length > 0)
                        subtitle += `\nParams: ${meta.params.join(', ')}`;
                }
                results.push({
                    Title: mod,
                    Subtitle: subtitle,
                    JsonRPCAction: { method: 'change_query', parameters: [`fake ${exactMatch} ${mod} `] },
                    ContextData: [],
                    IcoPath: 'Images\\app.png'
                });
            });
        }
        else {
            // Just list matching categories
            categories.forEach(cat => {
                results.push({
                    Title: cat,
                    Subtitle: `Browse ${cat} modules`,
                    JsonRPCAction: { method: 'change_query', parameters: [`fake ${cat} `] },
                    ContextData: [],
                    IcoPath: 'Images\\app.png'
                });
            });
        }
    }
    else if ((queryTokens.length === 1 && isTrailingSpace) || (queryTokens.length >= 2)) {
        // List modules for category OR generate data
        category = queryTokens[0];
        const moduleFilter = queryTokens.length >= 2 ? queryTokens[1].toLowerCase() : '';
        const catObj = faker[category];
        if (catObj) {
            const moduleKeys = getModuleKeys(catObj);
            const exactModule = moduleKeys.find(k => k.toLowerCase() === moduleFilter);
            // If we have an exact module match, we generate data right away!
            if (exactModule) {
                module = exactModule;
                // Fall through to generation logic below (removing the try/catch wrapper here for cleaner flow)
            }
            else {
                // No exact match, list/filter modules
                const filteredModules = moduleKeys.filter(k => k.toLowerCase().startsWith(moduleFilter));
                filteredModules.sort();
                filteredModules.forEach(mod => {
                    let subtitle = `Generate ${category}.${mod}`;
                    const meta = metadata[category]?.[mod];
                    if (meta) {
                        if (meta.description)
                            subtitle = meta.description;
                        if (meta.params && meta.params.length > 0)
                            subtitle += `\nParams: ${meta.params.join(', ')}`;
                    }
                    results.push({
                        Title: mod,
                        Subtitle: subtitle,
                        JsonRPCAction: { method: 'change_query', parameters: [`fake ${category} ${mod} `] },
                        ContextData: [],
                        IcoPath: 'Images\\app.png'
                    });
                });
                return results;
            }
        }
        else {
            results.push({
                Title: 'Category not found',
                Subtitle: `Category '${category}' does not exist in FakerJS`,
                JsonRPCAction: { method: 'change_query', parameters: ['fake '] },
                ContextData: [],
                IcoPath: 'Images\\app.png'
            });
            return results;
        }
    }
    // Generate data (Execution reaches here if exact category/module found)
    if (category && module) {
        try {
            const func = faker[category]?.[module];
            if (typeof func === 'function') {
                const ROW_COUNT = 5;
                // Custom override for person.fullName
                const isPersonFullName = category === 'person' && module === 'fullName';
                const nameOrder = args['nameOrder'] || args['order'];
                const useCustomOrder = isPersonFullName && (nameOrder === 'last-first' || nameOrder === 'lf');
                // Positional overrides for helpers
                const positionalOverrides = {
                    'fromRegExp': ['pattern'],
                    'slugify': ['string'],
                    'replaceSymbols': ['string'],
                    'replaceCreditCardSymbols': ['string', 'symbol'],
                    'mustache': ['text', 'data'],
                    'rangeToNumber': ['numberOrRange'],
                    'fake': ['pattern'],
                    'arrayElement': ['array'],
                    'arrayElements': ['array', 'count'],
                };
                for (let r = 0; r < ROW_COUNT; r++) {
                    const generatedValues = [];
                    for (let i = 0; i < count; i++) {
                        let val;
                        if (useCustomOrder) {
                            val = `${faker.person.lastName(args)} ${faker.person.firstName(args)}`;
                        }
                        else if (category === 'helpers' && positionalOverrides[module]) {
                            const paramNames = positionalOverrides[module];
                            const callArgs = paramNames.map(name => args[name]);
                            val = func(...callArgs);
                        }
                        else {
                            val = func(args);
                        }
                        if (typeof val === 'object' && val !== null) {
                            generatedValues.push(JSON.stringify(val));
                        }
                        else {
                            generatedValues.push(String(val));
                        }
                    }
                    if (generatedValues.length === 1) {
                        results.push({
                            Title: generatedValues[0],
                            Subtitle: `Copy to clipboard (${category}.${module})`,
                            JsonRPCAction: { method: 'copy', parameters: [generatedValues[0]] },
                            ContextData: generatedValues,
                            IcoPath: 'Images\\app.png'
                        });
                    }
                    else {
                        results.push({
                            Title: `${generatedValues[0]}... (+${generatedValues.length - 1} more)`,
                            Subtitle: `Generated ${count} values. Enter to copy (newline separated).`,
                            JsonRPCAction: { method: 'copy', parameters: [generatedValues.join('\n')] },
                            ContextData: generatedValues,
                            IcoPath: 'Images\\app.png'
                        });
                    }
                }
            }
            else {
                results.push({
                    Title: 'Function not found',
                    Subtitle: `'${category}.${module}' is not a valid FakerJS function`,
                    JsonRPCAction: { method: 'change_query', parameters: [`fake ${category} `] },
                    ContextData: [],
                    IcoPath: 'Images\\app.png'
                });
            }
        }
        catch (e) {
            results.push({
                Title: 'Error generating data',
                Subtitle: e.message || String(e),
                JsonRPCAction: { method: 'copy', parameters: [e.message] },
                ContextData: [],
                IcoPath: 'Images\\app.png'
            });
        }
    }
    return results;
}
function handleContextMenu(contextData) {
    // contextData is passed as an array. The first element is our array of values if we passed it as [values].
    let data = [];
    if (Array.isArray(contextData) && contextData.length > 0 && Array.isArray(contextData[0])) {
        data = contextData[0];
    }
    else {
        data = contextData;
    }
    // Filter non-strings just in case
    data = data.map(String);
    const results = [
        {
            Title: 'Copy Space Separated',
            Subtitle: data.slice(0, 3).join(' ') + (data.length > 3 ? '...' : ''),
            JsonRPCAction: { method: 'copy', parameters: [data.join(' ')] },
            ContextData: data,
            IcoPath: 'Images\\app.png'
        },
        {
            Title: 'Copy Newline Separated',
            Subtitle: data.slice(0, 3).join('\\n') + (data.length > 3 ? '...' : ''),
            JsonRPCAction: { method: 'copy', parameters: [data.join('\n')] },
            ContextData: data,
            IcoPath: 'Images\\app.png'
        },
        {
            Title: 'Copy Comma Separated',
            Subtitle: data.slice(0, 3).join(', ') + (data.length > 3 ? '...' : ''),
            JsonRPCAction: { method: 'copy', parameters: [data.join(', ')] },
            ContextData: data,
            IcoPath: 'Images\\app.png'
        },
        {
            Title: 'Copy JSON Formatted',
            Subtitle: JSON.stringify(data).slice(0, 50) + '...',
            JsonRPCAction: { method: 'copy', parameters: [JSON.stringify(data)] },
            ContextData: data,
            IcoPath: 'Images\\app.png'
        }
    ];
    return results;
}
function handleCopy(text) {
    try {
        clipboardy.writeSync(text);
    }
    catch (e) {
        // Can't log to console, user won't see it easily.
    }
}
function safeLog(obj) {
    // Escape unicode characters to ensure correct display in Flow Launcher (JSON-RPC)
    // regardless of the terminal's text encoding.
    const json = JSON.stringify(obj).replace(/[\u007f-\uffff]/g, c => '\\u' + ('0000' + c.charCodeAt(0).toString(16)).slice(-4));
    console.log(json);
}
// Entry point
(async () => {
    if (method === 'query') {
        const results = await handleQuery(parameters[0] || '');
        safeLog({ result: results });
    }
    else if (method === 'context_menu') {
        const results = handleContextMenu(parameters);
        safeLog({ result: results });
    }
    else if (method === 'copy') {
        handleCopy(parameters[0]);
    }
})();
