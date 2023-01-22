---
title: Controlling Spotify with Slack and a Raspberry Pi
date: "2016-03-04"
categories:
- Blog
tags:
- Random
draft: "false"
---
After moving to a newly constructed floor at [Staplegun](http://staplegun.us) (where I work), the developers (all 4 of us) chose to switch to an open floor-plan. One of the big updates included in this move was that we now had a shared audio system with speakers all around, and with us working in very close proximity to one another, it became very important for each of us to easily be able to control the music selection. The sound system had no “smart” attributes or network connectivity, so at the most basic level, we could have just hooked up an audio cable from our phones to the auxiliary input and played music that way – but our sound system hub is in our server room, which is nowhere near where we work, so that quickly got thrown away as a plausible option. Other than hooking up a bluetooth connector or some other third-party-connection widget with cables going into the speaker, we were pretty much out of luck. Or so we thought.

We realized we had a spare Raspberry Pi lying around, which has an audio output as well as an ethernet cable input. Theoretically, we could somehow connect to the Pi over our network and stream music from the Pi. Now “how” was the big question. On top of that, we all use [Slack](https://slack.com/) heavily at work, so could we take it one step further and control our music selection via Slack? Sounds farfetched, I know – but that’s exactly what we did, and I want to show you how you can do it too.

Prerequisites
-------------

As you’re following along, there are a few things you need in order to build everything in this post:

*   You need a **premium** Spotify account (need this to get API access).
*   You need a Raspberry Pi (preferably at least a Pi 2, but any Pi should work).
*   You need a speaker to connect to your Pi.
*   Your Pi needs internet access, either wirelessly or via ethernet cable.
*   You need Node.js v0.10.x and [libspotify](https://developer.spotify.com/technologies/libspotify/) installed on the Pi.

That last one is very important – the library we’re going to use doesn’t work with later versions of Node (hopefully this gets updated in the future). All set? Good, let’s get to it.

Getting Everything Set Up
-------------------------

To allow our Slack channel to make requests to our Pi, and then for our Pi to make requests to Spotify, we need to use a package called [crispyfi](https://github.com/crispymtn/crispyfi). Navigate to your desired folder on your Pi, and clone the crispyfi repo:

{{< highlight shell "linenos=table" >}}
git clone https://github.com/crispymtn/crispyfi.git
cd crispyfi
{{< / highlight >}}

After you get this cloned, there’s quite a process you’ll have to go through to get the “Slack to Pi to Spotify” communication chain going; it’s very well documented on the [crispyfi readme](https://github.com/crispymtn/crispyfi.git), so I’ll direct you there to get things set up, but in a nutshell, this is what you’ll need to do:

*   Sign up for a Spotify app and get a Spotify key file (you need a premium membership to do this).
*   Continue with crispyfi’s documentation on where to add in your Spotify username, password, and key file.
*   Create a custom outgoing webhook integration in Slack and set the trigger words to **play, pause, stop, skip, list, vol, status, shuffle, help, reconnect, mute, unmute**.
*   You can name your webhook (we called our’s _jukebox_), give it an emoji icon, and select if the webhook should listen globally on all channels. At Staplegun, we only have this webhook listening on a single channel that’s dedicated to controlling music.
*   Don’t worry about the webhook’s URL field for now – we’re going to edit that later (you’ll still probably need to fill it in with some dummy data though) – and make sure to copy the token that Slack gives you.
*   Add the Slack token in crispyfi’s config.json file.

The idea here is that whenever you chat one of the trigger words in a channel, the outgoing webhook will fire and make a POST request to your designated URL (which we haven’t set yet) including the specific message that triggered it. That POST request will hit the crispyfi server we’re going to run, which will handle all communication to Spotify and back. The Pi will stream music from Spotify and send it to the audio output port, which you would hook up to a speaker.

Once we’ve added all of our config data into our crispyfi project, we can install the dependencies and spin up the server on port 8000:

{{< highlight shell "linenos=table" >}}
npm install
node index # Defaults to running on port 8000
{{< / highlight >}}

If you have everything set up properly, then you should see output stating that crispyfi successfully logged into Spotify with your credentials. Now here’s a problem: we have the server running, but our Slack webhook can’t reach it because our Pi doesn’t have a static IP. To get around this, we can use a wonderful library called [ngrok](https://ngrok.com/) which will expose any port on our localhost to the outside world by providing an ngrok URL. Install ngrok via NPM and then run it for port 8000:

{{< highlight shell "linenos=table" >}}
npm install -g ngrok
ngrok 8000
{{< / highlight >}}

This will take over your terminal pane and provide you with a URL such as **http://10c06440.ngrok.com**. This is the URL we want our Slack webhook to have – followed by the /handle route. So go back to Slack, edit your webhook, and change the URL to be:

{{< highlight shell "linenos=table" >}}
http://10c06440.ngrok.com/handle
{{< / highlight >}}

You’ll have a different ngrok URL, so you’ll need to swap the above URL with the one that you’re provided. If you’ve done everything correctly, then your Slack should now fully be able to control your music selection through your Spotify account!

![crispyfi-screenshot](https://personal-k8s-main-space.nyc3.cdn.digitaloceanspaces.com/thecodeboss.dev/entries/controlling-spotify-with-slack-and-a-raspberry-pi/crispyfi-screenshot.jpeg)

Taking It a Step Further
------------------------

Crispyfi is a great service – but it currently only works with Spotify URIs. That means you can’t play music based on a search for title, artist, album name, etc. – you have to copy the exact URI from Spotify to play a certain song or playlist. We wanted to add this “music query” feature at Staplegun, and we were able to pretty easily get it through a [hubot](https://hubot.github.com/) script called [hubot-spotify-me](https://www.npmjs.com/package/hubot-spotify-me).

If you use Slack at work – or any other instant messaging application – and you don’t use hubot, then I highly recommend you check it out. Not only is it a fun bot that can make your team interactions more lively, but you can program it with some sweet scripts that really boost productivity; that in itself is a topic that warrants its own blog post, so I’ll just stick to discussing the hubot-spotify-me script for now.

If you install this script, then you can trigger it in Slack with the following format:

{{< highlight shell "linenos=table" >}}
hubot spotify me test
> https://open.spotify.com/track/0yA1MBQ60SoiYt7xqdS3H1
{{< / highlight >}}

And it will return to you a spotify URL. If we convert this into a spotify URI (which is simple to do), then all we’re missing is the trigger word **play** in order to automatically issue a webhook request to our crispyfi server to play this song. Well – there’s no simple way to edit the hubot script to reformat the spotify URL and prefix it with the word **play**, so we’ll have to actually edit some code here. Here’s the exact file path and changes you need to make:

![hubot-spotify-changes](https://personal-k8s-main-space.nyc3.cdn.digitaloceanspaces.com/thecodeboss.dev/entries/controlling-spotify-with-slack-and-a-raspberry-pi/hubot-spotify-changes.jpeg)

After you make these changes and deploy them to hubot – you’re good to go! Your new-and-improved spotify hubot command will look like this:

{{< highlight shell "linenos=table" >}}
hubot spotify me test
> play spotify:track:0yA1MBQ60SoiYt7xqdS3H1
{{< / highlight >}}

And this will trigger your outging webhook to perform a request to your crispyfi server! Boom!

Final Thoughts
--------------

This setup is really powerful, and after you get it all in place, you definitely deserve a few beers. There’s a lot of devops work going on here, which is tough stuff. While it’s a really awesome service to have going for our personal team, there are a few things I don’t like.

*   Crispyfi uses libspotify, which is currently the only way to make CLI requests to the Spotify API. Spotify has openly stated that libspotify isn’t actively maintained anymore – BUT they haven’t released an alternate library to take its place yet. How they stopped supporting something without providing a replacement is beyond me – but that’s how it is right now.
*   Crispyfi itself isn’t super maintained either, with a majority of the commits having occured during a few-month period at the end of 2014. Still, it’s the only valid library we could find that accomplished what we needed, and it sure beat spending the several man-hours to build the same thing ourselves!

Even with these concerns, this setup is a game changer. To fully control all of our music (play, pause, control volume, manage playlists, etc.), we now just issue commands in a Slack channel, and it happens instantly. There’s no single way that works better for us, and I bet you’ll discover the same thing too for your team. Plus – this way we can Rick Roll our team if one of us is working from home!
