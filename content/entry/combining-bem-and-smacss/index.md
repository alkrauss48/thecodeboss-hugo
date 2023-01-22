---
title: Combining BEM and SMACSS
date: "2016-06-24"
categories:
- Blog
tags:
- Front End
draft: "false"
---
Code architecture is super important when you want to have clean, readable, and organized code. For small, personal projects, you might be able to get away with just a “hacker” mentality in the sense of just throwing some code together – but that will quickly break down to an unmaintainable state for larger projects. A lot of programming languages have overcome this issue via various frameworks that force some sort of [DSL](https://en.wikipedia.org/wiki/Domain-specific_language) and/or file structure on you (Ruby’s Rails framework is a simple example) – or the language’s paradigm itself allows for clean code architecture (class-based, prototypal, etc.) – but there’s one language devoid of a lot of these niceties that’s ubiquitous across the web and can easily span thousands of lines of code for even the simplest of projects. I’m talking, of course, about CSS.

CSS is about as bare bones of a programming language as you can get; in fact, [Wikipedia](https://en.wikipedia.org/wiki/Cascading_Style_Sheets) classifies it as a _style sheet_ language instead of a programming language because it’s practically logic-less. You just select various elements and apply styles to them – and by default the styles will _cascade_ in a particular order based on what selectors you’ve used. That’s it – and like I mentioned earlier, CSS can easily surpass a thousand lines of code for any project! Tools like [sass](http://sass-lang.com/), [less](http://lesscss.org/), [postCSS](http://postcss.org/), and more have helped to add in some neat features to CSS such as mixins, variables, auto-prefixing, and more – but none of those address how you should architect your CSS.

Luckily – several talented developers have begun to tackle this issue, and two CSS design patterns have emerged as the most popular among the crowd: [SMACSS](https://smacss.com/) and [BEM](https://en.bem.info/). Now, every design pattern is opinionated to some degree, so you personally have to see if they’re right for you. I started to apply both BEM and SMACSS separately to my CSS-heavy projects and learned what made the most sense for my coding style – and also what I absolutely hated from each design pattern. In the end, I took the core concepts of both BEM and SMACSS and combined them to create a personalized design pattern – and I’m really loving it. It’s helped my CSS organization in such powerful ways, and I want to share with you what I found valuable from each design pattern. Before I do that though, I want to review the core concepts of both BEM and SMACSS – so that we’re all on the same page.

Similarities
------------

Despite the differences, both SMACSS and BEM share a pretty common core set of rules:

1.  Never use ID selectors. CSS class selectors should make up the majority of your styles.
2.  CSS selectors should stay flat – don’t nest them (unless you have a good reason).
3.  Both design patterns focus on a **module**\-based system of organizing the majority of your CSS – which sort of extends how object-oriented CSS ([OOCSS](http://oocss.org/)) works. What this means is that you should architect your CSS classes in a manner that takes advantage of building repeatable HTML blocks that have a semantic purpose.

Now, let’s get to some of the differences.

SMACSS
------

SMACSS is a design pattern created by a single developer named Jonathon Snook who works at Yahoo! (which currently implements the SMACSS pattern). It focuses on 5 main types of structures to organize your CSS:

*   Base
*   Layout
*   Module
*   State
*   Theme

**Base.** Base styles are just that – base styles that apply to _base_ selectors. These should be very simple and incredibly broad styles, such as font color and family, link styles, etc. Something like this:

{{< highlight css "linenos=table" >}}
body {
  font-family: sans-serif;
}
 
p {
 font-size: 1em;
}
 
a {
  text-decoration: none;
}
{{< / highlight >}}

Easy peasy.

**Layout**. Layout styles are meant for logic-less container elements that are solely included in your HTML to provide positioning, padding, or other _layout_\-based purposes. By default, SMACSS recommends you begin your layout styles with the **l-** prefix:

{{< highlight css "linenos=table" >}}
.l-container {
  max-width: 58em;
  margin-left: auto;
  margin-right: auto;
}
 
.l-horizontal-padding {
  padding: 0 1em;
}
{{< / highlight >}}

**Module**. Modules will make up about 95% of the CSS of your page. This topic goes pretty deep – so I encourage you to look up the SMACSS [documentation](https://smacss.com/book/type-module) for how modules are intended to work – but the tl;dr version is that you should style a block of HTML code with independent, semantic content as a module with children elements. Something like this:

{{< highlight css "linenos=table" >}}
.menu {
  list-style: none;
}
 
// child element of .menu
.menu-item {
  float: left;
  padding: 1em;
}
{{< / highlight >}}

SMACSS suggests you keep your module names short, so that your child item class names don’t get unnecessarily long. This takes some practice to understand how to style your CSS using a module-based system – but it’s worth the struggle once you feel comfortable with it.

**State.** States are very simple styles – and are the only time where it’s okay to use the dreaded **!important** attribute. States are styles that should be triggered by Javascript (i.e. showing an element, hiding an element, marking an element as active, etc.) – and should normally begin with the **is-** prefix:

{{< highlight css "linenos=table" >}}
// This is the accessible way to hide content
 
.is-hidden {
  position: absolute;
  left: -999em;
}
 
.is-visible {
  position: static;
}
{{< / highlight >}}

**Theme.** I don’t really use theme styles since my projects typically don’t need them, but their purpose is to provide styles for various _themes_ – where the core styles of a series of pages stay the same, but small things may change like background colors, fonts, etc.

### Folder Structure

SMACSS doesn’t place much emphasis on how you should structure your CSS files (which is _drastically_ different from BEM) – so I created my own simple folder structure for the projects where I solely used SMACSS:

{{< highlight shell "linenos=table" >}}
base/
layouts/
modules/
states/
app.scss
{{< / highlight >}}

Using this as a folder structure, you would just create files for each style type in each respective directory. I use sass in all of my projects, and I’m a very big fan of using sass imports to import every sass file into one core file before I process it as CSS – which is what the **app.scss** file is.

That covers some of the core concepts of SMACSS – let’s move onto BEM now.

BEM
---

Compared to SMACSS, BEM is simpler to understand – but it’s much more rigid in how you structure your code and files. In BEM, every style is a part of a module – no base styles, layouts, themes, etc. You just have **blocks**, **elements**, and **modifiers**. In fact, that’s where BEM gets its name. Here’s a breakdown of what those concepts entail.

**Blocks**. Blocks are the styles that house related child items. You can think of them as the highest level of a module. Something like a menu:

{{< highlight css "linenos=table" >}}
.menu {
  list-style: none;
}
{{< / highlight >}}

**Elements**. Element styles represent the actual child items inside of a block. Elements always begin with the block name, followed by two underscores (\_\_) and a suffixing name:

{{< highlight css "linenos=table" >}}
.menu__item {
  float: left;
  padding: 1em;
}
 
.menu__link {
  font-size: 1.25em;
}
{{< / highlight >}}

I like to think of element styles as _nouns_, since they’re meant as the core styles for actual elements.

**Modifiers**. Modifier styles are applied to both blocks and elements, and are strictly meant to handle the subtle differences that two similar blocks or elements may have. For example, a menu link may be white – or it may be blue:

{{< highlight css "linenos=table" >}}
.menu__item--white {
  color: white;
}
 
.menu__item--blue {
  color: blue;
}
{{< / highlight >}}

Modifier styles always start with the full block or element name, followed by double hyphens (–) and then the modifier name. I think of modifiers as _adjectives_, since they help to better describe an element or block.

### Folder Structure

This is where BEM heavily differs from SMACSS. Where SMACSS didn’t put much emphasis on folder structure, BEM suggests that every single block, element, _and_ modifier should have its own CSS file. So as you start to build out your project, you’ll quickly create detailed file structures like this.

{{< highlight shell "linenos=table" >}}
blocks/
    input/
        _type/                        # `type` modifier directory
            input_type_search.css     # Implementation of modifier `type` with value `search` in CSS technology
        __box/                        # `box` element directory
            input__box.css
        input.css
        input.js
    button/
        button.css
        button.js
        button.png
{{< / highlight >}}

This is very organized – there’s no doubt about that – but to create a new file for every new class basically is a little extreme for me. This was one reason BEM was difficult for me to fully implement in the recommended manner.

So – how do I currently build my CSS? I took the core concepts of BEM and SMACSS and combined them in a way that made sense to me.

Combining Them
--------------

I really like BEM’s recommendations with regard to how code blocks should be structured. Blocks, elements, modifiers – building my class names following this design pattern really helped me to think about my code in a reusable block-based manner. I liked it much more than how SMACSS suggested to structure modules – which is practically no structure. However, I don’t feel like _everythin__g_ should be a module – which is BEM’s philosophy. I feel like there’s a valid purpose for base, layout, state, and theme styles – and I don’t feel like they need to be modules.

In the end, I basically went with a SMACSS architecture that leveraged the power of base, layout, and state styles – and instead of SMACSS’ module styles, I substituted them completely with BEM styles – blocks, elements, and modifiers. I also came up with my own file structure that made sense to me:

{{< highlight shell "linenos=table" >}}
modules/
  _menu.scss
  _content.scss
  // etc.
config/
  _variables.scss
  _mixins.scss
_app.scss
_base.scss
_layouts.scss
_states.scss
{{< / highlight >}}

I kept base, layout, and state styles all limited to single stylesheets because even all together they never grew too large. I created a new file for each **block**, and kept all modifiers and elements related to that block in the same file. These files usually never grew to beyond 100 lines, so they were very manageable. Finally – I added a config folder for all the files that didn’t translate into direct styles. This config folder would hold things like variables, broad mixins, custom font stylesheets (such as icon fonts), and more.

You can check out a [live example](https://github.com/alkrauss48/starter-site/tree/bem-smacss/app/src/sass) of this folder structure in my starter-site template.

Final Thoughts
--------------

I mentioned earlier that every design pattern is opinionated – and my personal pattern is no exception. It may appeal to you – or you may hate it, and that’s okay. At the very least, I hope I provided you with a little more knowledge about the two most popular CSS design patterns out there right now, and helped transform some of the opinions you may have had about them. In the end, we all have different coding styles, so one single design pattern won’t fit everyone. The most important obstacle these patterns try to tackle is that of code organization – and as long as you have a methodology behind your code architecture, then you’re good to go – no matter if you use a common design pattern or you just make up your own!
