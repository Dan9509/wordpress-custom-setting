/**************************

 전역환경변수 설정후 사용!!
 (feat. .env)

 ***************************/

// gulp plugin
const
  gulp = require("gulp"),
  CrossBrowser = require('./GulpFunctions/Sass').CrossBrowser,
  SassMix = require('./GulpFunctions/Sass').SassMix,
  SassSingle = require('./GulpFunctions/Sass').SassSingle,
  Babel = require('./GulpFunctions/JsCompile').Babel,
  TypeScript = require('./GulpFunctions/JsCompile').TypeScript;


// --------------- 구분선 ---------------


// watch
gulp.task("default", () => {

  // 통합 SCSS 기능
  gulp.watch(
    `../${process.env.PROJECT}-code/Scss/mix/*.scss`,
    gulp.series(gulp.parallel(SassMix), CrossBrowser)
  );

  // 개별 SCSS 기능
  gulp.watch(
    `../${process.env.PROJECT}-code/Scss/single/*.scss`,
    gulp.series(gulp.parallel(SassSingle), CrossBrowser)
  );

  // Babel!!
  gulp.watch(`../${process.env.PROJECT}-code/Javascript/*.js`, gulp.series(Babel));

  // TypeScript!!
  gulp.watch(`../${process.env.PROJECT}-code/Typescript/*.ts`, gulp.series(TypeScript));
});