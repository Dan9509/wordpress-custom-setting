const
  gulp = require("gulp"),
  sass = require("gulp-sass"),
  sourcemaps = require("gulp-sourcemaps"),
  autoPrefix = require("autoprefixer"),
  postcss = require("gulp-postcss"),
  concat = require("gulp-concat"),
  rename = require("gulp-rename"),
  S3Upload = require('./S3Upload').S3Upload,
  GulpSlack = require('./Slack').GulpSlack;


// --------------- 구분선 ---------------


// 통합 scss
const SassMix = () => {
  let before = gulp
    .src("./Scss/mix/*.scss")
    // 해당파일 소스맵생성
    .pipe(sourcemaps.init())
    // slick notice
    .pipe(
      sass({ outputStyle: "compressed" }).on("error", err => {
        GulpSlack(err, 'Sass Mix');
        this.emit("end");
      })
    )
    .pipe(concat('style.min.dev.css'))
    // source map 경로 css 마지막 추가
    .pipe(sourcemaps.write())
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
        GulpSlack(err, 'Sass min');
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


// --------------- 구분선 ---------------


exports.SassMix = SassMix;
exports.SassSingle = SassSingle;
exports.CrossBrowser = CrossBrowser;