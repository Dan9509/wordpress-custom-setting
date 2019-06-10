// gulpfile.js
const   gulp = require('gulp');

// gulp plugin
const   sass 			= require('gulp-sass'),
        pug 			= require('gulp-pug'),
        sourcemaps 		= require('gulp-sourcemaps'),
        bb 				= require('gulp-babel'),
        ts 				= require('gulp-typescript'),
        autoprefixer	= require('gulp-autoprefixer'),
        rename 			= require('gulp-rename');

// gulp notice plugin Slack
const   slack = {
    sass : require('gulp-slack')({
        url: '##slack_web_hook_url##',
        channel: '',    	// Optional
        user: 'Sass',       // Optional
        icon_url: '',   	// Optional
    })
}


// gulp 4.0 변환

// 통합 scss
function sass_integrated(){
    return gulp
        .src('./Scss/mix/style.min.dev.scss')
        .pipe(sourcemaps.init())
        .pipe(
            sass({ outputStyle: 'compressed' })
            .on(
                'error', function (err) {
                    slack.sass([
                        {
                            'text' : '에러발생' ,
                            'color': '#da1836',
                            'fields': [
                                {
                                    'title': '',
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
        .pipe(sourcemaps.write('/map',{sourcRoot: '.'}))
        .pipe(gulp.dest('../public/css/'));
}
// 분리형 scss
function sass_container(){
    return gulp
        .src('./Scss/single/*.scss')
        .pipe(sourcemaps.init())
        .pipe(
            sass({outputStyle: 'compressed'})
            .on('error', sass.logError)
        )
        .pipe(sourcemaps.write('/map',{sourcRoot: '.'}))
        .pipe(gulp.dest('../public/css/'));
}

// Babel
function babel(){
    return gulp
        .src('./Babel/*.js')
        .pipe(sourcemaps.init())
        .pipe(bb())
        .pipe(sourcemaps.write('/map/',{sourcRoot: '.'}))
        .pipe(gulp.dest('../public/js/Babel/'));
}

// TypeScript
function typescript(){
    return gulp
		.src('./TypeScript/*.ts')
		.pipe(sourcemaps.init())
		.pipe(ts())
		.pipe(sourcemaps.write('/map/',{sourcRoot: '.'}))
        .pipe(gulp.dest('../public/js/TypeScript/'));
}

// Crossbrowser
function cross_browser(){
    return gulp
        .src('../public/css/style.min.dev.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest('../public/css/'));
}

// watch
gulp.task('hello', function(){
    gulp.watch('./scss/mix/*.scss', gulp.series(gulp.parallel(sass_integrated),cross_browser));
    gulp.watch('./scss/single/*.scss', gulp.series(gulp.parallel(sass_container)));
    gulp.watch('./Babel/*.js', gulp.series(babel));
    gulp.watch('./TypeScript/*.ts', gulp.series(typescript));
});
