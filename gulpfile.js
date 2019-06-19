/**************************

    대체하고 삭제영역

    __PROJECT_NAME__

    // slack upload
    __WEBHOOK_URL__
    __CDN_URL__

***************************/

// gulpfile.js
const gulp = require('gulp');

// 프로젝트명
const PROJECT = '__PROJECT_NAME__';

// cdn url
var CDN_URL = '__CDN_URL__';

// gulp plugin
const   sass 			= require('gulp-sass'),
        pug 			= require('gulp-pug'),
        sourcemaps 		= require('gulp-sourcemaps'),
        bb 				= require('gulp-babel'),
        ts 				= require('gulp-typescript'),
        autoprefixer	= require('autoprefixer'),
        postcss         = require('gulp-postcss'),
        awspublish      = require('gulp-awspublish'),
        rename 			= require('gulp-rename');

// dev import
const   key             = require('./secret/key.js');

// gulp notice plugin Slack
// webhook url list
const slack_dataset = {
    'space' : '__WEBHOOK_URL__',
    // vscode       : https://github.com/vscode-icons/vscode-icons/tree/master/icons
    // meterial     : https://github.com/PKief/vscode-material-icon-theme/tree/master/icons
    'icon_url' : {
        'sass' : CDN_URL+'/icons/sass.png',
        'babel' : CDN_URL+'/icons/babel.png',
        'typescript' : CDN_URL+'/icons/typescript.png'
    }
}
function slack_notice(user, channel, url, icon_url){
    var slack = require('gulp-slack')({
        url : url,
        channel : channel,
        user : user,
        icon_url : icon_url
    });

    return slack;
}

var publisher = awspublish.create(
    {
        // 해당지역코드 서울 : 'ap-northeast-2'
        region: 'ap-northeast-2', 
        params: {
            Bucket: key.BUCKET.NAME
        },
        "accessKeyId": key.BUCKET.ACCESSKEYID,
        "secretAccessKey": key.BUCKET.SECRETACCESSKEY
    },
    // TODO: 알아봐야하는 옵션
    // 정확하게 몰라서 적용하지 않음
    // {
    //     cacheFileName: "your-cache-location"
    // }
)

// make reusable pipeline
// s3 upload function
function s3_upload(inputStream, filetype) {
    // upload info
    var headers = { "Cache-Control": "max-age=315360000, no-transform, public" }

    return inputStream
        // s3 upload 하위폴더로 생성
        .pipe(rename(function(path){
            path.dirname = PROJECT + '/'+filetype+'/' + path.dirname;
        }))
        .pipe(publisher.publish(headers))
        // .pipe(s3.publisher.cache())
        .pipe(awspublish.reporter());
}


// gulp 4.0 변환

// 통합 scss
function sass_mix(){
    var before = gulp
        .src('./Scss/mix/style.min.dev.scss')
        // 해당파일 소스맵생성
        .pipe(sourcemaps.init())
        // slick notice
        .pipe(
            sass({ outputStyle: 'compressed' })
            .on(
                'error', function (err) {
                    slack_notice('Sass', '', slack_dataset.space, slack_dataset.icon_url.sass)([
                        {
                            'text' : PROJECT ,
                            'color': '#ec407a',
                            'fields': [
                                {
                                    'title': '에러발생 | mix',
                                    'value': err.message.toString()
                                }
                            ]
                        }
                    ]);
                    console.log(err.message.toString());
                    this.emit('end');
                }
            )
        )
        // source map 경로 css 마지막 추가
        .pipe(sourcemaps.write())
        // 소스맵할당 개발용 min파일
        .pipe(rename('style.min.dev.css'))
        // output
        .pipe(gulp.dest('../public/css/'));

    return s3_upload(before, 'string tpye!');
}
// 분리형 scss
function sass_single(){
    var before = gulp
        .src('./Scss/single/*.scss')
        // 해당파일 소스맵생성
        .pipe(sourcemaps.init())
        // slick notice
        .pipe(
            sass({ outputStyle: 'compressed' })
            .on(
                'error', function (err) {
                    slack_notice('Sass', '', slack_dataset.space, slack_dataset.icon_url.sass)([
                        {
                            'text' : PROJECT ,
                            'color': '#ec407a',
                            'fields': [
                                {
                                    'title': '에러발생 | single',
                                    'value': err.message.toString()
                                }
                            ]
                        }
                    ]);
                    console.log(err.message.toString());
                    this.emit('end');
                }
            )
        )
        // source map 경로 css 마지막 추가
        .pipe(sourcemaps.write('/map',{sourcRoot: '.'}))
        // output
        .pipe(gulp.dest('../public/css/'))
    
    return s3_upload(before, 'string tpye!');
}

// Babel
function babel(){
    var before =  gulp
        .src('./Babel/*.js')
        .pipe(sourcemaps.init())
        .pipe(
            bb()
            .on(
                'error', function(err){
                    slack_notice('Babel', '', slack_dataset.space, slack_dataset.icon_url.babel)([
                        {
                            'text' : PROJECT ,
                            'color': '#fdd835',
                            'fields': [
                                {
                                    'title': '에러발생 | Babel',
                                    'value': err.message.toString()
                                }
                            ]
                        }
                    ]);
                    console.log(err.message.toString());
                    this.emit('end');
                }
            )
        )
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('../public/js/'));

    return s3_upload(before, 'string tpye!');
}

// TypeScript
function typescript(){
    var before = gulp
		.src('./TypeScript/*.ts')
		.pipe(sourcemaps.init())
        .pipe(
            ts()
            .on(
                'error', function(err){
                    slack_notice('Typescript', '', slack_dataset.space, slack_dataset.icon_url.typescript)([
                        {
                            'text' : PROJECT ,
                            'color': '#0288d1',
                            'fields': [
                                {
                                    'title': '에러발생 | Typescript',
                                    'value': err.message.toString()
                                }
                            ]
                        }
                    ]);
                    console.log(err.message.toString());
                    this.emit('end');
                }
            )
        )
		.pipe(sourcemaps.write())
        .pipe(gulp.dest('../public/js/'));

    return s3_upload(before, 'string tpye!');
}

// Crossbrowser
function cross_browser(){
    var before = gulp
        .src('../public/css/style.min.dev.css')
        .pipe(postcss([ autoprefixer() ]))
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest('../public/css/'));

    return s3_upload(before, 'string tpye!');
}

// watch
gulp.task('hello', function(){
    gulp.watch('./scss/mix/*.scss', gulp.series(gulp.parallel(sass_mix),cross_browser));
    gulp.watch('./scss/single/*.scss', gulp.series(gulp.parallel(sass_single)));
    gulp.watch('./Babel/*.js', gulp.series(babel));
    gulp.watch('./TypeScript/*.ts', gulp.series(typescript));
});
