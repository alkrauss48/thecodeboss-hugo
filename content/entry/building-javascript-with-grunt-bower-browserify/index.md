---
title: Building Javascript with Grunt, Bower, Browserify
date: "2014-08-28"
categories:
- Blog
tags:
- Javascript
- Front End
draft: "false"
---
**Note:** This post has been updated as of October 23, 2015.

This post is continuation of a previous post covering bower and browserify; if you haven’t read it yet, I highly recommend you start off by reading [Getting Familiar with Bower and Browserify](/2014/08/getting-familiar-with-bower-and-browserify/ "Getting Familiar with Bower and Browserify") before starting here. Let’s review our goals regarding javascript building that we landed upon at the end of the last post:

**Goal:** We want to automate the gathering actions of bower and javascript-building actions of browserify in our workflow to make for a seriously powerful javascript pipeline that we don’t have to continually maintain.

We’ve covered a brief intro into bower and browserify, and now we’re ready to get our hands dirty with them both by using them with grunt.

Installing Grunt
----------------

If you’re unfamiliar with what grunt.js is, or build automation in general, please check out the [grunt.js homepage](http://gruntjs.com/ "Grunt.js") for an introduction. Despite the rising popularity of Gulp (another build automation tool), I am choosing to stick with grunt as it currently still has a larger plugin community.

Assuming you already have bower and browserify installed (if you don’t, see the [last post](/2014/08/getting-familiar-with-bower-and-browserify/ "Getting Familiar with Bower and Browserify")), then all we need to install is the grunt CLI:

{{< highlight bash "linenos=table" >}}
npm install -g grunt-cli
{{< / highlight >}}

Now that we have the grunt CLI installed, we need to establish a package.json file for our project in order to install the rest of the grunt plugins we’ll use.

Installing Grunt Plugins
------------------------

Create a new package.json at the root of your project folder, or update your existing one, to include the following devDependencies:

{{< highlight json "linenos=table" >}}
{
  "name": "project name",
  "devDependencies": {
    "grunt-bower-task": "0.4.0",
    "grunt-browserify": "4.0.1",
    "browserify": "~11.2.0"
  }
}
{{< / highlight >}}

Let’s also create a bare bones bower.json file with some base libraries:

{{< highlight json "linenos=table" >}}
{
  "name": "project name",
  "dependencies": {
    "jquery": "~2.1.4",,
    modernizr": "~3.1.0"
  }
}
{{< / highlight >}}

To install node modules:

{{< highlight bash "linenos=table" >}}
npm install
{{< / highlight >}}

This will install the bower and browserify grunt tasks, as well as verifying that you have the regular browserify module installed. Let’s hold off on installing our bower components yet, we’ll let grunt take care of that.

Now that we have everything set up, we can finally start our Gruntfile. Let’s start off with the basics:

{{< highlight javascript "linenos=table" >}}
module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
  })
}
{{< / highlight >}}

Creating the Gruntfile
----------------------

We don’t have anything exciting yet – just a basic Gruntfile skeleton. Let’s start off our workflow by automating our bower component installation:

{{< highlight javascript "linenos=table" >}}
module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
    bower : {
      install : {
        options : {
          targetDir : 'vendor/bower_components',
          layout : 'byComponent',
          verbose: true,
          cleanup: true
        }
      }
    }
  })
}
{{< / highlight >}}

These settings are customizable, but I’m a fan of dumping all my vendor packages into a /vendor directory. The layout attribute states that the package will be within its own folder (as opposed to default js/css/etc. folders that bower likes to use), and the cleanup option ensures that prior to the install command being run, the directory will be wiped out.

Now we can install our bower components like so:

{{< highlight bash "linenos=table" >}}
grunt bower:install
{{< / highlight >}}

We will now have jQuery and Modernizr installed in /vendor/bower\_components. Perfect – now let’s get to using those files with the help of browserify. Let’s add this to our Gruntfile:

{{< highlight javascript "linenos=table" >}}
browserify : {
  app : {
    files : { 'build/app.js' : ['src/js/app.js'] }
  }
}
{{< / highlight >}}

This will take a javascript source file (or many) and build it out into a browserify bundle that is browser friendly. So our end goal is to create a bundle from a file like this:

{{< highlight javascript "linenos=table" >}}
require('jquery');
require('modernizr');
 
$(document).ready(function){
  // do stuff!
});
{{< / highlight >}}

But can we do this? Alas, no, not yet. We have three problems:

1.  While we have jQuery and modernizr installed through bower, browserify has no idea where they’re located, so we can’t just require them like we are – we would need to require exact script locations.
2.  With modular programming, we would need to assign jQuery to the **$** variable, and modernizr to the **Modernizr** variable before we could use them in that way.
3.  Browserify can only require [CommonJS style](http://requirejs.org/docs/commonjs.html "CommonJS") scripts … so basically modules, and while the scripts we have for jQuery and modernizr _may be_ built as modules, we can’t be sure. Plus, we still want to be able to require other vendor scripts even if they’re not modules.

So have we come this far for me to tell you we can’t do anything, and you can only use browserify for your own CommonJS style scripts? No, absolutely not! We can fix this with an awesome node module called browserify-shim.

Adding Browserify-Shim
----------------------

[Browserify-shim](https://github.com/thlorenz/browserify-shim "Browserify-Shim") is a node module which allows you to include non-CommonJS style scripts into browserify’s require command, and to also assign them to aliases that you can use in your scripts. You can check out the GitHub repo to see all the features, but we’ll just go over installation and implementation here.

Install (as a devDependency here):

{{< highlight bash "linenos=table" >}}
npm install -D browserify-shim
{{< / highlight >}}

And then add this to your package.json:

{{< highlight json "linenos=table" >}}
"browser": {
  "jquery": "./vendor/bower_components/jquery/jquery.js",
  "modernizr": "./vendor/bower_components/modernizr/modernizr.js"
},
"browserify-shim": {
  "jquery": "$",
  "modernizr": "Modernizr"
},
"browserify": {
  "transform": [ "browserify-shim" ]
}
{{< / highlight >}}

In a nutshell, browserify-shim is exposing our jQuery and modernizr packages as a different name for browserify to look for (jquery and modernizr, respectively), and then we are aliasing the modules to the variables we’re used to using: $ and Modernizr. Lastly, we tell browserify to run browserify-shim prior to building out the files, which is what allows all of this to happen.

Browserify-shim can do even more than this, but that’s all we need it for. Now will this javascript work?

{{< highlight javascript "linenos=table" >}}
require('jquery');
require('modernizr');
 
$(document).ready(function){
  // do stuff!
});
{{< / highlight >}}

Yup, 100% as long as we’re using grunt to build our javascript.

Summary
-------

I know we’ve covered a lot here, but if you can implement this workflow into your javascript pipeline, you’ll seriously boost your productivity. To review everything we’re doing here:

*   Using **bower** to simplify how we get our vendor scripts, as well as managing versions easily.
*   Using **browserify-shim** to turn all non-CommonJS scripts into browserify-compatible modules.
*   Using **browserify** to write modular javascript code, and build everything we want into a small amount of organized bundles.
*   Running everything through **grunt** to handle all the tedious work for us, so we can concentrate on the fun stuff.

While the big benefit here is that we have really improved our workflow to allow powerful services to do the work for us, another thing to consider is that now we can really true modular code. That’s a best practice in every language, and having that at our disposal allows us to write clean, beautiful javascript that is very readable and very debuggable.

You made it to the end, and now at least have some familiarity with using bower and browserify in your project. Give it a try and see how you feel about your new javascript build process. I promise you won’t be disappointed!
