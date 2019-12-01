#!/usr/bin/env node

const meta = require('./package.json');

// Dependencies
const debug = require('gulp-debug');
const gulp = require('gulp');
const jsonLint = require('gulp-json-lint');
const program = require('commander');
const tsLint = require('gulp-tslint');
const xmlValidator = require('gulp-xml-validator');
const { argv } = require('process');
const { join } = require('path');

// Gulp options
const options = {
    allowEmpty: true
};

const src = {
    json: [
        'package.json',
        'snippets/**/*.json',
        'tsconfig.json',
        'tslint.json',
        '!bower_components/**/*',
        '!node_modules/**/*'
    ],
    ts: [
        'src/**/*.ts',
        '!bower_components/**/*',
        '!node_modules/**/*'
    ],
    xml: [
        '**/*.svg',
        '**/*.tmLanguage',
        '**/*.tmTheme',
        '!bower_components/**/*',
        '!node_modules/**/*'
    ],
};

const jsonReporter = (lint, file) => {
    throw `${file.path}: ${lint.error}`;
};

program
    .version(meta.version)
    .description('Lints common file-types used in VSCode extensions')
    .arguments('[directory]')
    .usage('[directory]')
    .parse(argv);

const directories = (typeof program.args !== 'undefined' && program.args.length > 0)
    ? program.args
    : [ process.cwd() ];


directories.forEach( directory => {
    let json = src.json.map(item => join(directory, item));
    let ts = src.ts.map(item => join(directory, item));
    let xml = src.xml.map(item => join(directory, item));

    // Lint JSON
    gulp.src(json, options)
        .pipe(debug({title: 'Lint JSON:'}))
        .pipe(jsonLint({
            comments: true
        }))
        .pipe(jsonLint.report('verbose'))
        .pipe(jsonLint.report(jsonReporter));

    // Lint TypeScript
    gulp.src(ts, options)
        .pipe(debug({title: 'Lint TypeScript:'}))
        .pipe(tsLint({
            formatter: 'prose'
        }))
        .pipe(tsLint.report());

    // Validate XML
    gulp.src(xml, options)
        .pipe(debug({title: 'Lint XML:'}))
        .pipe(xmlValidator());
});
