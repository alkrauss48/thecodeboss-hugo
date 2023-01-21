---
title: Optimizing Your Web Page for Speed
date: "2016-10-06"
categories:
- Blog
tags:
- Front End
draft: "false"
---
We’ve all had it happen – that web page that you navigate to, and you can’t hardly interact with the page for a full 10 seconds because images are still loading, or you can’t scroll down because Javascript is still executing, etc. These are what we call _unoptimized_ web sites, and they’re a scourge among the internet. The good news is that it’s relatively simple to optimize your web page and allow it to load practically instantaneously – or at the very least, not hamper the interaction for your users while you’re waiting for larger files to fully download. Keep following along – I’m about to show you how to do it.

* * *

**Note:** This post covers shrinking your web page’s overall payload so that it loads quicker, and nothing related to Search Engine Optimization. If you’re looking for [SEO](https://en.wikipedia.org/wiki/Search_engine_optimization) – the internet has a plethora of other posts about this topic.

Optimizing Images
-----------------

Shrinking the payload of your images is the biggest way that you can help to optimize your web site. Let’s say that you snap a photo with your mobile phone and you want to put it online. That image from your phone easily sits at about 4MB initially – and there’s no way you can put that on your website (especially if it just needs to be a thumbnail!). You might be thinking “but that’s what I do with Facebook and Instagram!” – but they have image optimization built into their services that fires when you upload the image, because they don’t want to house those large images either.

![th-tulsaf35-1](https://personal-k8s-main-space.nyc3.cdn.digitaloceanspaces.com/thecodeboss.dev/entries/optimizing-your-web-page-for-speed/th-tulsaf35-1.jpeg)

This image was a 2 MB screenshot at first – now it’s just 20 KB!

Another thing you might be thinking is that you don’t want to degrade the quality of your images by shrinking their size – and truth be told, that’s just not a real concern. It’s true that when you shrink your image sizes, you _will_ lower the quality of your images, but if you’re uploading a 3000 x 4000 pixel image to your website and your site naturally shrinks it down to 300 x 400 pixels anyway – then you’re losing quality already without saving yourself any of that payload size.

To optimize your images, there are 3 things you can do:

*   Crop your image to a size that you actually plan to show it at on your site
*   Re-save the image at about 60 – 70% quality (you won’t notice the difference) using a tool like Photoshop or Gimp
*   Use a non-lossy image optimization tool such as [ImageOptim](https://imageoptim.com/)

By following these 3 procedures, you can easily bring a **4MB** image down to under **150KB** – or even far less if the image is smaller on your site!

Minimize & Concatenate your CSS & JS
------------------------------------

If you’re unfamiliar with these concepts, _minimizing_ means running your CSS and JS through a tool which goes through your code and moves it all to just one line, removes extra white space, shortens variable names, and a slew of other optimization techniques to shrink your file size. Minimizing your files can easily cut their payload in half – and it doesn’t affect how your users interact with your site at all.

You only want to minimize your production files – because developing minimized files is near impossible. To help with this, I encourage you to look into a build automation tool such as [Gulp](http://gulpjs.com/) or [Grunt](http://gruntjs.com/) to make your life easier. For JS, you can use [gulp-uglify](https://www.npmjs.com/package/gulp-uglify), and for CSS there’s [gulp-minify-css](https://www.npmjs.com/package/gulp-minify-css) (similar libraries available for Grunt and other build automation systems). Going further for CSS, there’s also [gulp-uncss](https://www.npmjs.com/package/gulp-uncss) which will strip out any CSS you have from your production files that’s not actually used in your web site. It doesn’t get much better than that!

On top of minification, you should concatenate your CSS and JS files so that your users’ browsers only need to download the minimum number of files for your site. Using Sass makes CSS concatenation nice and simple because you can include all your other Sass files into one main file via the [@import](http://sass-lang.com/guide#topic-5) command, but native JS concatenation is a little more difficult. The new ES6 spec supports Javascript modules so that you can include all of your JS files into a main file, just like we talked about with Sass, but [ES6](http://www.ecma-international.org/ecma-262/6.0/) doesn’t have near enough browser support yet. You can make this better with [Babel](https://babeljs.io/), or if you want to stick with pure ES5, you can use [Browserify](http://browserify.org/) which allows you to write CommonJS-style modules.

Still – none of this accounts for external libraries you include such as jQuery or Lodash, which are normally just loaded into the global scope of a web page. To get the most code-supportive practice of concatenating JS files (and CSS files, if you’re not using Sass), you should use a build automation plugin such as [gulp-concat](https://github.com/contra/gulp-concat) where you specify exactly which files you want to concatenate, and it just appends the code one after another into a new file.

Easy peasy.

Limit Web Fonts
---------------

Just like images, CSS, and JS, fonts are also a resource that count towards your page’s overall size – and if you overload your site on fonts, then you might have a problem. Services like [Google Fonts](https://www.google.com/fonts) and [Adobe Typekit](https://typekit.com/) have become pretty traditional ways of adding fonts to your website – and each of them allows you to select certain versions of fonts to use, such as bold, italic, semibold, bolditalic, light, etc. Each version of a font has to be downloaded by the browser, and the vast majority of times you don’t need every version of a font. I strongly, _strongly_ encourage you to select exactly which font forms you need instead of selecting them all. Being choosey with your fonts could mean the difference between adding 50KB and 500KB of extra weight to your page from fonts.

Use Caching
-----------

Last but not least, make sure you establish a cache policy for your website. This can be handled a number of different ways depending on whether you use nginx or apache, and if you’re serving up a dynamic site, then there’s a good chance your CMS or language framework supports forms of both client-side and server-side caching (such as [WP Super Cache](https://wordpress.org/plugins/wp-super-cache/) for WordPress).

This topic can get pretty extensive, and if you want to dig deeper into how caching actually works and how to start establishing a stable cache policy, I encourage you to check out my post over [How Browser Caching Works](/2016/05/how-browser-caching-works/).

Final Thoughts
--------------

Building an optimized web page these days is incredibly important – especially with mobile phone browsing becoming much more prevalent; after all, you can imagine how annoying it must be for your users to sit and watch while your web page loads – especially if you know you can make it better. There are some users (especially in non-first-world countries) which have a very low monthly data cap too, and if your web site alone takes up 10% of that whole data cap – then that’s just a big no-no.

If it’s your first time really thinking about page optimization, then don’t rush things. Go through this post slowly and build a development process for yourself that you can use for all future projects you work on. After you build one or two sites following these practices, it becomes second nature to optimize everything on your site as you build it – and you may even find ways to optimize your site that we didn’t discuss here (such as uploading videos on YouTube and embedding them on your site, instead of playing them directly through your website).

Thanks for reading, and I hope this post helped to open the doors for you on how you can start optimizing your web pages!
