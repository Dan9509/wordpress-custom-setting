const
  gulp = require("gulp"),
  sourcemaps = require("gulp-sourcemaps"),
  Babel = require("gulp-babel"),
  concat = require("gulp-concat"),
  TypeScript = require("gulp-typescript"),
  webpack = require("webpack-stream"),
  path = require("path"),
  GulpSlack = require('./Slack').GulpSlack;

if(process.env.OPTION_S3 === 'true')
  S3Upload = require('./S3Upload').S3Upload;

// --------------- 구분선 ---------------

const PROJECT = process.env.PROJECT;
const dir = path.join(__dirname, '..', '..', `${PROJECT}-code`, 'public', 'js', '/');

// Babel
const BabelBase = () => {
  let before = gulp
    .src(`../${process.env.PROJECT}-code/Javascript/*.js`)
    .pipe(sourcemaps.init())
    .pipe(
      Babel({
        presets: ["@babel/preset-env"],
        highlightCode: false,
        retainLines: true
      }).on("error", err => {
        console.log(err.message);
        GulpSlack(err, 'Babel');
        if(process.env.OPTION_SLACK === 'false') console.log(err.message.toString());
        this.emit("end");
      })
    )
    .pipe(concat("index.js"))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dir));

  if (process.env.OPTION_S3 !== 'false') {
    return S3Upload(before, "js");
  } else {
    return before;
  }
};

// TypeScript
const TypeScriptBase = () => {
  let before = gulp
    .src(`../${process.env.PROJECT}-code/Typescript/*.ts`)
    .pipe(sourcemaps.init())
    .pipe(
      TypeScript().on("error", err => {
        GulpSlack(err, 'Typescript');
        if(process.env.OPTION_SLACK === 'false') console.log(err.message.toString());
        this.emit("end");
      })
    )
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dir));

  if (process.env.OPTION_S3 !== 'false') {
    return S3Upload(before, "js");
  } else {
    return before;
  }
};

// WebPack
const WebpackBase = () => {
  let before = gulp
    .src(`../${process.env.PROJECT}-code/${process.env.STACK_SCRIPT_TYPE === 'javascript' ? 'Javascript' : 'TypeScript'}/index.*`)
    .pipe(
      webpack(require('../webpack.config'), null, (err, stats) => {
        if(err !== null) {
          GulpSlack(err, 'Webpack');
          if(process.env.OPTION_SLACK === 'false') console.log(err.message.toString());
          this.emit("end");
        }
      })
    )
    .pipe(gulp.dest(dir));

  if (process.env.OPTION_S3 !== 'false') {
    return S3Upload(before, "js");
  } else {
    return before;
  }
};


// --------------- 구분선 ---------------


exports.Babel = BabelBase;
exports.TypeScript = TypeScriptBase;
exports.Webpack = WebpackBase;