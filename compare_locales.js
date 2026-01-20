const fs = require('fs');
const path = require('path');

const localesDir = '/Users/lucasmoretto/Documents/projects/fila/frontend/src/locales';
const baseLang = 'en'; // Usage English as the structural base

function getKeys(obj, prefix = '') {
    return Object.keys(obj).reduce((res, el) => {
        if (Array.isArray(obj[el])) {
            return res;
        } else if (typeof obj[el] === 'object' && obj[el] !== null) {
            return [...res, ...getKeys(obj[el], prefix + el + '.')];
        }
        return [...res, prefix + el];
    }, []);
}

function compareFiles() {
    const langs = fs.readdirSync(localesDir).filter(f => fs.lstatSync(path.join(localesDir, f)).isDirectory());
    const baseFiles = fs.readdirSync(path.join(localesDir, baseLang)).filter(f => f.endsWith('.json'));

    const report = {};

    langs.forEach(lang => {
        if (lang === baseLang) return; // Skip base lang

        baseFiles.forEach(file => {
            const basePath = path.join(localesDir, baseLang, file);
            const targetPath = path.join(localesDir, lang, file);

            const baseKeys = getKeys(JSON.parse(fs.readFileSync(basePath, 'utf8')));
            let targetKeys = [];

            if (fs.existsSync(targetPath)) {
                targetKeys = getKeys(JSON.parse(fs.readFileSync(targetPath, 'utf8')));
            } else {
                if (!report[lang]) report[lang] = {};
                report[lang][file] = { status: 'MISSING_FILE' };
                return;
            }

            const missingInTarget = baseKeys.filter(k => !targetKeys.includes(k));

            if (missingInTarget.length > 0) {
                if (!report[lang]) report[lang] = {};
                if (!report[lang][file]) report[lang][file] = {};
                report[lang][file].missingKeys = missingInTarget;
            }
        });
    });

    console.log(JSON.stringify(report, null, 2));
}

compareFiles();
