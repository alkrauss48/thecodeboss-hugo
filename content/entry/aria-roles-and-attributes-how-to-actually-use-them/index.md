---
title: "ARIA Roles and Attributes: How to Actually Use Them"
date: "2016-09-08"
categories:
- Blog
tags:
- Front End
draft: "false"
---
If you’re a web developer, then there’s a chance that you’ve heard of ARIA roles and attributes before. [WAI-ARIA](https://www.w3.org/WAI/intro/aria) – a protocol suite for building **A**ccessible **R**ich **I**nternet **A**pplications (hence the name) – lays down some rules to help developers build websites that are accessible for all users. A lot of the times when we think of accessibility, we only think of blind users – but there are a lot of other types of disabilities that people may have such as color blindness, motor impairment, lack of limbs, auditory issues, cognitive issues, “crisis” moments, etc. Using some of the core ARIA concepts can not only help you build websites that enhance the experience for users with disabilities, but it will also help you architect your HTML better and make it more semantic – and doing things like that will help you to become a better developer.

ARIA by no means makes up the entirety of accessibility concerns for web development, and if you’d like to learn how else you can build your website for accessibility, I suggest you hop on over to my post about [Developing for Accessibility](/2014/07/developing-for-accessibility/). In this post, we’ll specifically be sticking with ARIA roles and attributes, and how you can _actually_ use them.

What I mean by “actually use them” is that I’m going to show you how to take your first simple steps implementing ARIA concepts into your HTML. If you google around for ARIA, you’ll likely find two kinds of resources:

1.  On one end of the spectrum, you’ll find the overwhelming [documentation](https://www.w3.org/TR/wai-aria/) over _every single_ ARIA role and attribute (and there’s a ton) to the point where your eyes glaze over just scrolling down the page
2.  Or, you’ll find some small posts and/or videos about accessibility that basically say “I’m not going to go over ARIA too much, but here are some of the roles you can put in your HTML to help with accessibility.”

Both of these options suck – because they’re not effective at teaching you. I want to provide a middle ground between these two categories. I’m going to show you how exactly you can use ARIA roles and attributes in your HTML today with real examples – but I’m not going to throw a book of documentation at you. We won’t go over everything – in fact, we’ll probably scrape less than 30% of the full WAI-ARIA spec – but we’re gonna cover an important amount that will make sense enough for you to actually use and remember it.

Ready? Let’s get to it.

How ARIA Roles and Attributes Work
----------------------------------

Before we get to some examples, I want to explain what ARIA roles and attributes are and how they work. ARIA helps to define attributes that you apply to HTML elements just like an **href** or **class** attribute. As a user with little or no disabilities browsing the web, you won’t ever notice ARIA roles or attributes because they don’t affect the visual design of a site – they’re strictly used by screen readers and other assistive technologies.

Browsers build accessibility trees for each website that you visit so assistive technologies can navigate them easier. ARIA roles and attributes help to fill in the gaps of information about what certain elements or groups of elements are for, and how an element is supposed to be used.

Here’s an example of an unordered list aided with ARIA roles and attributes:

{{< highlight html "linenos=table" >}}
<ul role="menu" aria-expanded="false">
    <li role="menuitem"></li>
    <li role="menuitem"></li>
    <li role="menuitem"></li>
</ul>
{{< / highlight >}}

Just by looking at it, this type of semantic HTML probably makes sense to you. Without the help of ARIA, this would just look like a list of items – but now you can tell that this is supposed to be a menu _and_ with the aria-expanded state set to false, you know that this menu isn’t showing the individual menu items yet.

Rules of ARIA Use
-----------------

There are a few core rules to keep in mind when using ARIA:

1.  If you can semantically build your website using native elements, then you should always do that instead of relying on ARIA roles or attributes. Use ARIA roles or attributes when the HTML isn’t obviously stating the purpose of an element or group of elements.
2.  Don’t take away or change the native semantic meaning of an element with ARIA roles or attributes.
3.  All interactive controls such as a button, sliding control, or drag-and-drop widget must be usable by the keyboard.
4.  There are 2 ways to hide information from the accessibility tree, which should be used very sparingly for situations where content is unimportant or meant to be hidden. You can do this either with [role=”presentation”](https://www.w3.org/TR/wai-aria/roles#presentation) or [aria-hidden=”true”](https://www.w3.org/TR/wai-aria/states_and_properties#aria-hidden). You should never use these on an element that is visible and can be focused with the keyboard, such as an input field or a link. Defining a presentation role is more strict than an aria-hidden=”true” state – and we’ll see an example of this down below.
5.  Lastly, all interactive elements such as form fields should have a name associated with them. Something like a <label> is perfect, and with ARIA, you can even specify that a certain element is _labelled by_ or _described by_ another element.

Great – we’ve now gotten all of the introductory ARIA stuff out of the way – let’s get to some examples of how you can use ARIA roles and attributes in your HTML today.

Using ARIA Roles and Attributes
-------------------------------

ARIA breaks down into 3 categories: roles, properties, and states. Roles define the purpose of an element, properties help better describe what an element can do, and states are like properties that are _designed to change_ – normally with the help of Javascript. An element can only have one ARIA role at a time, but can have as many properties and states as necessary.

Let’s start off simple.

### Define your main header, content, and footer

Each page normally has an identifiable header, main content, and footer – and there are specific ARIA roles designed to help express these elements.

{{< highlight html "linenos=table" >}}
<header role="banner">
</header>

<main role="main">
</main>

<footer role="contentinfo">
</footer>
{{< / highlight >}}

The [banner](https://www.w3.org/TR/wai-aria/roles#banner), [main](https://www.w3.org/TR/wai-aria/roles#main), and [contentinfo](https://www.w3.org/TR/wai-aria/roles#contentinfo) roles are meant to be used only one time per page, and they help screen readers figure out how a page is laid out on a high-level.

See, using ARIA roles is easy! Let’s get a little deeper.

### Label and Describe Elements

If an element seems rather vague, but could either be given a title or described by another element, then you can define that relationship using ARIA. There are 3 different ARIA properties that can help with this:

*   [aria-label](https://www.w3.org/TR/wai-aria/states_and_properties#aria-label)
*   [aria-labelledby](https://www.w3.org/TR/wai-aria/states_and_properties#aria-labelledby)
*   [aria-describedby](https://www.w3.org/TR/wai-aria/states_and_properties#aria-describedby)

**Aria-label** is a property that defines a short title for an element; **aria-labelledby** references the ID of another element, which is a short title for the element; and **aria-describedby** is just like aria-labelledby – but is meant for longer descriptions instead of short titles. Here’s an example of this using a buttons’ tooltip:

{{< highlight html "linenos=table" >}}
<button aria-describedby="revertTooltip">Revert</button>
<div role="tooltip" id="revertTooltip">Reverting will undo any changes that
have been made since the last save.</div>
{{< / highlight >}}

For shorter labels of important elements, such as a lightbox that contains a larger version of the image you clicked on, you can use the aria-label property:

{{< highlight html "linenos=table" >}}
<div class="lightbox" aria-label="Image Lightbox">
  <img src="foo.jpg" alt="Foo" />
</div>
{{< / highlight >}}

Now it’s important to remember that we don’t need to label _everything_, especially if there’s already a predefined way of labelling an element such as a figcaption, title attribute, or an image’s alt attribute. We only need to label something if the HTML doesn’t clearly indicate the purpose of an important element.

### Navigation

This topic’s going to be a bit extensive, but that’s because navigation is one of the areas of a site that you really want to get right since people need it to, well, navigate around. Normally this involves &#60;nav&#62;, &#60;ul&#62;, &#60;li&#62;, and &#60;a&#62; elements. Let me give you an example of a solid nav bar set up with ARIA roles and attributes, and then we’ll talk about it:

{{< highlight html "linenos=table" >}}
<nav role="navigation">
  <ul role="menubar">
    <li role="menuitem"><a href="#">Link 1</a></li>
    <li role="menuitem"><a href="#">Link 2</a></li>
    <li role="menuitem" aria-haspopup="true">
      <a href="#">Link 3</a>
      <ul role="menu" aria-hidden="true">
        <li role="menuitem"><a href="#">Sub Link 1</a></li>
        <li role="menuitem"><a href="#">Sub Link 2</a></li>
      </ul>
    </li>
  </ul>
</nav>
{{< / highlight >}}

Lots of roles and attributes, right? Like I said, navigation is one of the most important parts of a website, and that’s why making sure the accessibility tree can build it properly is so important too. In this example, we defined the navigation with a [navigation](https://www.w3.org/TR/wai-aria/roles#navigation) role, and its child unordered list as being a [menubar](https://www.w3.org/TR/wai-aria/roles#menubar). This means that the navigation is visually presented as a horizontal menu bar as opposed to a vertical menu (which instead would use a [menu](https://www.w3.org/TR/wai-aria/roles#menu) role). Beneath that, we have our list of [menuitems](https://www.w3.org/TR/wai-aria/roles#menuitem). When we get to a menuitem that has a sub-menu that pops up, then we give it an ARIA property of [aria-haspopup=”true”](https://www.w3.org/TR/wai-aria/states_and_properties#aria-haspopup). We give the sub-menu a role of **menu** because this is a vertical submenu, as well as an ARIA _state_ of **aria-hidden=”true”**. The reason this is a state is because the sub-menu is initially hidden from view, but when you hover over the parent menuitem, the sub-menu would appear, and then hide again when you aren’t interacting with it. With Javascript, you could change the state to be **aria-hidden=”false”** while the sub-menu is visible, and then back to true again when it’s not.

ARIA rule #3 above stated to be hesitant to use aria-hidden=”true” – but this is a perfect example of how to use it properly. The _aria-hidden_ property deals with whether an element is supposed to be visible to a user at a certain time, while the _presentation_ role straight up removes the element from the accessibility tree – which we certainly don’t want to do for navigation.

This same type of structure works for _lists_ that aren’t necessarily menus – but instead of **menu** and **menuitem** roles, you would use [list](https://www.w3.org/TR/wai-aria/roles#list) and [listitem](https://www.w3.org/TR/wai-aria/roles#listitem) roles. Everything else such as properties and states remains exactly the same.

I know there are a lot of ARIA roles and attributes here – but you can reasonably assume that just about every nav – regardless of exact HTML structure – will follow an ARIA architecture similar to this example.

### Tab Lists

Another common way you can use ARIA labels and descriptions is when you build a tab widget on your page, where you click tabs to reveal different content. On top of ARIA labels though, we have some other neat tab-specific ARIA roles and properties I want to show you. Specifically, they are:

*   [tab](https://www.w3.org/TR/wai-aria/roles#tab) – a clickable tab which reveals content
*   [tablist](https://www.w3.org/TR/wai-aria/roles#tablist) – the container which groups the clickable tabs
*   [tabpanel](https://www.w3.org/TR/wai-aria/roles#tabpanel) – the actual content of the tab
*   [aria-controls](https://www.w3.org/TR/wai-aria/states_and_properties#aria-controls) – a property that’s not tab-specific, but helps indicate that an element _controls_ another element

{{< highlight html "linenos=table" >}}
<div role="tablist" class="tab-links">
  <a id="tab-1" role="tab" aria-controls="panel-1" href="#">Tab 1</a>
  <a id="tab-2" role="tab" aria-controls="panel-2" href="#">Tab 2</a>
  <a id="tab-3" role="tab" aria-controls="panel-3" href="#">Tab 3</a>
  <a id="tab-4" role="tab" aria-controls="panel-4" href="#">Tab 4</a>
</div>
<div class="tab-contents">
  <div id="panel-1" role="tabpanel" aria-labelledby="tab-1" aria-hidden="false">Tab 1 Content</div>
  <div id="panel-2" role="tabpanel" aria-labelledby="tab-2" aria-hidden="true">Tab 2 Content</div>
  <div id="panel-3" role="tabpanel" aria-labelledby="tab-3" aria-hidden="true">Tab 3 Content</div>
  <div id="panel-4" role="tabpanel" aria-labelledby="tab-4" aria-hidden="true">Tab 4 Content</div>
</div>
{{< / highlight >}}

Tab lists are one of those things which really requires a lot of visual acuity to understand how they work, and without semantic HTML elements specific to tab architecture, it’s difficult to make tabs accessible by default. That’s why it’s so important to build them accessibly with ARIA roles and attributes. Here in this example, we’re doing a lot of different things:

*   Setting ARIA roles for the tablist, tabs, and tabpanels
*   Stating which tab _controls_ which tabpanel
*   Stating which tab _labels_ each tabpanel
*   Handling the aria-hidden state to indicate which tabpanel is visible at any given time

This, my friend, is proper and accessible HTML architecture.

### Forms

Last, and perhaps most importantly, it’s absolutely essential that you make the interactive portions of a website as accessible as possible – and usually that ends up being your forms. There are a lot of various ARIA roles and attributes that can be applied to forms, so I just want to highlight some of the ones that are important to include:

*   [form](https://www.w3.org/TR/wai-aria/roles#form) – pretty simple, just the landmark role for a <form>
*   [search](https://www.w3.org/TR/wai-aria/roles#search) – the role for a form with the primary function of searching data
*   [aria-required](https://www.w3.org/TR/wai-aria/states_and_properties#aria-required) – property indicating whether a field is required
*   [aria-invalid](https://www.w3.org/TR/wai-aria/states_and_properties#aria-invalid) – property indicating that the value of an input field is invalid (wait until **after** form submission to add this)

On top of ARIA roles, there are a couple important things to consider when building accessible forms.

1.  It’s incredibly important that each form field has a valid <label> associated with it which either wraps the form field or references it with the **for** attribute. If this isn’t possible, then you can use the ARIA labelling methods discussed above. You **cannot** substitute the placeholder attribute for a label because it’s not meant to be handled as a label; a placeholder is meant to simply be an example of what you’re supposed to enter in that field.
2.  Forms are often times tabbed-through via the keyboard, so it’s important that the tab order makes sense. Normally this isn’t a concern, but if you position or hide certain input fields via CSS/Javascript, then the tab order might become unintuitive. When this happens, you can set the _tabindex_ attribute of an element to make sure that the tab order is how you expect it to be.

Here’s an example form with proper markup:

{{< highlight html "linenos=table" >}}
<p id="formLabel">Information Form</p>
<form role="form" aria-labelledby="formLabel">

  <label for="name">Name</label>
  <input id="name" type="text" placeholder="John Doe" value="" />

  <label for="email">Email*</label>
  <input id="email" type="email" placeholder="foo@bar.com" value="" aria-required="true" />

  <span id="genderLabel">Gender</span>
  <div role="radiogroup" aria-labelledby="genderLabel">
    <input type="radio" name="gender" value="male"> Male<br>
    <input type="radio" name="gender" value="female"> Female<br>
    <input type="radio" name="gender" value="other"> Other
  </div>

  <label for="comment">Comment*</label>
  <textarea id="comment" aria-multiline="true" aria-required="true"></textarea>

  <input type="submit" value="Submit" />

</form>
{{< / highlight >}}

I threw in a couple extra ARIA roles and attributes such as [radiogroup](https://www.w3.org/TR/wai-aria/roles#radiogroup) and [aria-multiline](https://www.w3.org/TR/wai-aria/states_and_properties#aria-multiline) – but that’s just to show how specific you can get with them. Notice how we didn’t add a [radio](https://www.w3.org/TR/wai-aria/roles#radio) role to the radio buttons (which is a valid ARIA role) – that’s because a radio input field itself semantically expresses how that element is supposed to work, and we don’t need to express that again with ARIA. However, because the wrapper of those fields is just a div, we still went ahead and gave it a radiogroup role.

Mostly, I just wanted to show the importance of labelling your input fields and how you can flag certain fields as required via ARIA attributes. If any field were invalid during the submission, then we would add an **aria-invalid=”true”** state onto each invalid field, and remove that state when the field becomes valid again.

Final Thoughts
--------------

We went over a lot of examples, and there’s still many more ARIA roles and attributes that we didn’t talk about – so feel free to check out the [ARIA docs](https://www.w3.org/TR/wai-aria/) if you want to learn more.

To me, I love building accessible websites because it really feels like the right thing to do, but I like it for another reason too: I’m huge into code architecture and organization, and using ARIA roles and attributes helps me to architect my HTML much more semantically – and I love that. I hate using un-semantic elements such as div, span, and sometimes even ul – but if I can add an ARIA role such as _contentinfo_, _menu_, _treeitem,_ _status_, and more, then I’m infinitely more happy because I’ve appropriately defined via HTML what this element is supposed to be. Taking things even further with ARIA attributes such as _aria-expanded_, _aria-hidden_, and _aria-invalid_ make it even more semantic and meaningful.

If you don’t already, then I encourage you to start applying some of the ARIA principles into your web sites today – and as I mentioned in the intro, if you’d like to learn other ways that you can build your site accessibly, then you can check out my post over [Developing for Accessibility](/2014/07/developing-for-accessibility/). I hope I’ve proven that it’s not too difficult to get started – and if you want more information, then the docs can answer any question you may have about them.
