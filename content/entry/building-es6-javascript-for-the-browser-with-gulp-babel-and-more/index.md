---
title: Building ES6 Javascript for the Browser with Gulp, Babel, and More
date: "2016-01-22"
categories:
- Blog
tags:
- Javascript
draft: "false"
---
ECMAScript 6 is the most recent update to Javascript, and with it has come a lot of new features to the language – some that the community has been begging for, and also some that are pretty controversial. But regardless of how you feel about ES6, you probably want to be using the most recent version of Javascript – because that’s just who you are. This works out pretty well if you’re working with node.js or another server-side framework since you can control your Javascript version on the server – but using ES6 is pretty difficult if you’re writing client-side Javascript, which includes anything from a complex angular or ember app all the way down to a simple static page with a few lines of jQuery.

But why is ES6 difficult to write in the browser? It’s because with client-side Javascript, you’re completely dependent on how well the browser you’re using can compile and execute that Javascript. Instead of you being in control, your browser is in control – and there are a lot of browsers out there in the wild that don’t support ES6. Even once the modern browsers finally do support ES6, we still have to account for the people who use older browsers. Basically, it will be a **long** time before we can safely write ES6 code directly for our browsers to execute.

So does that mean we’re out of luck? Are we destined to just accept that we’ll always have to use dated versions of Javascript for the browser? No, we don’t have to accept that! We have options – and the best option right now is write ES6 code and then **transpile** (or compile) it down into ES5 code – which all modern browsers (IE9+) can handle. Babel will be our main transpiling tool, and to make it easier we’re gonna automate this process so we don’t even have to think about it!

tl;dr
-----

In case you just want a short description and the raw code that we’re going to go through in this post, here it is:

