/**************************

 전역환경변수 설정후 사용!!
 (feat. .env)

 ***************************/

// gulpfile.js
const gulp = require("gulp");

// gulp plugin
const sourcemaps = require("gulp-sourcemaps"),
  bb = require("gulp-babel"),
  ts = require("gulp-typescript"),
  CrossBrowser = require('./GulpFunctions/Sass').CrossBrowser,
  SassMix = require('./GulpFunctions/Sass').SassMix,
  SassSingle = require('./GulpFunctions/Sass').SassSingle,
  S3Upload = require('./GulpFunctions/S3Upload').S3Upload,
  SlackNotice = require('./GulpFunctions/Slack').SlackNotice,
  NoticeContent = require('./GulpFunctions/Slack').NoticeContent;

// Babel
const babel = () => {
  let before = gulp
    .src("./Babel/*.js")
    .pipe(sourcemaps.init())
    .pipe(
      bb().on("error", err => {
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
const typescript = () => {
  let before = gulp
    .src("./TypeScript/*.ts")
    .pipe(sourcemaps.init())
    .pipe(
      ts().on("error", err => {
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

// watch
gulp.task("hello", () => {
  gulp.watch(
    "./Scss/mix/*.scss",
    gulp.series(gulp.parallel(SassMix), CrossBrowser)
  );
  gulp.watch(
    "./Scss/single/*.scss",
    gulp.series(gulp.parallel(SassSingle), CrossBrowser)
  );
  gulp.watch("./Babel/*.js", gulp.series(babel));
  gulp.watch("./TypeScript/*.ts", gulp.series(typescript));
});