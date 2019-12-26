#!/usr/bin/env node

const meta = require('./package.json');

// Dependencies
const debug = require('gulp-debug');
const gulp = require('gulp');
const jsonLint = require('@prantlf/gulp-jsonlint');
const process = require('process');
const program = require('commander');
const tsLint = require('gulp-tslint');
const xmlValidator = require('gulp-xml-validator');

program
    .version(meta.version)
    .description('Lints common file-types used in VSCode extensions')
    .arguments('[directory]')
    .usage('[directory]')
    .parse(process.argv);

// Gulp options
const options = {
    allowEmpty: true,
    cwd: program.args && program.args.length ? program.args[0] : process.cwd
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

// Lint JSON
gulp.src(src.json, options)
    .pipe(debug({title: 'Lint JSON:'}))
    .pipe(jsonLint({
        ignoreComments: true,
    }))
    .pipe(jsonLint.failOnError());

// Lint TypeScript
gulp.src(src.ts, options)
    .pipe(debug({title: 'Lint TypeScript:'}))
    .pipe(tsLint({
        formatter: 'prose'
    }))
    .pipe(tsLint.report());

// Validate XML
gulp.src(src.xml, options)
    .pipe(debug({title: 'Lint XML:'}))
    .pipe(xmlValidator());
