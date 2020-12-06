const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync').create();

// compile scss --> css
function style() {
    return gulp.src('./assets/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({browsers: ['last 2 versions'], cascade: false}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./assets/css'))
    .pipe(browserSync.stream());
}

function sassWatch(){
    browserSync.init({
        server: {
            baseDir: './'
        }
    });

    gulp.watch('./assets/scss/**/*.scss', style);
    gulp.watch('./*.html').on('change', browserSync.reload);
    
}

function minifyCSS(){
    return gulp.src('assets/css/*.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest('assets/css'));
}

exports.minifyCSS = minifyCSS;
exports.style = style;
exports.sassWatch = sassWatch;
