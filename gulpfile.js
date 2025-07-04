'use strict'
const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const gulp = require('gulp')
const replaceExt = require('replace-ext')
const rename = require('gulp-rename')
const concat = require('gulp-concat')
const iconfont = require('gulp-iconfont')
const consolidate = require('gulp-consolidate')
const svgstore = require('gulp-svgstore')
const svgmin = require('gulp-svgmin')
const through = require('through2')
const glob = require('glob')
const bs = require('browser-sync').create()
const _ = require('lodash')

const svgs = 'resources/icons/**/*.svg'
const templates = 'templates/**/*.{js,css,html}'
const fontName = 'ui-iconfont'
const className = 'ui-iconfont'
const classPrefix = 'ui-icon-'
const template = 'fontawesome-style'
const timestamp = Math.round(Date.now() / 1000)

const calcHash = function (files) {
  let hash = crypto.createHash('md5')
  files.forEach(function (file) {
    hash.update(fs.readFileSync(file, 'utf8'))
  })
  return hash.digest('hex')
}

gulp.task('svgstore', () =>
  gulp
    .src(svgs)
    .pipe(
      svgmin(file => {
        const prefix = path.basename(file.relative, path.extname(file.relative))
        return {
          plugins: [
            {
              cleanupIDs: {
                prefix: prefix + '-',
                minify: true,
              },
            },
          ],
        }
      }),
    )
    .pipe(svgstore())
    .pipe(pipeSvgSpriteData())
    .pipe(rename({ basename: fontName }))
    .pipe(gulp.dest('src/static/fonts/icons/')),
)

gulp.task(
  'build:iconfont',
  gulp.series('svgstore', () =>
    gulp
      .src(svgs)
      .pipe(
        iconfont({
          fontName,
          formats: ['ttf', 'eot', 'woff', 'svg'],
          normalize: true,
          fontHeight: 10000,
          timestamp,
          log: () => {
            //
          },
        }),
      )
      .on('glyphs', function (glyphs) {
        const options = {
          className,
          classPrefix,
          fontName,
          timestamp,
          hash: calcHash(glob.sync(svgs)),
          fontPath: '../fonts/',
          glyphs: glyphs.map(mapGlyphs),
        }

        gulp
          .src([`templates/${template}-fontface.css`, `templates/${template}.css`])
          .pipe(consolidate('lodash', options))
          .pipe(concat(`${fontName}.css`))
          .pipe(gulp.dest('src/static/fonts/styles/'))

        gulp.src('templates/demo.css').pipe(gulp.dest('src/static/fonts/styles'))

        gulp
          .src(`templates/${template}.html`)
          .pipe(consolidate('lodash', options))
          .pipe(rename({ basename: 'preview_fontclass' }))
          .pipe(gulp.dest('src/static/fonts/'))

        gulp
          .src(`templates/${template}-symbol.html`)
          .pipe(consolidate('lodash', options))
          .pipe(rename({ basename: 'preview_symbol' }))
          .pipe(gulp.dest('src/static/fonts/'))

        this.on('end', () => {
          setTimeout(buildBase64font.bind(this, options), 50)
        })
      })
      .pipe(gulp.dest('src/static/fonts/fonts/')),
  ),
)

function buildBase64font(options) {
  gulp
    .src('src/static/fonts/fonts/*.woff')
    .pipe(pipeFontBase64Data(options))
    .pipe(rename({ basename: `${fontName}-base64` }))
    .pipe(gulp.dest('src/static/fonts/styles/'))
}

function pipeFontBase64Data(data) {
  return through.obj(function (file, enc, callback) {
    if (file.isNull()) {
      this.push(file)
      return callback()
    }

    if (file.isBuffer()) {
      const base64 = file.contents.toString('base64')
      const fontfaceBuffer = fs.readFileSync(`templates/${template}-fontface64.css`)
      const cssBuffer = fs.readFileSync(`templates/${template}.css`)
      const contents = Buffer.concat(
        [fontfaceBuffer, cssBuffer],
        fontfaceBuffer.length + cssBuffer.length,
      )
      const compiled = _.template(contents.toString())(Object.assign({ base64: base64 }, data))
      file.contents = Buffer.from(compiled)
      file.path = replaceExt(file.path, '.css')
      return callback(null, file)
    } else {
      return callback()
    }
  })
}

function pipeSvgSpriteData() {
  return through.obj(function (file, enc, callback) {
    if (file.isNull()) {
      this.push(file)
      return callback()
    }

    if (file.isBuffer()) {
      const svgSprite = file.contents.toString().replace(/<defs>[\s\S]+<\/defs>/, '')
      const tmpJs = fs.readFileSync(`templates/${template}.js`).toString()
      file.contents = Buffer.from(tmpJs.replace('${svgSprite}', svgSprite))
      file.path = replaceExt(file.path, '.js')
      return callback(null, file)
    } else {
      return callback()
    }
  })
}

gulp.task(
  'start:iconfont',
  gulp.series('build:iconfont', () => {
    bs.init({
      files: 'src/static/fonts/*.html',
      server: 'src/static/fonts/',
      startPath: '/preview_fontclass.html',
      middleware: cacheControl,
    })
    gulp.watch([svgs, templates], gulp.series('build:iconfont'))
  }),
)

function mapGlyphs(glyph) {
  return { name: glyph.name, codepoint: glyph.unicode[0].charCodeAt(0) }
}

function cacheControl(req, res, next) {
  res.setHeader('Cache-control', 'no-store')
  next()
}
