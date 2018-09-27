import gulp from 'gulp'
import gulpSass from 'gulp-sass'
import sassGlob from 'gulp-sass-glob'
import cleanCSS from 'gulp-clean-css'
import rename from 'gulp-rename'
import sourcemaps from 'gulp-sourcemaps'
import wait from 'gulp-wait'
import gulpMustache from 'gulp-mustache'
import del from 'del'
import autoprefixer from 'gulp-autoprefixer'
import browserSync from 'browser-sync'
import paths from './paths.json'

const bs = browserSync.create();

const serverConfig = {
  server: {
    baseDir: "./build",
    serveStaticOptions: {
        extensions: ["html"]
    }      
  },
  notify: false,
  ghostMode: false
}

// Clear build directorie
export const delBuild = () => del('./build/**/*');

// Styles
// Non minified
export function styles() {
  return gulp.src(paths.src.scss+'/style.scss')
        .pipe(wait(500))
        .pipe(sassGlob())
        .pipe(sourcemaps.init())
          .pipe(gulpSass().on('error', gulpSass.logError))
          .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
          }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.build.css));
}

// Minified styles
export function minStyles() {
  return gulp.src(paths.build.css+'/style.css')
        .pipe(cleanCSS())
        .pipe(rename({
          suffix: '.min'
        }))
        .pipe(gulp.dest(paths.build.css));
}

// Vendor styles
export function vendorStyles() {
  return gulp.src(paths.src.scss+'/vendors/**/*.css')
        .pipe(gulp.dest(paths.build.css+'/vendors'));
}

export function libs() {
  return gulp.src('src/libs/**/*')
        .pipe(gulp.dest('build/libs/'));
}

// JS
// Non minified
export function scripts() {
  return gulp.src(paths.src.js+'/**/*.js')
        .pipe(gulp.dest(paths.build.js));
}

// Mustache
export function mustacheToHtml() {
  return gulp.src('src/*.mustache')
        .pipe(gulpMustache('src/data.json',{},{}))
        .pipe(rename({
          extname: '.html'
        }))
        .pipe(gulp.dest('build/'));
}

// Images
export function images() {
  return gulp.src(paths.src.img+'/**/*.*')
        .pipe(gulp.dest(paths.build.img));
}

// Font
export function fonts() {
  return gulp.src(paths.src.fonts+'/**/*.*')
        .pipe(gulp.dest(paths.build.fonts));
}

// Start server
export function serverStart() {
  bs.init(serverConfig);
}

// Reload server
export function serverReload(done) {
  bs.reload();
  return done();
}

// Watch
export function watch() {
  // Styles
  gulp.watch([paths.src.scss+'/**/*.scss', paths.src.scss+'/vendors/**/*.css'], gulp.series(styles, vendorStyles, serverReload));
  // Mustache
  gulp.watch(['src/**/*.mustache', 'src/data.json'], gulp.series(mustacheToHtml ,serverReload));
  // Images
  gulp.watch([paths.src.img], gulp.series(images, serverReload));
  // Fonts
  gulp.watch([paths.src.fonts], gulp.series(fonts, serverReload));
  // JS
  gulp.watch([paths.src.js], gulp.series(scripts, serverReload));
  // Libs
  gulp.watch(['src/libs/**/*'], gulp.series(libs, serverReload));
}

// Build Task
gulp.task('build', gulp.series(
  delBuild,
  styles,
  vendorStyles,
  mustacheToHtml,
  scripts,
  fonts,
  images,
  minStyles,
  libs
));

// Dev Task
gulp.task('dev', gulp.series(
  styles,
  vendorStyles,
  mustacheToHtml,
  scripts,
  fonts,
  images,
  libs,
  gulp.parallel(watch, serverStart)
));