const
  gulp = require("gulp"),
  sourcemaps = require("gulp-sourcemaps"),
  Babel = require("gulp-babel"),
  TypeScript = require("gulp-typescript"),
  S3Upload = require('./S3Upload').S3Upload,
  SlackNotice = require('./Slack').SlackNotice,
  NoticeContent = require('./Slack').NoticeContent;


// --------------- 구분선 ---------------


// Babel
const BabelBase = () => {
  let before = gulp
    .src("./Babel/*.js")
    .pipe(sourcemaps.init())
    .pipe(
      Babel().on("error", err => {
        SlackNotice("Babel")(NoticeContent(err.message.toString(), 'ERROR! | Babel', '#fdd835'));
        console.log(err.message.toString());
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
        SlackNotice("Typescript")(NoticeContent(err.message.toString(), 'ERROR! | Typescript', '#0288d1'));
        console.log(err.message.toString());
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