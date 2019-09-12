const gulp = require("gulp"),
  sass = require("gulp-sass"),
  sourcemaps = require("gulp-sourcemaps"),
  autoPrefix = require("autoprefixer"),
  postcss = require("gulp-postcss"),
  rename = require("gulp-rename"),
  S3Upload = require('./S3Upload').S3Upload,
  SlackNotice = require('./Slack').SlackNotice,
  NoticeContent = require('./Slack').NoticeContent;

// 통합 scss
const SassMix = () => {
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

  if (process.env.OPTION_S3) {
    return S3Upload(before, "css");
  } else {
    return before;
  }
};

// 분리형 scss
const SassSingle = () => {
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
    .pipe(sourcemaps.write())
    // output
    .pipe(gulp.dest("../public/css/"));

  if (process.env.OPTION_S3) {
    return S3Upload(before, "css");
  } else {
    console.log(OPTION);
    return before;
  }
};

const CrossBrowser = () => {
  let before = gulp
    .src("../public/css/style.min.dev.css")
    .pipe(postcss([autoPrefix()]))
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("../public/css/"));

  if (process.env.OPTION_S3) {
    return S3Upload(before, "css");
  } else {
    return before;
  }
};

exports.SassMix = SassMix;
exports.SassSingle = SassSingle;
exports.CrossBrowser = CrossBrowser;