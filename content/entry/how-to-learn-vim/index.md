---
title: How to Learn Vim
date: "2014-07-24"
categories:
- Blog
tags:
- Devops
draft: "false"
---
I’m following up with my first vim blog post about [why you should use vim](/2014/06/vim-as-your-editor/ "Vim as Your Editor?"). If you’ve made it here, then you’re either seriously interested in learning vim (which would be _awesome_), or you just came here of your own random volition. Either works for me, but if you have heard of vim and are just a little bit hesitant to learn it, then fear no more. I’m going to teach you the best methods to learn vim.

**Prerequisite**: You must have vim installed if it isn’t already. You can do this through the homebrew, apt-get, yum, or any other package manager your system supports. You do not need graphical vim (GVim or MacVim).

## Vim Tutor

If you open up your shell, type in the command

{{< highlight bash "linenos=table" >}}
vimtutor
{{< / highlight >}}

This will open up the Vim Tutor, which is a nice little interactive program that teaches you how to use Vim. This is my preferred way to learn Vim, and if you are on your first go around, it will probably take about 30 minutes to complete. You don’t need any other resources – just your terminal (not even a mouse!).

When I initially learned vim, I completed this short course about 4-5 times the full way through. Naturally after the first time, you get much quicker, and the lessons become more of a refresher. I suggest using the Vim Tutor initially to see if you really want to learn vim, and if so, then continue using it to get familiar with the basics.

**Note:** Vim is not difficult to learn, but you will be slow for the first week or so. That’s natural. Roger Federer didn’t win Wimbledon his professional first year either.

## Vim Golf

[Vim Golf](http://vimgolf.com/ "Vim Golf") is a ruby gem which you can install and is a game-based method to learning vim. A common concept of vim is considering how many keystrokes you need to use in order to get something done; obviously, the less you use, the quicker you are, and therefore you want as few as possible. This the idea behind Vim Golf – you are trying to get a _low_ keystroke score.

For installation and running, please check out their website. There you can see some of the challenges and other people’s scores, and the whole Vim Golf project is also on github. I haven’t personally used Vim Golf, but I know people who have, and they had great success with it.

## Just Start Using It

There are a plethora of other tutorials out there for vim because people know it’s not the simplest thing in the world to grasp, but in my experience, once you start to understand the basics (which you will through the Vim Tutor) then I suggest just getting out there and trying to really use it as your editor.

Remember, you will be slow, and you will forget things. And certain things will seem more difficult than they should be at first (like copying a section of code for pasting), but trust me, if anything seems unnecessarily hard in vim, then there’s definitely an easier way to do it and I encourage you to Google it.

Once you get out there and really start using vim, give yourself 2 weeks to really see how you feel. If you’re on a huge project on a short deadline, then use your preferred editor to get your work done quickly, but make sure you don’t forget about using vim. It takes some practice to learn…but it is so incredibly rewarding.

Extras
------

### Plugins

The vim community is very, very active and is completely focused on productivity. You can find vim channels on StackOverflow, as well as various twitter accounts created solely for publishing cool vim stuff.

Vim by itself is powerful, but relatively basic. You can add on so much to the base vim installation through plugins. For example, my editor has autocomplete (like Microsoft’s Intellisense), shortcuts based on what file type I’m in, custom color scheming, commenting shortcuts, git diff integration, auto coloring of hex values, and so much more.

These all can be found on Github, and I recommend using the powerful [Vundle](https://github.com/gmarik/Vundle.vim "Vundle") tool for downloading and installing plugins (very similar to a ruby Gemfile).

### Plugin/Colorscheme Distributions

If you don’t want to worry about customizing your vim colorschemes and plugins, then guess what … you don’t have to! There are 2 massively popular vim distrubutions which come complete with multiple colorschemes and very useful plugins. The two are:

*   [Janus](https://github.com/carlhuda/janus "Janus")
*   [Spf13](https://github.com/spf13/spf13-vim "Spf13")

While I currently have my own set of vim customizations that sit on top of [Thoughtbot’s minimal vim config](https://github.com/thoughtbot/dotfiles "Thoughtbot Dotfiles"), I previously used Janus for a little over a year. I really, really liked it, and it was the moment that I started feeling comfortable with vim that I started to check it out. Let me just say, my productivity skyrocketed.

Both distributions come with a base set of colorschemes and awesome plugins, and you can even add more plugins on top of that if you find some you’d like to use. I highly recommend using a vim distribution as your first step at getting into vim customization.

That’s it - I hope you start using vim!
