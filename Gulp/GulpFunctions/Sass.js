const
  gulp = require("gulp"),
  sass = require("gulp-sass"),
  sourcemaps = require("gulp-sourcemaps"),
  autoPrefix = require("autoprefixer"),
  postcss = require("gulp-postcss"),
  rename = require("gulp-rename"),
  S3Upload = require('./S3Upload').S3Upload,
  GulpSlack = require('./Slack').GulpSlack;


// --------------- 구분선 ---------------


// 통합 scss
const SassMix = () => {
  let before = gulp
    .src(`../${process.env.PROJECT}-code/Scss/mix/style.min.scss`)
    // 해당파일 소스맵생성
    .pipe(sourcemaps.init())
    // slick notice
    .pipe(
      sass({ outputStyle: "compressed" }).on("error", err => {
        GulpSlack(err, 'SassMix');
        this.emit("end");
      })
    )
    // source map 경로 css 마지막 추가
    .pipe(sourcemaps.write())
    // 소스맵할당 개발용 min파일
    .pipe(rename("style.min.dev.css"))
    // output
    .pipe(gulp.dest("../public/css/"));

  if (process.env.OPTION_S3 !== 'false') {
    return S3Upload(before, "css");
  } else {
    return before;
  }
};

// 분리형 scss
const SassSingle = () => {
  let before = gulp
    .src(`../${process.env.PROJECT}-code/Scss/single/*.scss`)
    // 해당파일 소스맵생성
    .pipe(sourcemaps.init())
    // slick notice
    .pipe(
      sass({ outputStyle: "compressed" }).on("error", err => {
        GulpSlack(err, 'SassMin');
        this.emit("end");
      })
    )
    // source map 경로 css 마지막 추가
    .pipe(sourcemaps.write())
    // output
    .pipe(gulp.dest("../public/css/"));

  if (process.env.OPTION_S3 !== 'false') {
    return S3Upload(before, "css");
  } else {
    return before;
  }
};

const CrossBrowser = () => {
  let before = gulp
    .src("../public/css/style.min.dev.css")
    .pipe(postcss([autoPrefix({overrideBrowserslist: ["last 5 versions", "ie >= 10"]})]))
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("../public/css/"));

  if (process.env.OPTION_S3 !== 'false') {
    return S3Upload(before, "css", 'slackNoPush');
  } else {
    return before;
  }
};


// --------------- 구분선 ---------------


exports.SassMix = SassMix;
exports.SassSingle = SassSingle;
exports.CrossBrowser = CrossBrowser;