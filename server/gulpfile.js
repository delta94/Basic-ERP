const gulp = require('gulp');
const run = require('gulp-run');
const gulpClean = require('gulp-clean');
const replace = require('gulp-replace');

function clean() {
  console.log('Start cleaning old builds.');
  return gulp.src('build', { read: false, allowEmpty: true }).pipe(gulpClean());
}

function runWebpack() {
  console.log('Start building server with webpack.');
  return run(
    'npx webpack --mode production --config ./webpack.config.js'
  ).exec();
}

function version() {
  const index = process.argv.indexOf('--releaseVersion');
  if (index > -1) {
    const releaseVersion = process.argv[index + 1];
    console.log(`Release version is :${releaseVersion}`);
    return gulp
      .src('package.json')
      .pipe(
        replace(
          /(\"version\"\s*:\s*\"\d+\.\d+\.\d+)(\"|\-SNAPSHOT\")/,
          `${'"version' + '": "'}${releaseVersion}"`
        )
      )
      .pipe(gulp.dest('./', { overwrite: true }));
  }
  console.log('Version is not send as build arguments');
  throw new Error('Version is not send as build arguments');
}

function setProdEnvSettings() {
  /* Replace for production build Package.json */
  gulp
    .src('./build/package.json')
    .pipe(replace('nodemon ./bin/index', `node ./index`))
    .pipe(gulp.dest('build/'));

  /* Replace for production build Config.env */
  return gulp
    .src('./build/config.env')
    .pipe(replace(/NODE_ENV=.+/, `NODE_ENV=production`))
    .pipe(gulp.dest('build/'));
}

function copyPackageJson() {
  console.log('Copying package.json file to build directory.');
  return gulp.src('package.json').pipe(gulp.dest('build/'));
}

function copyEnvConfig() {
  console.log('Copying config.env file to build directory.');
  return gulp.src('config.env').pipe(gulp.dest('build/'));
}

function installingDependencies() {
  process.env.NODE_ENV = 'production';
  process.chdir('build/');
  console.log('Running npm install to fetch bundle dependencies.');
  return run('npm install --only=prod').exec();
}

function packageFiles() {
  console.log('Packaging deployment file.');
  return run('npm pack').exec();
}

const build = gulp.series(
  runWebpack,
  version,
  copyPackageJson,
  copyEnvConfig,
  setProdEnvSettings,

  installingDependencies,
  // packageFiles
);

exports.build = build;
exports.clean = clean;
exports.default = gulp.series(clean, build);
