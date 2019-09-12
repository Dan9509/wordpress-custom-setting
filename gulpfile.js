/**************************

 전역환경변수 설정후 사용!!
 (feat. .env)

 ***************************/

// gulpfile.js
const gulp = require("gulp");

// gulp plugin
const sass = require("gulp-sass"),
  sourcemaps = require("gulp-sourcemaps"),
  bb = require("gulp-babel"),
  ts = require("gulp-typescript"),
  autoPrefix = require("autoprefixer"),
  postcss = require("gulp-postcss"),
  rename = require("gulp-rename"),
  S3Upload = require('./GulpFunctions/S3Upload').S3Upload,
  SlackNotice = require('./GulpFunctions/Slack').SlackNotice,
  NoticeContent = require('./GulpFunctions/Slack').NoticeContent;

/**************************

 사용하고싶은 옵션만 선택 활성화

 ***************************/
const OPTION = {
  sass: true,
  babel: true,
  s3: true,
};

// gulp 4.0 변환

// 통합 scss
const sass_mix = () => {
  let before = gulp
    .src("./Scss/mix/style.min.scss")
    // 해당파일 소스맵생성
    .pipe(sourcemaps.init())
    // slick notice
    .pipe(
      sass({ outputStyle: "compressed" }).on("error", err => {
        SlackNotice("Sass")(NoticeContent(err.message.toString(), 'ERROR! | mix', '#ec407a'));
        console.log(err.message.toString());
        this.emit("end");
      })
    )
    // source map 경로 css 마지막 추가
    .pipe(sourcemaps.write())
    // 소스맵할당 개발용 min파일
    .pipe(rename("style.min.dev.css"))
    // output
    .pipe(gulp.dest("../public/css/"));

  if (OPTION.s3) {
    return S3Upload(before, "css");
  } else {
    return before;
  }
};

// 분리형 scss
const sass_single = () => {
  let before = gulp
    .src("./Scss/single/*.scss")
    // 해당파일 소스맵생성
    .pipe(sourcemaps.init())
    // slick notice
    .pipe(
      sass({ outputStyle: "compressed" }).on("error", err => {
        SlackNotice("Sass")(NoticeContent(err.message.toString(), 'ERROR! | single', '#ec407a'));
        console.log(err.message.toString());
        this.emit("end");
      })
    )
    // source map 경로 css 마지막 추가
    .pipe(sourcemaps.write("/map", { sourcRoot: "." }))
    // output
    .pipe(gulp.dest("../public/css/"));

  if (OPTION.s3) {
    return S3Upload(before, "css");
  } else {
    return before;
  }
};

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

  if (OPTION.s3) {
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

  if (OPTION.s3) {
    return S3Upload(before, "js");
  } else {
    return before;
  }
};

// Crossbrowser
const cross_browser = () => {
  let before = gulp
    .src("../public/css/style.min.dev.css")
    .pipe(postcss([autoPrefix()]))
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("../public/css/"));

  if (OPTION.s3) {
    return S3Upload(before, "css");
  } else {
    return before;
  }
};

// watch
gulp.task("hello", () => {
  gulp.watch(
    "./Scss/mix/*.scss",
    gulp.series(gulp.parallel(sass_mix), cross_browser)
  );
  gulp.watch("./Scss/single/*.scss", gulp.series(gulp.parallel(sass_single)));
  gulp.watch("./Babel/*.js", gulp.series(babel));
  gulp.watch("./TypeScript/*.ts", gulp.series(typescript));
});
