---
title: What Does It Really Mean to Support IE8?
date: "2015-10-30"
categories:
- Blog
tags:
- Front End
draft: "false"
---
**Note**: This post is geared towards developers who have heard about IE8 being a frustrating browser to support, but are unfamiliar with the ins and outs of it enough to know exactly why. You don't even need to be a web developer to follow along - so let's get to it!

As developers, we’re all familiar with the browser called Internet Explorer (referred to as IE from here on out) and that it’s usually referred to in a negative context. Typical web developers scoff if they see anyone using IE when they have the option to use Chrome or Firefox – but truth be told, the more recent versions of IE (meaning 9+) really aren’t all terrible. Sure, they lack a lot of common browser functionality that should be core to all browsers – but with modern web development in mind, supporting IE 9+ isn’t all that tough.  It’s IE8 and all of the preceding versions that typically fuel our frustrations – but why is that? What’s so different about IE8 that even the phrase “IE8 support” is something that most developers hate? You don’t hear about “IE9 support” being bad nearly as much.

Well, there’s a lot of reasons – mostly related to how IE8 handles and renders HTML, CSS, and Javascript. But before we get into all that, we need to talk about why IE8 support is still a thing worth talking about.

Why is IE8 Still Around?
------------------------

We’ve had 3 major IE versions after IE8, and we even have the new Microsoft [Edge](https://www.microsoft.com/en-us/windows/microsoft-edge) browser available on Windows 10 – so why on earth, you might ask, do we _still_ talk about IE8, let alone support it? Well, not everyone does support it, and general support for IE8 among developers has been falling (which is great for developer sanity). But the reason that supporting IE8 is still slightly common is because some people – typically in their work environment – are forced to use Internet Explorer as their browser. Usually these are government jobs or corporate jobs within large companies where you have a strong bureaucratic culture and managing employee access is crucial. Forcing employees to use IE for security reasons isn’t bad, but some of these work environments also still haven’t upgraded from Windows XP – despite the fact that support for this OS ended over a year ago in April 2014. IE8 is the final version of IE that can run on Windows XP, and this the sole reason that IE8 support has been a thing worth talking about for the past several years.

The number of people working in these environments is shrinking, which is good, but they’re still there. You also have people with personal computers who aren’t very tech-savvy or don’t have much money and may still use Windows XP as well. They still use the internet, and very likely use IE8. Until this number gets to be practically zero, IE8 support will always be a topic that comes up from time to time.

What Makes IE8 Support so Miserable?
------------------------------------

I’m glad you asked. Browsers are just applications that send HTTP requests to various locations and render the returning HTML, CSS, and Javascript into a graphical format. However, IE8 provides **virtually** **zero support** for the newest features in the most recent versions of these 3 technologies – which is what makes it difficult to support. I’m gonna break this analysis down into each language:

HTML
----

IE8 provides practically no support for HTML5, which is the most recent version of HTML and has been around since about 2010. Some of the new elements that HTML5 includes that IE8 doesn’t support are **section, article, nav, header, footer, aside,** and **canvas**.

Honestly, this is the easiest issue to get around. All of the above mentioned elements (and many more) besides canvas are called [semantic elements](http://www.w3schools.com/html/html5_semantic_elements.asp), and thus don’t function much differently from just a **div**. By default, all browsers handle unknown elements as inline-elements, so to make them act like they should – which is block-elements – you just add a simple CSS style:


{{< highlight css "linenos=table" >}}
// app.css

header, section, footer, aside, nav, main, article, figure {
    display: block;
}
{{< / highlight >}}

You can check out more tricks like this for browser support [here](http://www.w3schools.com/html/html5_browsers.asp), and you may also want to look into the [Modernizr.js](https://modernizr.com/) library, which provides feature-detection and can make supporting older browsers like IE8 easier. To get support for canvas, which is more difficult, you’ll have to rely on some javascript libraries to polyfill the canvas logic for you. [ExplorerCanvas](https://github.com/arv/explorercanvas) is a good option here – but my personal take is to just fall back to an image or something simple like that.

IE8 also doesn’t support the SVG element – which can be a big problem if your site uses popular graphical libraries like [D3.js](http://d3js.org/). Like with most things, there are [tricks like these](https://css-tricks.com/svg-fallbacks/) you can employ as fallbacks – but if your site is using SVG heavily, then IE8 support probably would be too much of a hassle to be worth the extra development.

CSS
---

The most recent major version of CSS is CSS3 and it’s supported by all major browsers; however, IE8 limits full CSS support to version 2.1, and provides little support for CSS3. We’re gonna be getting into more of the headache-causing issues now, but we’ll start off with some of the easier issues to solve and end with the ones that really throw developers for a loop.

**No media queries.** This one isn’t bad because usually you use media queries for responsive design. But if you’re building for mobile devices first, and thus use media queries to target larger screens, this might get you. To fix this, you can check out [css3-mediaqueries.js](https://code.google.com/p/css3-mediaqueries-js/) which adds media query support to IE5+.

**No keyframes.** It sucks, but I think we can all live without this one. They’re usually just flashy anyway.

**No transform or transition support.** You won’t be able to do any fancy hover effect transitions or rotate, scale, and translate any elements. Normally this is fine, but I’ve had times where an element that I can’t rotate really looks terrible. jQuery provides some support with transitions, such as the [slide](https://api.jquery.com/category/effects/sliding/) or [fade](https://api.jquery.com/category/effects/fading/) APIs, so you have a little bit of support there. You can also forget all about using advanced styles like 3D transforms.

**Difficult to do translucent backgrounds.** The rgba or hsla color methods you may be used to won’t work in IE8. If you need translucent backgrounds, then you’ll have to resort to the IE-specific styles using [filter](https://msdn.microsoft.com/en-us/library/ms530752(v=vs.85).aspx). It can be a pain because it’s pretty different, but I built a [gist](https://gist.github.com/alkrauss48/bd68de92846b4f18ae82) about this particular issue which you might find useful.

**No nth-of-type or nth-child selectors.** There are more than just these missing from IE8, and this can be a true pain. A common way to build out grids is to make sure the blocks in your last column have no margin on the right side. It’s very easy to do that using an nth-of-type, but in IE8 that won’t work. You can fall back to a javascript library like [Selectivizr](http://selectivizr.com/) if you need this feature.

**The major CSS frameworks don’t support IE8.** This includes the most recent versions of frameworks like [Bootstrap](http://getbootstrap.com/) and [Foundation](http://foundation.zurb.com/). You can always try to use other CSS and JS libraries out there to add in support for the features that IE8 is missing, but that gets into very tedious work. If you use Bootstrap3 or Foundation5, then you’re better off just kicking IE8 support to the curb than to deal with all of the arising problems.

**Various strange things can happen.** This is just a bucket category to say that a lot of strange things may happen in IE8 that just don’t happen in other browsers. Maybe one of your elements just doesn’t show up because it’s positioned incorrectly, or has a height of 0, or maybe your [clearfix](http://stackoverflow.com/questions/8554043/what-is-clearfix) isn’t working properly (and for IE8, I recommend [Nicolas Gallagher’s](http://nicolasgallagher.com/micro-clearfix-hack/) clearfix styles – shown below). For these types of things, you’ll just have to fix them one by one. Who knows, maybe you’ll get lucky and everything will look right in IE8!


{{< highlight css "linenos=table" >}}
// clearfix.css

/**
 * For modern browsers
 * 1. The space content is one way to avoid an Opera bug when the
 *    contenteditable attribute is included anywhere else in the document.
 *    Otherwise it causes space to appear at the top and bottom of elements
 *    that are clearfixed.
 * 2. The use of `table` rather than `block` is only necessary if using
 *    `:before` to contain the top-margins of child elements.
 */
.cf:before,
.cf:after {
    content: " "; /* 1 */
    display: table; /* 2 */
}

.cf:after {
    clear: both;
}

/**
 * For IE 6/7 only
 * Include this rule to trigger hasLayout and contain floats.
 */
.cf {
    *zoom: 1;
}
{{< / highlight >}}

Javascript
----------

I saved the toughest section for last. Most of the difficult issues you’ll face in supporting IE8 will be Javascript-related, and there’s one prominent reason for that.

**IE8 doesn’t support most of ES5.** I went ahead and started out with the toughest problem first. ES5 is at the moment the most common iteration of ECMAScript available, and has been for a while now. Because IE8 doesn’t support most of ES5, you lose a lot of functionality that modern Javascript employs. If you write most of your Javascript yourself, then this might not be as big of a deal because you can just verify that all of your code isn’t using ES5 – but who wants to do that? No one – which is why some smart guys built [es5-shim](https://github.com/es-shims/es5-shim), a library which adds support for many ES5 API updates. This should take care of a lot of problems, but there’s a good chance you’ll still run into some support issues.

**Many JS libraries don’t work on IE8.** This is largely because of the ES5-non-support issue (es5-shim will help with this). jQuery v1 still supports IE8, which is a huge benefit, so you’re safe there (and it’s still being updated for the time being). But many other libraries don’t – especially the smaller, not-as-popular libraries. Let’s face it, if you want a really cool front-end to your site, you’re going to use a lot of Javascript to do that and a lot of it’s going to be coming from third-party libraries. That’s completely fine, but just be aware that they might not (and probably don’t) support IE8. If they do, then they’ll explicitly mention it. Each new library you add means another potential point of failure when supporting IE8.

**No WebGL support.** [WebGL](https://en.wikipedia.org/wiki/WebGL) is a Javascript API that allows modern browsers to implement 3D viewing easier. It’s smooth and leverages the power of your graphics card – but IE8 doesn’t support it (in fact, even IE11 only has partial support for it). If your site heavily uses 3D, then chances are that you’ve already given up on the thought of supporting IE8, but if not, then you’ll definitely need a fallback here such as displaying a simple image instead of a 3D element.

**The major [single-page app](https://en.wikipedia.org/wiki/Single-page_application) frameworks don’t support IE8.** Angular, Ember, Backbone, and React – none of the most recent versions of any of these support IE8 out of the box. Just as with other libraries, you may have to hack support in through es5-shim and other libraries, but because these are _frameworks_ and not just simple libraries, you’re really playing with fire there. If you use any of these technologies – it’s best to not worry about IE8. Older versions of Angular do support IE8, but who wants to use a deprecated version of anything?

* * *

Conclusion
----------

After reading all of this – you probably never want to support IE8. And many developers are with you, but the fact of the matter is that even though Microsoft has dropped XP support for over a year now, IE8 is still a browser that many people use and thus modern websites still need to work on them. Maybe not your personal site, but larger sites like Amazon, Wal-Mart, various banks, etc. absolutely need IE8 support, and I hope I’ve given you a little bit of insight into the struggles of what it means to provide that support.

There is a silver lining however; by saying you understand how to provide IE8 support, that’s like an extra merit badge on your developer resume. Everybody likes an additional +1 on their skill list!
