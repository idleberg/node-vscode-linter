#!/usr/bin/env node

// Dependencies
const gulp = require('gulp');
const debug = require('gulp-debug');
// const esLint = require('gulp-eslint');
const jsonLint = require('gulp-json-lint');
const tsLint = require('gulp-tslint');
const xmlValidator = require('gulp-xml-validator');

// Gulp options
const options = {
  allowEmpty: true
};

const src = {
  json: [
    'package.json',
    'snippets/*.json',
    'tsconfig.json',
    'tslint.json',
    '!bower_components/**/*',
    '!node_modules/**/*'
  ],
  // javascript: [
  //   '**/*.js',
  //   '!bower_components/**/*',
  //   '!node_modules/**/*'
  // ],
  typescript: [
    '**/*.ts',
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

const jsonReporter = function (lint, file) {
    throw `${file.path}: ${lint.error}`;
};

// Lint JSON
gulp.src(src.json, options)
  .pipe(debug({title: 'Lint JSON:'}))
  .pipe(jsonLint({
    comments: true
  }))
  .pipe(jsonLint.report('verbose'))
  .pipe(jsonLint.report(jsonReporter));

// gulp.src(src.javascript, options)
//   .pipe(debug({title: 'Lint JavaScript:'}))
//   .pipe(esLint());

gulp.src(src.typescript, options)
  .pipe(debug({title: 'Lint TypeScript:'}))
  .pipe(tsLint({
      formatter: "prose"
  }))
  .pipe(tsLint.report());

// Validate XML
gulp.src(src.xml, options)
  .pipe(debug({title: 'Lint XML:'}))
  .pipe(xmlValidator());
