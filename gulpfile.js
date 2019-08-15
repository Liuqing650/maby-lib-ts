const fs = require('fs');
const rimraf = require('rimraf');
const path = require('path');
const merge2 = require('merge2');
const through2 = require('through2');
const argv = require('minimist')(process.argv.slice(2));
const webpack = require('webpack');
const ts = require('gulp-typescript');
const gulp = require('gulp');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const transformLess = require('./lib/transformLess');
const createWebpackConfig = require('./webpack.config.js');
const getBabel = require('./lib/getBabel.js');
const packageInfo = require('./lib/getPackage.js');
const tsConfig = require('./lib/getTSConfig')();

const tsDefaultReporter = ts.reporter.defaultReporter();
const cwd = process.cwd();

const { mabycli } = packageInfo;

const libDir = path.join(cwd, mabycli.dir || 'lib');
const distDir = path.join(cwd, 'dist');
const previewDir = path.join(cwd, 'preview');

const deleteLibDir = mabycli.deleteFile ? `${libDir}/**/*` : libDir;

function getFolders(dir) {
  return fs.readdirSync(dir)
    .filter(function(file) {
      return fs.statSync(path.join(dir, file)).isDirectory();
    });
}

function buildWebpack(isMini = false, done) {
  process.env.MINI = isMini;
  process.env.NODE_ENV = 'production';
  if (!isMini) {
    rimraf.sync(distDir);
  }
  const webpackConfig = createWebpackConfig(process.env);
  webpack(webpackConfig, (err, stats) => {
    if (err) {
      console.error(err.stack || err);
      if (err.details) {
        console.error(err.details);
      }
      return;
    }
    const info = stats.toJson();
    if (stats.hasErrors()) {
      console.error(info.errors);
    }
    if (stats.hasWarnings()) {
      console.warn(info.warnings);
    }

    const buildInfo = stats.toString({
      colors: true,
      children: true,
      chunks: false,
      modules: false,
      chunkModules: false,
      hash: false,
      version: false,
    });
    console.log(buildInfo);
    console.log('build 完成...');
    done(0);
  });
}

function preview() {
  rimraf.sync(previewDir);
  process.env.NODE_ENV = 'production';
  process.env.PREVIEW = true;
  process.env.ASSET_PATH = './';
  const webpackConfig = createWebpackConfig(process.env);
  webpack(webpackConfig, (err) => {
    if (err) {
      console.error(err.stack || err);
      if (err.details) {
        console.error(err.details);
      }
      return;
    }
  });
}

function analyzer() {
  process.env.ANALYZER = true;
  process.env.NODE_ENV = 'production';
  const webpackConfig = createWebpackConfig(process.env);
  webpack(webpackConfig, (err) => {
    if (err) {
      console.error(err.stack || err);
      if (err.details) {
        console.error(err.details);
      }
      return;
    }
  });
}

function babelify(js, modules) {
  const babelConfig = getBabel();
  let stream = js
    .pipe(sourcemaps.init())
    .pipe(babel(babelConfig))
    .pipe(through2.obj(function z(file, encoding, next) {
      this.push(file.clone());
      // 查找包含style样式文件夹，替换掉原来引入的less为css
      if (file.path.match(/\/style\/index\.(js|ts|jsx|tsx)/)) {
        const content = file.contents.toString(encoding);
        file.contents = Buffer.from(content
          .replace(/\/style\/?'/g, '/style/css\'')
          .replace(/\.less/g, '.css'));
        file.path = file.path.replace(/index\.(js|ts|jsx|tsx)/, 'index.js');
        this.push(file);
        next();
      } else {
        next();
      }
    }))
    .pipe(sourcemaps.write('.'));
  return stream.pipe(gulp.dest(libDir));
}

function compile(modules) {
  console.log('compile ing...');
  rimraf.sync(deleteLibDir);
  const less = gulp.src(['src/**/*.less'])
    .pipe(through2.obj(function (file, encoding, next) {
      this.push(file.clone());
      if (file.path.match(/\/style\/index\.less$/)) {
        transformLess(file.path).then((css) => {
          file.contents = Buffer.from(css);
          file.path = file.path.replace(/\.less$/, '.css');
          this.push(file);
          next();
        }).catch((e) => {
          console.error(e);
        });
      } else {
        next();
      }
    }))
    .pipe(gulp.dest(libDir));
  const assets = gulp.src(['src/**/*.@(png|svg)']).pipe(gulp.dest(libDir));
  let error = 0;
  const source = [
    'src/**/*.js',
    'src/**/*.jsx',
    'src/**/*.ts',
    'src/**/*.tsx',
  ];
  // const tsResult = gulp.src(source);
  if (tsConfig.allowJs) {
    source.unshift('src/**/*.jsx');
  }
  const tsResult = gulp.src(source).pipe(
    ts(tsConfig, {
      error(e) {
        tsDefaultReporter.error(e);
        error = 1;
      },
      finish: tsDefaultReporter.finish,
    })
  );

  function check() {
    if (error && !argv['ignore-error']) {
      process.exit(1);
    }
  }
  tsResult.on('finish', check);
  tsResult.on('end', check);
  const tsFilesStream = babelify(tsResult.js, modules);
  const tsd = tsResult.dts.pipe(gulp.dest(libDir));
  return merge2([less, tsFilesStream, tsd, assets]);
}

gulp.task('analyzer', () => {
  analyzer();
});

gulp.task('preview', () => {
  preview();
});

gulp.task('build:babel', (done) => {
  buildWebpack(false, done);
});

gulp.task('build:mini', (done) => {
  buildWebpack(true, done);
});

gulp.task('compile', (done) => {
  compile().on('finish', done);
});

gulp.task('build', gulp.series('build:babel', 'build:mini', 'compile'));

gulp.task('default', gulp.series('build:babel', 'build:mini', 'compile'));
