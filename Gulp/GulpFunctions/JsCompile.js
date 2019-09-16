const
  gulp = require("gulp"),
  sourcemaps = require("gulp-sourcemaps"),
  Babel = require("gulp-babel"),
  concat = require("gulp-concat"),
  TypeScript = require("gulp-typescript"),
  S3Upload = require('./S3Upload').S3Upload,
  GulpSlack = require('./Slack').GulpSlack;


// --------------- 구분선 ---------------


// Babel
const BabelBase = () => {
  let before = gulp
    .src("../code/Vanilla/*.js")
    .pipe(sourcemaps.init())
    .pipe(
      Babel().on("error", err => {
        console.log(err.message);
        this.emit("end");
      })
    )
    .pipe(concat("index.js"))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("../public/js/"));

  if (process.env.OPTION_S3 !== 'false') {
    return S3Upload(before, "js");
  } else {
    return before;
  }
};

// TypeScript
const TypeScriptBase = () => {
  let before = gulp
    .src("../code/TypeScript/*.ts")
    .pipe(sourcemaps.init())
    .pipe(
      TypeScript().on("error", err => {
        GulpSlack(err, 'Typescript');
        this.emit("end");
      })
    )
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("../public/js/"));

  if (process.env.OPTION_S3 !== 'false') {
    return S3Upload(before, "js");
  } else {
    return before;
  }
};


// --------------- 구분선 ---------------


exports.Babel = BabelBase;
exports.TypeScript = TypeScriptBase;