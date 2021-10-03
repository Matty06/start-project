const gulp = require('gulp');
const { parallel, src } = require('gulp');
const gulpStylelint = require('gulp-stylelint');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const terser = require('gulp-terser');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();

const srcPath = 'src/assets';
const distPath = 'dist/assets';

const stylelint = (done) => {
    gulp.src(srcPath)
    .pipe(gulpStylelint({
        reporters: [
            {formatter: 'string', console: true}
        ]
    }));

    done();
}

const style = () => {
    return gulp.src(`${srcPath}/scss/**/*.scss`)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({browsers: ['last 2 versions'], cascade: false}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(`${srcPath}/css`))
    .pipe(browserSync.stream());
}

const sassWatch = () => {
    browserSync.init({
        server: {
            baseDir: './src'
        }
    });

    gulp.watch(`${srcPath}/scss/**/*.scss`, style);
    gulp.watch('src/*.html').on('change', browserSync.reload);
    
}

const distHTML = () => {
    return gulp.src('src/*.html')
    .pipe(gulp.dest('dist/')); 
}

const distImages = () => {
    return gulp.src(`${srcPath}/images/*.{png,gif,jpg}`)
    .pipe(gulp.dest(`${distPath}/images`)); 
}

const distCSS = () => {
    return gulp.src(`${srcPath}/css/*.css`)
    .pipe(cleanCSS())
    .pipe(gulp.dest(`${distPath}/css`));
}

const distJS = () => {
    return gulp.src(`${srcPath}/js/*.js`)
    .pipe(concat('main.js'))
    .pipe(terser())
    .pipe(gulp.dest(`${distPath}/js`));
}


exports.build = parallel(distHTML, distCSS, distJS, distImages);
exports.stylelint = stylelint; 
exports.sassWatch = sassWatch;
