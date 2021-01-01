const gulp = require('gulp');
const { parallel } = require('gulp');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const terser = require('gulp-terser');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();

const srcPath = 'src/assets';
const distPath = 'dist/assets';

function style() {
    return gulp.src(`${srcPath}/scss/**/*.scss`)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({browsers: ['last 2 versions'], cascade: false}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(`${srcPath}/css`))
    .pipe(browserSync.stream());
}

function sassWatch(){
    browserSync.init({
        server: {
            baseDir: './src'
        }
    });

    gulp.watch(`${srcPath}/scss/**/*.scss`, style);
    gulp.watch('src/*.html').on('change', browserSync.reload);
    
}

function distHTML() {
    return gulp.src('src/*.html')
    .pipe(gulp.dest('dist/')); 
}

function distImages() {
    return gulp.src(`${srcPath}/images/*.{png,gif,jpg`)
    .pipe(gulp.dest(`${distPath}/images`)); 
}

function distCSS() {
    return gulp.src(`${srcPath}/css/*.css`)
    .pipe(cleanCSS())
    .pipe(gulp.dest(`${distPath}/css`));
}

function distJS() {
    return gulp.src(`${srcPath}/js/*.js`)
    .pipe(concat('main.js'))
    .pipe(terser())
    .pipe(gulp.dest(`${distPath}/js`));
}


exports.build = parallel(distHTML, distCSS, distJS, distImages); 
exports.sassWatch = sassWatch;
