---
title: What Meta Tags Your Site Should be Using
date: "2016-12-19"
categories:
- Blog
tags:
- Front End
draft: "false"
---
Whenever you’re building a new site, you probably pay more attention to the HTML that’s in the <body> tag (i.e. the actual content) than what’s in the &#60;head&#62; tag – and that’s a good thing! If your page doesn’t have rich, valuable content – then it probably shouldn’t be there, but that doesn’t mean that you should put everything else on the backburner. There are tons of valuable tags you should be placing within the &#60;head&#62; tag that can really make your site more valuable, accessible, and help showcase it on social media platforms before people even click on links to your site. In this post, we’re going to go through which tags you should absolutely be placing in the &#60;head&#62; tag of your site if you want to get the maximum exposure and shareability possible. All of these are &#60;meta&#62; tags – with the exception of one – and the majority of them are related to how links to your site will render when shared on various social media platforms. I’m gonna group these into a few different categories:

*   General
*   Open Graph (i.e. Facebook)
*   Twitter

Ready? Let’s get to it!

tl;dr
-----

Before we get into the explanations of all the meta tags, if you just want a quick example of what core meta tags I recommend every page should have (and the one’s we’ll be discussing), then here it is:

{{< highlight html "linenos=table" >}}
<head>
<!-- General -->
<meta charset="utf-8">
<title>What Meta Tags Your Site Should be Using | Aaron Krauss</title>
<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, minimal-ui">
<meta name="description" content="Whenever you're building a new site, you probably pay...">
 
<!-- Open Graph -->
<meta property="og:title" content="What Meta Tags Your Site Should be Using | Aaron Krauss">
<meta property="og:description" content="Whenever you're building a new site, you probably pay...">
<meta property="og:image" content="https://personal-k8s-main-space.nyc3.cdn.digitaloceanspaces.com/thecodeboss.dev/global/opengraph/opengraph.jpg">
<meta property="og:url" content="https://thecodeboss.dev/2016/12/what-meta-tags-your-site-should-be-using/">
<meta property="og:type" content="website">
 
<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@thecodeboss">
<meta name="twitter:creator" content="@thecodeboss">
</head>
{{< / highlight >}}

These meta tags are taken directly from this webpage. Now that we have that out of the way, I hope you’ll continue reading to see what these tags actually do and why they’re important!

General
-------

These are gonna be the tags that every site should have, regardless of how you plan to use it.

### Title

This one’s pretty easy to understand and it’s absolutely the most important tag you should place within your &#60;head&#62; tag. It’s also the only tag we’ll be talking about that’s not explicitly a <meta> tag – this one gets a tag all to itself. You probably already knew this, but the &#60;title&#62; tag sets the title of the page. This will be the title that you see in your browser tab, your bookmark menu, Google results, and practically anywhere that your site is shared. It’s a must to set this.

{{< highlight html "linenos=table" >}}
<!-- You'll see this exact tag on this very page! -->
<title>What Meta Tags Your Site Should be Using | Aaron Krauss</title>
{{< / highlight >}}

### Viewport

