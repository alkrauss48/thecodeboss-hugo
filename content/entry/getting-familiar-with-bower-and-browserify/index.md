---
title: Getting Familiar with Bower and Browserify
date: "2014-08-15"
categories:
- Blog
tags:
- Javascript
- Front End
draft: "false"
---
**Note:** This post has been updated as of October 23, 2015.

Lately I’ve been getting into build automation quite a bit and trying to maximize my workflow productivity without having to worry about the not-fun things like ensuring that I’m including all my files, concatenating scripts together, and manually running build tasks. I’ve been using [grunt](http://gruntjs.com/ "Grunt") for a while now, which has been key for speeding up my workflow when I’m working with new web projects, but I knew there was more out there to explore. I had heard **bower** and **browserify** thrown around on Twitter and at local dev meetings, and I knew that my fellow developers were making use of these tools, so I decided to check them out. Man … I’m glad I did, because these are tools that every full-stack developer should know about.

While bower and browserify aren’t necessarily related, I use them together quite a bit because they’re both geared specifically towards client-side development, and it’s this bond which makes them such a powerful combo. Let’s start off with a bio of what they both are:

Bower
-----

[Bower](http://bower.io/ "Bower") is a front-end package manager, and works similar to NPM or RubyGems. You can either install packages one-by-one with a simple

{{< highlight bash "linenos=table" >}}
bower install <package>
{{< / highlight >}}

Or you can create a bower.json file in which you specify lists of packages and their versions that you want to fetch.  It gathers and installs packages from all over, taking care of hunting, finding, downloading, and saving the stuff you?re looking for. No longer do you need to manually download front-end packages from the source site or GitHub – now you just tell bower to do it. Install it with NPM:

{{< highlight bash "linenos=table" >}}
npm install -g bower
{{< / highlight >}}

Similar to NPM, bower will install all packages inside of a **bower_components** directory at the root of where you run the install command. Here’s what a sample bower.json would look like:

{{< highlight json "linenos=table" >}}
{
  "name": "Package Name",
  "version": "0.0.1",
  "dependencies": {
    "jquery": "latest",
    "modernizr": "latest",
    "normalize-scss": "latest"
  }
}
{{< / highlight >}}

And would be installed with a simple

{{< highlight bash "linenos=table" >}}
bower install
{{< / highlight >}}

This will fetch the specificed version of jQuery, Modernizr, and Normalize-SCSS. Notice how there’s both javascript and sass in there? Bower isn’t language specific, so you can get javascript, css, sass, less, and much more. The files that bower retrieves are meant to be physically included into your project, so the bower_components directory is very clean and well structured.

So what makes bower any better than the other common package managers like NPM and RubyGems? Well, none of them are necessarily _better_ than the other – they all handle specific types of packages. All three of these package managers allow you to list out your dependencies and versions, and will ensure that the full dependency tree is met. However, NPM and RubyGems are more geared towards server-side development and also allow the installation of global executable commands. Bower is much simpler in that it is only meant to find the front-end packages that you need, and dish them out for you.

Now that we’ve discussed how to gather our client-side packages in a clean, agile, and no-hassle manner, let’s talk about how we can build them all together and include just one bundle into our main html. Enter browserify.

Browserify
----------

[Browserify](http://browserify.org/ "Browserify") is a tool which, just like bower, gives your client-side workflow a serious improvement; this tool, however, is javascript specific. Browserify seems to be steeped in a lot of mystery and confusion, and a lot of developers stray away from it without really understanding the benefits. Browserify is honestly really simple; it only does two things for you:

*   It allows you to use node-style require() calls in your client-side javascript
*   It gives you a CLI to bundle those files together and compile them down into javascript that the browser can understand

That’s it! With browserify, you can write modular code the ‘node way’ while at the same time writing purely front-end code. Here’s how to install it:

{{< highlight bash "linenos=table" >}}
npm install -g browserify
{{< / highlight >}}

And here’s an example file that we’ll eventually compile with browserify:

{{< highlight javascript "linenos=table" >}}
// Javascript

var $ = require('jquery');

// External Libs</pre>
require('./bower_components/lib1/lib1.js');
require('./bower_components/lib2/lib2.js');

$(document).ready(function(){
  $('body').append('<p>This Works</p>');
});
{{< / highlight >}}

This file includes jQuery (required in a way that assumes it’s installed as a node package), as well as two external libs that I’m using. By setting jQuery to a variable, I am able to use the standard **$** operator and have it only be accessible within the scope of this file. Because the other two files aren’t set to variables, they are loaded just within the general scope of the file, as if they had already been included in that page’s html.

By having these external files installed with bower, I can access their source files directly with the help of browserify. This is similar to using the @import function in sass, but because browserify accounts for modularity, these files will only be accessible in the scope that you require them.

Last but not least, let’s build this puppy:

{{< highlight bash "linenos=table" >}}
browserify main.js -o bundle.js
{{< / highlight >}}

This will run through our main.js file, gather all of the required files, and build it all into a file called bundle.js. This would be the file that you include in your html, and it will be written in browser-compatible javascript. That’s how you do node – the browser way.

* * *

So at this point, we’ve established a good footing on bower and browserify, both of which are tools geared towards making your front-end workflow as efficient and clean as possible. We also discussed how you can install vendor packages with bower and then include them directly into your javascript using browserify, allowing you to write modular front-end code. Now this is a big improvement over manually finding and downloading vendor packages from the internet and muddying up your html by including multiple libraries (not to mention ignoring the concept of scope altogether), but we can still improve on this workflow. After all, we’re having to manually run the browserify command every time we want to rebundle our files – and we don’t enjoy manual labor like that.

So what can we do? Well, I mentioned I’ve been getting into build automation lately, so I bet we can standardize this workflow and give instructions to a tool like grunt to do all the work for us. We covered our basics here, so next time we can get into maximizing our javascript building by incorporating a task runner (as well as a few other tricks I’ll show you).

Feel free to check out the next post in this series – [Building Javascript with Grunt, Bower, Browserify](/2014/08/building-javascript-with-grunt-bower-browserify/).
