// ==================================================
// Requerimos los módulos necesarios
// ==================================================
const gulp = require('gulp');
const gulpIf = require('gulp-if');
const sassCompiler = require('gulp-sass')(require('sass'));
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const htmlmin = require('gulp-htmlmin');
const purgecss = require('gulp-purgecss');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const replace = require('gulp-replace');

// ==================================================
// Variable booleana para controlar el modo
// desarrollo: true  => sin empaquetar (más legible)
// desarrollo: false => empaquetado y optimizado
// ==================================================
const desarrollo = true; // Cambia a true para desarrollo

// ==================================================
// Tareas Sass
// Procesa los SCSS de estilos
// ==================================================
gulp.task('sass', function() {
  return gulp.src('dev/styles/scss/**/*.scss')
    .pipe(sassCompiler().on('error', sassCompiler.logError))
    .pipe(gulpIf(!desarrollo, purgecss({
      content: ['dev/**/*.html']
    })))
    .pipe(gulpIf(!desarrollo, autoprefixer({ cascade:false }))) // CUANTO POR CULO ME DIO ESTO
    .pipe(gulpIf(!desarrollo, cleanCSS()))
    .pipe(gulp.dest('pub/css'));
});
// ==================================================
// Tarea watch
// Se amplió para vigilar también SCSS en scripts, HTML, JS e imágenes
// ==================================================
gulp.task('watch', function() {
  gulp.watch('dev/styles/scss/**/*.scss', gulp.series('sass'));
  gulp.watch('dev/**/*.html', gulp.series('html'));
  gulp.watch('dev/scripts/**/*.js', gulp.series('js'));
  gulp.watch('dev/images/**/*', gulp.series('images'));
});

// ==================================================
// Tarea JS
// Se agrega minificación condicional con uglify en producción
// ==================================================
gulp.task('js', function() {
  return gulp.src('dev/scripts/**/*.js')
    .pipe(gulpIf(!desarrollo, concat('scripts.js')))
    .pipe(gulpIf(!desarrollo, babel()))
    .pipe(gulpIf(!desarrollo, uglify()))
    .pipe(gulp.dest('pub/scripts'));
});
// ==================================================
// Tarea HTML
// Se unificaron las tareas existentes 'clean-html' y 'min-html'
// para que, en producción, se minifique el HTML; en desarrollo se copie tal cual.
// También se ha hecho uso del replace para corregir error de ubicacion en el css
// ==================================================
gulp.task('html', function() {
  return gulp.src('dev/**/*.html')
    .pipe(replace(/href="\.\.\/styles\/css\/.*\.css"/g, 'href="/pub/css/main.css"'))
    .pipe(gulpIf(!desarrollo, htmlmin({
      collapseWhitespace: true,
      removeComments: true
    })))
    .pipe(gulp.dest('pub'));  // Guardar los archivos modificados en pub/
});
// ==================================================
// Nueva tarea: Optimizar imágenes
// Utiliza gulp-imagemin para comprimir las imágenes al publicarlas
// ==================================================
gulp.task('images', function() {
  return gulp.src('dev/sources/**/*')
    //.pipe(imagemin())  // funciona mal con svg
    .pipe(gulp.dest('pub/sources'));
});
// ==================================================
// Tarea default
// ==================================================
gulp.task('default', gulp.series(
  // Mensaje inicial
  (done) => {
    console.log('¡Tarea Gulp funcionando correctamente!');
    done();
  },
  // Ejecuta en paralelo las tareas de compilación y optimización
  gulp.parallel('sass', 'js', 'html', 'images'),
  // Inicia el watcher para observar cambios
  'watch'
));
