import { allFakers } from '@faker-js/faker';
import clipboardy from 'clipboardy';
import * as fs from 'fs';
import * as path from 'path';
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
if (method === 'query') {
    handleQuery(parameters[0] || '');
}
else if (method === 'context_menu') {
    handleContextMenu(parameters);
}
else if (method === 'copy') {
    handleCopy(parameters[0]);
}
function handleQuery(queryString) {
    let lang = 'en';
    let count = 1;
    let category = '';
    let module = '';
    const args = {};
    const parts = queryString.trim().split(/\s+/);
    for (const part of parts) {
        if (!part)
            continue;
        if (part.includes(':')) {
            const [key, val] = part.split(':');
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
                else
                    args[key] = val;
            }
        }
        else {
            if (!category)
                category = part;
            else if (!module)
                module = part;
        }
    }
    const faker = allFakers[lang] || allFakers['en'];
    const results = [];
    if (!category) {
        // List categories
        const categories = Object.keys(faker).filter(k => typeof faker[k] === 'object' && k !== 'definitions' && k !== 'locales');
        categories.sort();
        categories.forEach(cat => {
            results.push({
                Title: cat,
                Subtitle: `Browse ${cat} modules`,
                JsonRPCAction: {
                    method: 'change_query',
                    parameters: [`fake ${cat} `], // Append space to help typing
                },
                ContextData: [],
                IcoPath: 'Images\\app.png'
            });
        });
    }
    else if (category && !module) {
        // List modules in category
        const catObj = faker[category];
        if (catObj) {
            const modules = Object.keys(catObj).filter(k => typeof catObj[k] === 'function');
            modules.sort();
            modules.forEach(mod => {
                let subtitle = `Generate ${category}.${mod}`;
                const meta = metadata[category]?.[mod];
                if (meta) {
                    if (meta.description) {
                        subtitle = meta.description;
                    }
                    if (meta.params && meta.params.length > 0) {
                        subtitle += ` | Params: ${meta.params.join(', ')}`;
                    }
                }
                results.push({
                    Title: mod,
                    Subtitle: subtitle,
                    JsonRPCAction: {
                        method: 'change_query',
                        parameters: [`fake ${category} ${mod} `],
                    },
                    ContextData: [],
                    IcoPath: 'Images\\app.png'
                });
            });
        }
        else {
            results.push({
                Title: 'Category not found',
                Subtitle: `Category '${category}' does not exist in FakerJS`,
                JsonRPCAction: { method: 'change_query', parameters: ['fake '] },
                ContextData: [],
                IcoPath: 'Images\\app.png'
            });
        }
    }
    else {
        // Generate data
        try {
            const func = faker[category]?.[module];
            if (typeof func === 'function') {
                const ROW_COUNT = 5; // User requested at least 5 results
                // Custom override for person.fullName
                const isPersonFullName = category === 'person' && module === 'fullName';
                const nameOrder = args['nameOrder'] || args['order']; // support both
                const useCustomOrder = isPersonFullName && (nameOrder === 'last-first' || nameOrder === 'lf');
                for (let r = 0; r < ROW_COUNT; r++) {
                    const generatedValues = [];
                    for (let i = 0; i < count; i++) {
                        let val;
                        if (useCustomOrder) {
                            // Manual concatenation: Last First
                            // pass args to children in case of gender etc.
                            val = `${faker.person.lastName(args)} ${faker.person.firstName(args)}`;
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
    safeLog({ result: results });
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
    safeLog({ result: results });
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
