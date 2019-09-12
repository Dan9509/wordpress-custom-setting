/**************************

 대체하고 삭제영역

 __PROJECT_NAME__

 **slack notice
 __CDN_URL__

 **S3 upload
 __string__

 ***************************/

// gulpfile.js
const gulp = require("gulp");

// 프로젝트명
const PROJECT = "gulpTest";

// cdn url
var CDN_URL = "__CDN_URL__";

// gulp plugin
const sass = require("gulp-sass"),
  pug = require("gulp-pug"),
  sourcemaps = require("gulp-sourcemaps"),
  bb = require("gulp-babel"),
  ts = require("gulp-typescript"),
  autoPrefix = require("autoprefixer"),
  postcss = require("gulp-postcss"),
  awsPublish = require("gulp-awspublish"),
  rename = require("gulp-rename"),
  S3Upload = require('./GulpFunctions/S3Upload').S3Upload;

/**************************

 사용하고싶은 옵션만 선택 활성화

 ***************************/
const OPTION = {
  sass: true,
  babel: true,
  s3: true,
};

// dev import
const key = require("./.secret/devKey.js");

// gulp notice plugin Slack
// webhook url list
const slack_dataset = {
  space: key.SLACK.webhook,
  // vscode       : https://github.com/vscode-icons/vscode-icons/tree/master/icons
  // meterial     : https://github.com/PKief/vscode-material-icon-theme/tree/master/icons
  icon_url: {
    sass: CDN_URL + "/icons/sass.png",
    babel: CDN_URL + "/icons/babel.png",
    typescript: CDN_URL + "/icons/typescript.png"
  }
};
const slack_notice = (user, channel, url, icon_url) => {
  return require("gulp-slack")({
    url: url,
    channel: channel,
    user: user,
    icon_url: icon_url
  });
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
        slack_notice(
          "Sass",
          "",
          slack_dataset.space,
          slack_dataset.icon_url.sass
        )([
          {
            text: PROJECT,
            color: "#ec407a",
            fields: [
              {
                title: "에러발생 | mix",
                value: err.message.toString()
              }
            ]
          }
        ]);
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
        slack_notice(
          "Sass",
          "",
          slack_dataset.space,
          slack_dataset.icon_url.sass
        )([
          {
            text: PROJECT,
            color: "#ec407a",
            fields: [
              {
                title: "에러발생 | single",
                value: err.message.toString()
              }
            ]
          }
        ]);
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
        slack_notice(
          "Babel",
          "",
          slack_dataset.space,
          slack_dataset.icon_url.babel
        )([
          {
            text: PROJECT,
            color: "#fdd835",
            fields: [
              {
                title: "에러발생 | Babel",
                value: err.message.toString()
              }
            ]
          }
        ]);
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
        slack_notice(
          "Typescript",
          "",
          slack_dataset.space,
          slack_dataset.icon_url.typescript
        )([
          {
            text: PROJECT,
            color: "#0288d1",
            fields: [
              {
                title: "에러발생 | Typescript",
                value: err.message.toString()
              }
            ]
          }
        ]);
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