We’ll be building a **gulpfile** to watch for changes and automatically convert our ES6 code into [CommonJS](https://webpack.github.io/docs/commonjs.html) by using **Babel**, and then convert that CommonJS into valid ES5 by using **Browserify**. Then, we’ll be adding on some extra nice-to-haves such as **UglifyJS** (for minification), **source maps**, and **livereload** – because those tools are super helpful.

Without further ado, here’s the full gulpfile we’re about to build:


{{< highlight javascript "linenos=table" >}}
// gulpfile.js

var gulp        = require('gulp');

var browserify  = require('browserify');
var babelify    = require('babelify');
var source      = require('vinyl-source-stream');
var buffer      = require('vinyl-buffer');
var uglify      = require('gulp-uglify');
var sourcemaps  = require('gulp-sourcemaps');
var livereload  = require('gulp-livereload');


gulp.task('build', function () {
    // app.js is your main JS file with all your module inclusions
    return browserify({entries: './src/js/app.js', debug: true})
        .transform("babelify", { presets: ["es2015"] })
        .bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./dist/js'))
        .pipe(livereload());
});

gulp.task('watch', ['build'], function () {
    livereload.listen();
    gulp.watch('./src/js/*.js', ['build']);
});

gulp.task('default', ['watch']);
{{< / highlight >}}

See – that’s not so bad! We’re doing a lot of different things here too, so if you’re interested in learning about them then I encourage you to continue reading to see how and why this is a solid way to build your ES6 code for the browser.

Starting Our Gulpfile
---------------------

We’ll be using [gulp](http://gulpjs.com/) for our build automation. If you’re unfamiliar, gulp is a Javascript-based tool which will run tasks for you and watch for changes in files – all based on a config file called **gulpfile.js** in your local project directory. There are other build automation tools out there (with [grunt](http://gruntjs.com/) being the popular counter-tool), but gulp is definitely the fastest with its use of node streams.

To start off, let’s initialize our package.json and install gulp locally (install it globally too, if you haven’t already):

{{< highlight shell "linenos=table" >}}
npm init # Answer all the questions
npm install --save-dev gulp
{{< / highlight >}}

Then create a blank gulpfile.js with the following skeleton:

{{< highlight javascript "linenos=table" >}}
// gulpfile.js

var gulp = require('gulp');

gulp.task('build', function () {

});

gulp.task('watch', ['build'], function () {
    gulp.watch('./src/js/*.js', ['build']);
});

gulp.task('default', ['build', 'watch']);
{{< / highlight >}}

Nothing too crazy going on yet. We’re creating a blank **build** task, a **watch** task, and a **default** task. The build task is where we’ll be adding all of our logic to build our Javascript. The watch task is actually done – all it does is watch for changes in the **src/js** folder (the build files will eventually get placed in **dist/js**).

To run any of these tasks:

{{< highlight shell "linenos=table" >}}
gulp build   # Build
gulp watch   # Watch
gulp         # Default
{{< / highlight >}}

So far, so good, right? Let’s add the actual ES6-to-ES5 build process now.

Implementing Babel and Browserify
---------------------------------

As discussed briefly in the tl;dr above, we’re going to use a combination of [babel](https://babeljs.io/) and [browserify](http://browserify.org/) to build our ES6 code into ES5 code that the browser can understand. Babel will convert ES6 into CommonJS, which is a commonly used module pattern in modern day Javascript (especially with node.js) – but the browser _still_ can’t understand CommonJS. So, we need to use browserify – which specifically converts CommonJS into valid ES5. With these two tools, we’ll be good to go.

We won’t be using babel directly however; instead, we’ll be using a library called babelify which is built as a _transform_ for browserify – meaning it will preprocess Javascript before browserify compiles it. Let’s install some of these packages:

{{< highlight shell "linenos=table" >}}
npm install --save-dev babelify babel-preset-es2015 browserify vinyl-source-stream
{{< / highlight >}}

Now, we can update our gulpfile with these new tools in order to build our ES6:

{{< highlight javascript "linenos=table" >}}
// gulpfile.js

var gulp        = require('gulp');
var browserify  = require('browserify');
var babelify    = require('babelify');
var source      = require('vinyl-source-stream');

gulp.task('build', function () {
    return browserify({entries: './src/js/app.js', debug: true})
        .transform("babelify", { presets: ["es2015"] })
        .bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('watch', ['build'], function () {
    gulp.watch('./src/js/*.js', ['build']);
});

gulp.task('default', ['build', 'watch']);
{{< / highlight >}}

And this is all we need to build our Javascript. We simply tell browserify the files we want to change (**src/js/app.js** in this case), and before our code gets browserified, it gets transpiled using babel according to the _es2015_ presets. Since v6.0.0, babel requires you to specify presets according to how you want to transpile your Javascript. While this probably seems like a hassle, it’s meant to give you as the developer more control over the whole process. We want to use the standard es2015 build process, which is why we had to install the NPM package _babel-preset-es2015_.

After the files are browserified, we bundle them together into a single file (in this case, it already was a single file). You’re probably also wondering what vinyl-source-stream is. See, gulp works with node streams, and more specifically, it works with _vinyl streams_, which is a virtual file format. Browserify returns a readable stream, but not a vinyl stream, so we have to convert the stream using vinyl-source-stream in order to continue with our gulp logic. It’s an extra plugin, but it’s tiny and only has one job.

We can now officially build ES6 code into valid ES5 code, in under 20 lines of a gulpfile. But let’s be serious here – if you’re writing production Javascript, you’re going to want to do some more with your code before it’s ready to ship. Enter uglify, source maps, and livereload.

Adding on Uglify, Source Maps, and LiveReload
---------------------------------------------

Building our ES6 into valid ES5 is one thing, but we also want to make sure our code is minified and source mapped before it goes out into production. To add in all these features, we’re going to update our gulpfile with the following tools:

*   [UglifyJS](https://github.com/terinjokes/gulp-uglify): to minify our Javascript and make it as small in size as possible.
*   [Source Maps](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/): these will help with debugging our minified scripts. Source maps are references in your minified files that link code in those files to where it exists in non-minified build files. This makes debugging production code **way** easier. On top of that, the source-mapped files only get downloaded if you have your dev console open – so normal users will never download them.
*   [LiveReload](http://livereload.com/): This tool is specifically helpful in development, and it will auto-reload your browser when changes occur in the files you’re listening on. A popular alternative to LiveReload is [BrowserSync](http://www.browsersync.io/).

Let’s start off with adding in UglifyJS. We need to install a couple more packages:

{{< highlight shell "linenos=table" >}}
npm install --save-dev vinyl-buffer gulp-uglify
{{< / highlight >}}

And now we’ll edit our gulpfile like so:


{{< highlight javascript "linenos=table" >}}
// gulpfile.js

var gulp        = require('gulp');
var browserify  = require('browserify');
var babelify    = require('babelify');
var source      = require('vinyl-source-stream');
var buffer      = require('vinyl-buffer');
var uglify      = require('gulp-uglify');

gulp.task('build', function () {
    return browserify({entries: './src/js/app.js', debug: true})
        .transform("babelify", { presets: ["es2015"] })
        .bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('watch', ['build'], function () {
    gulp.watch('./src/js/*.js', ['build']);
});

gulp.task('default', ['build', 'watch']);
{{< / highlight >}}

We added in both gulp-uglify and vinyl-buffer. gulp-uglify is the gulp plugin which will minify our Javascript, but what’s vinyl-buffer? We need vinyl-buffer because gulp-uglify doesn’t support streams right now – but it supports buffers. vinyl-buffer just converts a stream into a buffer so that gulp-uglify can work its magic.

We’re on the home stretch now – let’s add source maps and livereload. As usual, let’s install some packages:

{{< highlight shell "linenos=table" >}}
npm install --save-dev gulp-sourcemaps gulp-livereload
{{< / highlight >}}

And now, for the last time, let’s update our gulpfile with these new tools:

gulpfile.js

{{< highlight javascript "linenos=table" >}}
// gulpfile.js

var gulp        = require('gulp');
var browserify  = require('browserify');
var babelify    = require('babelify');
var source      = require('vinyl-source-stream');
var buffer      = require('vinyl-buffer');
var uglify      = require('gulp-uglify');
var sourcemaps  = require('gulp-sourcemaps');
var livereload  = require('gulp-livereload');

gulp.task('build', function () {
    return browserify({entries: './src/js/app.js', debug: true})
        .transform("babelify", { presets: ["es2015"] })
        .bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./dist/js'));
        .pipe(livereload());
});

gulp.task('watch', ['build'], function () {
    livereload.listen();
    gulp.watch('./src/js/*.js', ['build']);
});

gulp.task('default', ['build', 'watch']);
{{< / highlight >}}

Starting off with the source maps plugin, we initialize our source maps _before_ we minify our Javascript. That’s how we know what to link to after our files get minified. Then, after minification, we’re saving out our source maps as individual files in the **maps/** directory. Now, whenever you want to reference a line of code in your minified JS, the source maps will instead direct you to a line in the unminified files which will be much easier to read.

Finally, we’re instructing our **livereload** process to listen for when we make changes, and to reload the browser after each Javascript build iteration. The easiest way to make the most of livereload would be to tie it with its corresponding browser plugin – with [Chrome’s plugin](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=en) being my favorite.

And that’s it! We’re officially done with our gulpfile.

Final Thoughts
--------------

If you’ve followed all these steps (or just copied the full gulpfile at the beginning of the post), then you now have a fully-working automated build system that will transpile your ES6 code into ES5 code that all modern browsers can understand – with some niceties added on like minimization and source maps. Now I know some of this might seem complicated, and you certainly don’t have to go through any of it if you just want to keep writing normal ES5 in the browser, but even just understanding what all is going on here will make you a better developer because you’re now more familiar with some of the neat front-end build tools out there.

Still, I highly encourage you to check out the [ES6 docs](https://github.com/lukehoban/es6features) and see how some of the new features might benefit your workflow. For me personally, I have a big beef with the new [class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) API (because Javascript is prototype-based, not class-based – you can read all about that in [my post](/2015/08/prototypal-programming-in-javascript/)), but I’m extremely happy that they’ve added a module pattern system, and I plan to use that heavily. However you feel though, you should stay up to date with the most recent iteration of the language – and babel and gulp are here to help make it easier for you!
