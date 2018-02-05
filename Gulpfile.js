var autoprefixer    = require('autoprefixer');
var browserSync     = require('browser-sync').create();
var del             = require('del');
var gulp            = require('gulp');
var imagemin        = require('gulp-imagemin');
var inlinesource    = require('gulp-inline-source');
var jshint          = require('gulp-jshint');
var mergeLonghand   = require('postcss-merge-longhand');
var mqpacker        = require('css-mqpacker');
var nano            = require('gulp-cssnano');
var notify          = require('gulp-notify');
var plumber         = require('gulp-plumber');
var postcss         = require('gulp-postcss');
var replace         = require('gulp-replace');
var runSequence     = require('run-sequence');
var sass            = require('gulp-sass');
var sassGlob        = require('gulp-sass-glob');
var sourcemaps      = require('gulp-sourcemaps');
var stylish         = require('jshint-stylish');
var trim            = require('gulp-trim');
var uglify          = require('gulp-uglify');
var webpack         = require('webpack-stream');


/*
  --------------------
  Clean tasks
  --------------------
*/

// Cleans out the `docs` directory
gulp.task('clean:docs', function() {
  return del(['./docs/**/*']);
});

// Keep those .DS_Store files at bay
gulp.task('clean:dsstore', function() {
  return del(['**/.DS_Store']);
});


/*
  --------------------
  Image tasks
  --------------------
*/

gulp.task('images:files', function() {
  return gulp.src([
      './src/assets/images/**/*.{jpg,png,gif,svg}'
    ])
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(imagemin({
      progressive: true
    }))
    .pipe(gulp.dest('./docs/assets/images'));
});

gulp.task('images:other', function() {
  return gulp.src([
      './src/assets/images/**/*.{xml,json,mp4,webm}'
    ])
    .pipe(gulp.dest('./docs/assets/images'));
});

gulp.task('images', ['images:files', 'images:other']);
gulp.task('images-watch', ['images'], browserSync.reload);


/*
  --------------------
  Markup tasks
  --------------------
*/


gulp.task('markup:html', function () {
  return gulp.src([
      './src/templates/*.html'
    ])
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(inlinesource({
      rootpath: './docs'
    }))
    .pipe(gulp.dest('./docs'));
});

gulp.task('markup', function(callback) {
  runSequence('markup:html', callback);
});
gulp.task('markup-watch', ['markup'], browserSync.reload);

/*
  --------------------
  Media tasks
  --------------------
*/

gulp.task('media', function() {
  return gulp.src([
      './src/assets/media/**/*'
    ])
    .pipe(gulp.dest('./docs/assets/media'));
});


/*
  --------------------
  Scripts tasks
  --------------------
*/

gulp.task('scripts:jshint', function() {
  return gulp.src([
      './src/assets/scripts/**/*.js',
      '!./src/assets/scripts/vendor/*.js',
      '!./src/assets/scripts/polyfills-ie9.js'
    ])
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('scripts:build', function() {
  return gulp.src(['./src/assets/scripts/index.js'])
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(webpack({
      plugins: [
        new webpack.webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false
          },
          sourceMap: true
        })
      ],
      devtool: 'source-map',
      entry: {
        'home': ['./src/assets/scripts/app.js'],
        'index': ['./src/assets/scripts/app.js'],
      },
      output: {
        filename: '[name].js',
      }
    }))
    .pipe(gulp.dest('./docs/assets/scripts'));
});

gulp.task('scripts:move', function() {
  return gulp.src([
      './src/assets/scripts/font-loading.js',
      './src/assets/scripts/polyfills-ie9.js'
    ])
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(uglify())
    .pipe(gulp.dest('./docs/assets/scripts'));
});

gulp.task('scripts:vendor', function() {
  return gulp.src([
      './node_modules/lazysizes/plugins/respimg/ls.respimg.js'
    ])
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(uglify())
    .pipe(gulp.dest('./docs/assets/scripts/vendor'));
});

gulp.task('scripts', [

  'scripts:jshint',
  'scripts:move',
  'scripts:build'
]);

gulp.task('scripts-watch', ['scripts'], browserSync.reload);


/*
  --------------------
  Styles tasks
  --------------------
*/

var processors = [
  autoprefixer({
    browsers: [
    'last 3 versions',
    '> 1%',
    'ie >= 9'
    ]
  }),
  mergeLonghand,
  mqpacker({
    sort: true
  })
];

gulp.task('styles:main', function() {
  return gulp.src([
      './src/assets/styles/*.scss',
      '!./src/assets/styles/home.scss',
    ])
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(postcss(processors))
    .pipe(nano({
      reduceIdents: false,
      zindex: false
    }))
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest('./docs/assets/styles'))
    .pipe(browserSync.stream());
});

gulp.task('styles:home', function() {
  return gulp.src([
      './src/assets/styles/home.scss',
    ])
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(postcss(processors))
    .pipe(nano({
      zindex: false
    }))
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest('./docs/assets/styles'))
    .pipe(browserSync.stream());
});

gulp.task('styles:vendor', function() {
  return gulp.src([
      './node_modules/prismjs/themes/prism.css'
    ])
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(nano())
    .pipe(gulp.dest('./docs/assets/styles/vendor'))
    .pipe(browserSync.stream());
});

gulp.task('styles', ['styles:main', 'styles:home', 'styles:vendor']);


/*
  --------------------
  Default task
  --------------------
*/

gulp.task('default', function(callback) {
  runSequence(
    'clean:docs',
    'clean:dsstore',
    [
      'images',
      'media',
      'scripts',
      'styles',
      'markup'
    ],
    function() {
      browserSync.init({
        server: {
          baseDir: './docs'
        }
      });

      gulp.watch([
        './src/assets/images/**/*.+(jpg|png|gif|svg)'
      ], ['images-watch']);

      gulp.watch([
        './src/assets/scripts/**/*.js'
      ], ['scripts-watch']);

      gulp.watch([
        './src/assets/styles/*.scss',
        '!./src/assets/styles/vendor/*.scss'
      ], ['styles:main']);

      gulp.watch([
        './src/assets/styles/base/*.scss',
        './src/assets/styles/home.scss',
        './src/assets/styles/home/*.scss'
      ], ['styles:home']);

      gulp.watch([
        './src/assets/styles/vendor/*.scss'
      ], ['styles:vendor']);

      gulp.watch([
        './src/templates/*.html',
      ], ['markup-watch']);

      gulp.watch([
        './src/assets/media/**/*'
      ], ['media']);
    }
  );
});