---
title: Developing for Accessibility
date: "2014-07-11"
categories:
- Blog
tags:
- Front End
draft: "false"
---
Accessibility is one of those topics that everyone always _aims_ for and remarks how important it is as far as development goes, but it never really gets thought of as much as it needs to during the actual build phase. But wait a minute, let’s define what accessibility for the web really means. Developing an accessible site means ensuring that all users – whether disabled in some way or not – can not only access your site but also interact with it with the best possible user experience.

This doesn’t entail responsiveness as much (which should always be staple of a new web project these days), but focuses more on building a well structured website so that it is keyboard-navigable, parseable with screen readers, visible to users with color-blind deficiencies, etc. Sure, these users won’t make up a majority of the users on your sites, but we all know that’s just an excuse to get out of a little extra planning for development.

Notice how I said _planning for development_ instead of actual _development_. That’s because there’s really no extra development involved with making an accessible webpage, as long as you know what you’re doing. Let’s get into the key areas where developers should focus on in order to make their sites fully accessible:

Image and Link Attributes
-------------------------

If there’s one thing you know about accessibility, it’s to put alt tags on your images. Something like this:

{{< highlight html "linenos=table" >}}
<img src="some-source" alt="A cool image of a penguin. Just chillin." />
{{< / highlight >}}

But, don’t forget about your anchor tags too. Instead of alt attributes, you need to add title attributes here. This isn’t necessary for all links, but make sure you do them for your icon-font anchors – you know, things like your facebook, twitter, and responsive nav icon:

{{< highlight html "linenos=table" >}}
<a class="facebook-icon" title="Facebook"><a/>
{{< / highlight >}}

Use Semantic HTML5 Elements
---------------------------

HTML5 added some new descriptive container elements that you should learn about if you don’t know them already. These include nav, section, header, footer, article, and aside. Each of them function just like a div, but have different semantic meanings. For example, _nav_ should be used for your page’s navigation, _aside_ should be used for non-relavant content, _section_ is a large container which can contain a _header, footer,_ and multiple _articles_, etc.

While an average user won’t usually see the difference, it makes for better design architecture, enhances your browser’s understanding of the content inside of these containers, and allows for more rich screen reading.

Noticeable Focus Status for Links
---------------------------------

You probably know about some of the states that an html anchor can be in such as hover or visited, but you may not know about the focus state. The focus state is shown when … yup, you guesssed it, when a link is focused. Many users don’t see this phase because it’s when your keyboard is focused on the element. This is the state when you are typing into an input element, and the state that the ‘Submit’ link has when you tab onto it to hit enter.

Many users do actually use the tab key to navigate through your site, whether for accessibility purposes or just sheer speed, and you need to account for that. There are 2 things I usually do here.

First – I put a default style on all focused links:

{{< highlight css "linenos=table" >}}
a:focus {
  outline: 1px solid #ffa500!important;
}
{{< / highlight >}}

Next, I usually find the elements that have unique hover effects, and I often times just use the same hover effect for the focus effect. So some elements of mine are structured like this:

{{< highlight css "linenos=table" >}}
a:hover, a:focus {
  color: red;
  background-color: white;
}
{{< / highlight >}}

 Skip Menus
-----------

Every accessible page should be complete with a skip menu. A skip menu is a menu that is invisible, but becomes visible after you start tabbing through the page. It allows users to skip to certain portions of your page content – this is very important for users who use screen readers or can’t scroll well. Here’s an [example](http://new.okcommerce.gov/smart-move/) of a solid skip menu I built here at Staplegun. Just start tabbing through the page and you’ll see what I mean.

The code involved is very simple, but I won’t cloud up this post with it. See my [skip menu gist](https://gist.github.com/alkrauss48/dc8e010a59d5e2df1666 "Skip Menu Gist") if you’d like to see how to easily build one.

Test Your Site With a Screen Reader
-----------------------------------

Many users require the use of a screen reader to interactive with your site. Luckily, if you’ve followed the advice laid out thus far, then most of your site should already work fine with a screen reader. This is where you’ll figure out what links need titles, what images need alt tags, and if you need to fix any of your page layout structure.

If you’re testing in Chrome, I like the screen reader [Chrome Vox](https://chrome.google.com/webstore/detail/chromevox/kgejglhpjiefppelpmljglcjbhoiplfn "Chrome Vox") which is a Chrome extension. It’s very easy to use from a development standpoint.

Test For Color Blind Users
--------------------------

Color blindness isn’t incredibly common, but common enough that to be a good front-end developer, you need to account for it. This means following a good color scheme where the colors fit together for maximum viewing accessibility. Usually if you use a [color scheme designer](http://paletton.com/) of some sort and stick with it, then you’re in pretty good shape already.

Most users who are color blind fall into the category of deuteranomoly, which means they have difficulties seeing green. To learn more about the different types (Protanomoly, Deuteranomoly, Tritanomoly, etc.), check out the main [Colorblind Awareness site](http://www.colourblindawareness.org/colour-blindness/types-of-colour-blindness/ "Colorblind Types").

Since most developers aren’t colorblind, it’s tough to test for without being in a colorblind user’s shoes. Well now you can be, with [NoCoffee](https://chrome.google.com/webstore/detail/nocoffee/jjeeggmbnhckmgdhmgdckeigabjfbddl?hl=en-US "NoCoffee Chrome Extension") – a vision simulator that will easily show you what your web pages look like from the viewpoint of several vision impairments. I have been using this extensively to test color issues on my web pages, and it’s been incredibly insightful to see what real colorblind users see.

* * *

And that’s the gist of it! A little bit more than just adding alt tags to your images, but not enough to where you can’t handle it. Now go out there and develop fully accessible web pages, and get in touch with me if I missed anything huge in this post.
