const
  gulp = require("gulp"),
  sourcemaps = require("gulp-sourcemaps"),
  Babel = require("gulp-babel"),
  TypeScript = require("gulp-typescript"),
  S3Upload = require('./S3Upload').S3Upload,
  GulpSlack = require('./Slack').GulpSlack;


// --------------- 구분선 ---------------


// Babel
const BabelBase = () => {
  let before = gulp
    .src("./Babel/*.js")
    .pipe(sourcemaps.init())
    .pipe(
      Babel().on("error", err => {
        GulpSlack(err, 'Babel');
        this.emit("end");
      })
    )
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("../public/js/"));

  if (process.env.OPTION_S3) {
    return S3Upload(before, "js");
  } else {
    return before;
  }
};

// TypeScript
const TypeScriptBase = () => {
  let before = gulp
    .src("./TypeScript/*.ts")
    .pipe(sourcemaps.init())
    .pipe(
      TypeScript().on("error", err => {
        GulpSlack(err, 'Typescript');
        this.emit("end");
      })
    )
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("../public/js/"));

  if (process.env.OPTION_S3) {
    return S3Upload(before, "js");
  } else {
    return before;
  }
};


// --------------- 구분선 ---------------


exports.Babel = BabelBase;
exports.TypeScript = TypeScriptBase;