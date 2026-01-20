const fs = require('fs');
const path = require('path');

const localesDir = '/Users/lucasmoretto/Documents/projects/fila/frontend/src/locales';
const baseLang = 'en';

function deepMerge(target, source) {
    const output = Object.assign({}, target);
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                if (!(key in target)) {
                    Object.assign(output, { [key]: source[key] });
                } else {
                    output[key] = deepMerge(target[key], source[key]);
                }
            } else {
                if (!(key in target)) {
                    Object.assign(output, { [key]: source[key] });
                }
            }
        });
    }
    return output;
}

function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

function syncLocales() {
    const langs = fs.readdirSync(localesDir).filter(f => fs.lstatSync(path.join(localesDir, f)).isDirectory());
    const baseFiles = fs.readdirSync(path.join(localesDir, baseLang)).filter(f => f.endsWith('.json'));

    langs.forEach(lang => {
        if (lang === baseLang) return; // Skip base lang

        console.log(`Syncing ${lang}...`);

        baseFiles.forEach(file => {
            const basePath = path.join(localesDir, baseLang, file);
            const targetPath = path.join(localesDir, lang, file);

            const baseContent = JSON.parse(fs.readFileSync(basePath, 'utf8'));

            if (!fs.existsSync(targetPath)) {
                console.log(`  Creating missing file: ${file}`);
                fs.writeFileSync(targetPath, JSON.stringify(baseContent, null, 4));
            } else {
                const targetContent = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
                // Merge base into target (target keys overwrite base, so we keep existing translations)
                // Wait, we want to KEEP existing target translations and ADD missing base keys.
                // deepMerge(target, source) -> if key missing in target, take from source.

                // Let's implement a merge that strictly adds missing keys
                const mergedContent = mergeMissing(targetContent, baseContent);

                fs.writeFileSync(targetPath, JSON.stringify(mergedContent, null, 4));
            }
        });
    });
    console.log('Synchronization complete.');
}

function mergeMissing(target, source) {
    const output = Object.assign({}, target);

    Object.keys(source).forEach(key => {
        if (isObject(source[key])) {
            if (!(key in target)) {
                // Entire object missing in target
                output[key] = source[key];
            } else {
                // Object exists, recurse
                output[key] = mergeMissing(target[key], source[key]);
            }
        } else {
            // Primitive value
            if (!(key in target)) {
                output[key] = source[key];
            }
        }
    });

    return output;
}

syncLocales();