Next to the title, the viewport meta tag is extremely important to have in your site because without it, your site won’t render properly on smaller screen sizes such as mobile phones and tablets. The viewport meta tag gives the browser instructions on how to control the page’s dimensions and scaling. On smaller devices by default, browsers will try to scale down the entire web page width to fit on your screen just like it would on a desktop monitor; you’ve probably seen this if you’ve viewed websites that haven’t been built recently, and you have to zoom in to actually read the content. With modern [responsive](https://en.wikipedia.org/wiki/Responsive_web_design) websites, we don’t want that default behavior. We have the power to build websites that break down properly for smaller screen sizes, and in order to render these sites properly, we need the viewport tag.

Here’s an example of a basic viewport meta tag:

{{< highlight html "linenos=table" >}}
<meta name="viewport" content="width=device-width, initial-scale=1" \>
{{< / highlight >}}

This tag sets the width of the page to the device-width (i.e. your viewport width), and the initial scale attribute sets the zoom level to 1, so that you’re not viewing a zoomed-in or zoomed-out version of the page.

### **Character Set**

This meta tag sets the character set of your website. Browsers need to know which character set your site uses in order to render your content properly.  [UTF-8](https://en.wikipedia.org/wiki/UTF-8) is the default character set for all HTML5 sites – but you still should be explicit about setting it because in HTML4, the default is [ISO-8859-1](https://en.wikipedia.org/wiki/ISO/IEC_8859-1). If you’re using HTML5 (which you should be), then this tag looks like this:

{{< highlight html "linenos=table" >}}
<!-- In HTML5 -->
<meta charset="utf-8" \>
{{< / highlight >}}

But if you’re stuck using earlier versions of HTML, then you’d use the **http-equiv** property to set the character set:

{{< highlight html "linenos=table" >}}
<!-- Defining the charset in HTML4 -->
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" \>
{{< / highlight >}}

### Description

The meta description tag sets a 255-character-max block of text that accurately describes the page you’re on. This tag has been the standard for services like Google, Facebook, Slack, and many others to pull in your page’s description for others to see, which makes it very important.

{{< highlight html "linenos=table" >}}
<meta name="description" content="This is the description for a neat page" \>
{{< / highlight >}}

The limit that any service will pull from your meta description is typically 255 characters, so make sure you stay concise with it!

Open Graph
----------

You probably read “Open Graph” above in the intro and may have thought, “what the heck is that?” [Open Graph](http://ogp.me/) is a protocol that Facebook created that allows any web page links to become rich objects in a social graph. Whenever you paste a link in Facebook (along with many other services) and it automatically creates a clickable block with a title, description, and/or image from that site – it’s using these Open Graph meta tags to do that. Before I knew what was going on here, it always seemed like magic to me when this happened – but it’s all just from simple meta tags! The Open Graph protocol is abbreviated to **og** when used in HTML.

I’m gonna display a chunk of Open Graph meta tags here, and then we’ll talk about them.

Open Graph

{{< highlight html "linenos=table" >}}
<meta property="og:title" content="The Rock" />
<meta property="og:type" content="video.movie" />
<meta property="og:url" content="http://www.imdb.com/title/tt0117500/" />
<meta property="og:image" content="http://ia.media-imdb.com/images/rock.jpg" />
<meta property="og:description" 
  content="Sean Connery and Nicolas Cage star as a chemist and an ex-con." />
{{< / highlight >}}

You’ll notice that some of these tags seem redundant compared to the other tags we’ve added so far – and truth be told, I agree. But the Facebook [Open Graph debugger](https://developers.facebook.com/tools/debug/) throws warnings if you don’t have an og:title or og:description, so it’s best to include them for maximum accessibility.

### og:title

This purpose of this meta tag is similar to the &#60;title&#62; tag that we discussed above, but strictly used when _sharing_ a link to your web page. It wont be used for browser tabs, bookmarks, or Google search results like the actual &#60;title&#62; tag.

### og:type

This describes what type of content you’re linking to. More often than not, this will be set to **website**, but as you see in the example, it doesn’t have to be. Check out the [Open Graph docs](http://ogp.me/) for the various values that this meta tag can be set to.

### og:url

This is the canonical URL that the Open Graph object will reference when shared, and it should 99% of the time be set to the URL of the page you’re linking. The only other value this should really be set to would be something like a home page, in case the current page (e.g. a 404 page, unauthorized page, etc.) really isn’t something you want shared.

### og:image

![Open Graph Object Example](https://personal-k8s-main-space.nyc3.cdn.digitaloceanspaces.com/thecodeboss.dev/entries/what-meta-tags-your-site-should-be-using-blog/og-example.jpeg)

Open Graph Object Example

This is probably the one that you’ve come across most often as a user, and the one that Open Graph really pioneered: an image meta tag. This tag links to an image file, and if it exists, it will display that image when shared on many social media platforms. While Open Graph was originally built by Facebook, several other services such as Slack, LinkedIn, Google+, etc. all use this to pull in an image when you share a web page.

Typically only JPEGs and PNGs are supported, but it’s really up to the platform you’re sharing it on. If they want to render gifs or svgs, then they can do that. When choosing an image size, there are a couple of recommendations.

1 – The image should be reasonably sized. Facebook and other services typically limit it to 8mB, but you really should never have an image that big on the web. My personal goal is to keep all images under 500kB.

2 – This is Facebook specifically, but they recommend an aspect ratio of 1.91 to 1, and further recommend images to be 600 x 315 or 1200 x 630 pixels. You can choose an image with any aspect ratio, but abiding by these guidelines will make sure that parts of your images don’t get cropped out.

### og:description

Just like og:title is a doppelgänger to the title tag, og:description is similar to your meta description tag.

That covers the basic Open Graph meta tags, but as I mentioned earlier, there are more than just these if you want to get nitty-gritty with your site’s content. Let’s move on to our final category.

Twitter
-------

Twitter has it’s own protocol suite for meta tags, and they involve rendering a “card” to your tweets which look just like Open Graph objects. In fact – Twitter will actually use Open Graph meta tags that you already have to help render your cards, which is nice so that you don’t have to duplicate any meta tag content. Here’s a base example of what meta tags you should use for Twitter:

Twitter Meta Tags

{{< highlight html "linenos=table" >}}
<meta name="twitter:card" content="summary" />
<meta name="twitter:site" content="@nytimesbits" />
<meta name="twitter:creator" content="@nickbilton" />
{{< / highlight >}}

There are more meta tags that Twitter supports such as image, title, description, etc., but the tags shown here are the important ones that are unique to Twitter. You can add those other meta tags – but as mentioned earlier, if they aren’t present, Twitter will go ahead and use the data provided by your Open Graph tags – which is what I prefer.

### twitter:card

![Twitter Summary Large Image Card Example](https://personal-k8s-main-space.nyc3.cdn.digitaloceanspaces.com/thecodeboss.dev/entries/what-meta-tags-your-site-should-be-using-blog/twitter-card-example.jpeg)

Summary Large Image Example

This is the most important twitter meta tag, and it’s required if you want to render a card at all. The various values can be one of "summary", "summary_large_image", "app", or "player" – all of which you can read about [here](https://dev.twitter.com/cards/types). The default value should be “summary”, unless you want to showcase a featured image, in which case you would use “summary_large_image.”

### twitter:site

This meta tag describes the twitter username for the website used in the card footer, and is required if you want to track attributions to this username through [Twitter Card Analytics](https://dev.twitter.com/cards/analytics).

### twitter:creator

This meta tag describes the twitter username for the content creator/author.

That wraps it up for the must-have Twitter meta tags. As mentioned, there are plenty more, and if you’re interested you can read up on them [here](https://dev.twitter.com/cards/markup).

Final Thoughts
--------------

Did we cover every meta tag out there? Absolutely not – but we covered a lot of them that are pretty important. Some of the ones we missed out on include [a whole suite](http://applinks.org/documentation/) of meta tags dedicated to deeplinking, where you can do things like tell an operating system (such as iOS, Android, or Windows Phone) to open up an app when you land on the webpage instead of rendering the webpage itself. You’ve probably seen this type of action happen when you click on a Twitter, Instagram, or Amazon link. We didn’t cover the author meta tag either, or different things you can do with the http-equiv attribute, or the _keywords_ meta tag – and that last one’s for good reason; the keywords meta tag has become pretty unimportant, and if any SEO “gurus” try to tell you that it is important – then run. Run away, because that’s a bold-faced lie.

Now that you know the purpose of some of the various meta tags and how to use them, you can go update some of your projects to make them more shareable! I hope you enjoyed this post and learned a little bit more about how to power up the HTML in your web pages.
