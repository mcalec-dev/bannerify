const fs = require('fs').promises;
const path = require('path');
const CleanCSS = require('clean-css');
const terser = require('terser');

async function minifyCSS(inputPath, outputPath) {
    try {
        const css = await fs.readFile(inputPath, 'utf8');
        const minified = new CleanCSS().minify(css);
        await fs.writeFile(outputPath, minified.styles);
        console.log(`CSS minified: ${outputPath}`);
    } catch (err) {
        console.error(`Error minifying CSS: ${err}`);
    }
}

async function minifyJS(inputPath, outputPath) {
    try {
        const js = await fs.readFile(inputPath, 'utf8');
        const minified = await terser.minify(js);
        await fs.writeFile(outputPath, minified.code);
        console.log(`JS minified: ${outputPath}`);
    } catch (err) {
        console.error(`Error minifying JS: ${err}`);
    }
}

async function minifyJSON(inputPath, outputPath) {
    try {
        const json = await fs.readFile(inputPath, 'utf8');
        const minified = JSON.stringify(JSON.parse(json));
        await fs.writeFile(outputPath, minified);
        console.log(`JSON minified: ${outputPath}`);
    } catch (err) {
        console.error(`Error minifying JSON: ${err}`);
    }
}

async function main() {
    // Minify CSS
    await minifyCSS(
        path.join(__dirname, 'public', 'css', 'style.css'),
        path.join(__dirname, 'public', 'css', 'style.min.css')
    );

    // Minify JS
    await minifyJS(
        path.join(__dirname, 'public', 'js', 'script.js'),
        path.join(__dirname, 'public', 'js', 'script.min.js')
    );

    // Minify JSON
    await minifyJSON(
        path.join(__dirname, 'public', 'json', 'list.json'),
        path.join(__dirname, 'public', 'json', 'list.min.json')
    );
}

main();