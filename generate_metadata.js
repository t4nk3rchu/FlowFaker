import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// v10+ structure: dist/*.d.ts (often a single huge chunk)
const BASE_DIR = path.resolve(__dirname, 'node_modules', '@faker-js', 'faker', 'dist');
const OUTPUT_FILE = path.join(__dirname, 'metadata.json');

console.log(`Searching for d.ts files in: ${BASE_DIR}`);

const metadata = {};

if (!fs.existsSync(BASE_DIR)) {
    console.error(`Base dir not found: ${BASE_DIR}`);
    process.exit(1);
}

// Find all .d.ts files in dist root
const dtsFiles = fs.readdirSync(BASE_DIR).filter(f => f.endsWith('.d.ts'));

dtsFiles.forEach(fileName => {
    const dtsPath = path.join(BASE_DIR, fileName);
    const content = fs.readFileSync(dtsPath, 'utf8');
    const lines = content.split('\n');

    let currentModule = null;
    let currentComment = [];
    let isInsideModuleClass = false;

    // We look for 'export declare class [Name]Module'
    // Then key is '[name]' (lowercase)

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Regex to match 'declare class [Name]Module' (with or without export)
        const classMatch = line.match(/(?:export )?declare class (\w+)Module/);
        if (classMatch) {
            const moduleName = classMatch[1].toLowerCase(); // InternetModule -> internet
            currentModule = moduleName;
            metadata[currentModule] = metadata[currentModule] || {};
            isInsideModuleClass = true;
            continue;
        }

        if (line.includes('declare class') && !line.includes('Module')) {
            isInsideModuleClass = false; // Exited a module class
            currentModule = null;
            continue;
        }

        // Very basic block check - if we see '}' at start of line, might be end of class
        // But d.ts formatting is usually reliable. 
        if (line === '}') {
            // Potentially end of class, but could be end of method.
            // We'll rely on method matching logic to filter garbage.
        }

        if (!isInsideModuleClass || !currentModule) continue;

        if (line.startsWith('/**')) {
            currentComment = [];
        }
        if (line.startsWith('*')) {
            const cleanLine = line.replace(/^\*\s?/, '');
            if (cleanLine !== '/') currentComment.push(cleanLine);
        }

        // Match method definition: method(options?: ...): Type;
        const methodMatch = line.match(/^(\w+)\(/);
        if (methodMatch) {
            const methodName = methodMatch[1];

            // Extract description
            let description = '';
            const descriptionLines = currentComment.filter(l => !l.startsWith('@') && l.trim() !== '');
            if (descriptionLines.length > 0) {
                description = descriptionLines[0];
            }

            // Extract params
            const params = [];
            currentComment.forEach(l => {
                const paramMatch = l.match(/@param options\.(\w+)/);
                if (paramMatch) {
                    params.push(paramMatch[1]);
                }
            });

            if (params.length === 0) {
                currentComment.forEach(l => {
                    const argMatch = l.match(/@param (\w+)/);
                    if (argMatch && argMatch[1] !== 'options' && !argMatch[1].startsWith('legacy')) {
                        params.push(argMatch[1]);
                    }
                });
            }

            // Upsert
            const existing = metadata[currentModule][methodName];
            if (!existing || (existing.params && params.length > existing.params.length)) {
                metadata[currentModule][methodName] = {
                    description,
                    params: [...new Set(params)]
                };
            }

            currentComment = [];
        }
    }
});

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(metadata, null, 2));
console.log(`Generated metadata for ${Object.keys(metadata).length} modules.`);
