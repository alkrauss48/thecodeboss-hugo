---
title: Using GeoJSON files with Google Maps API
date: "2014-09-18"
categories:
- Blog
tags:
- Javascript
- Front End
draft: "false"
---
Some of you may be familiar with using the client-side [Google Maps API](https://developers.google.com/maps/ "Google Maps API") in your site’s javascript. It’s easily the top-of-the-line API for rendering geographical images and data, and so easy to use. Google even provides you with a developer-friendly tool to style your maps – no prior CSS knowledge necessary. As web pages become more interactive, including these types of maps into your sites will become more and more ubiquitous (even for plain static sites).

To show you how simple it is, let’s just create a basic html page:

{{< highlight html "linenos=table" >}}
<div id="map_canvas" style="display: block; height: 100%;"></div>
<script src="https://maps.googleapis.com/maps/api/js?sensor=false"></script>
<script>
  // Set basic map attributes
  var mapOptions = {
    zoom: 5,
    center: new google.maps.LatLng(39.16,-100.72)
  };

  var map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
</script>
{{< / highlight >}}

And wallah, we’ve built and are rendering a Google Map.

You can even add markers on to the map, which would allow you to indicate specific data points at certain geographic locations. These markers can be any shape too, and if you’re an artist, then you can specify SVG-like paths to get a really fancy marker. We won’t go into markers though, as that’s all well documented by Google.

While the Google Maps API is certainly awesome though, it has its limitations – specifically with coloring or highlighting plots of land that you would like to ‘stand out’ from the rest. Maybe you want to show which US states are more Republican vs Democratic, or maybe you want to show which countries in Europe you’ve visited, or perhaps you even want to show which provinces in China you purchase tea from (yes, [I am guilty here](/2014/06/where-i-buy-tea/ "Where I Buy Tea")). By just using the naked Google Maps API libraries, this is impossible. But we don’t like to accept the word ‘impossible,’ and lo and behold, there is in fact a way to do this using some vary fancy files dubbed as **GeoJSON**.

What are GeoJSON files?
-----------------------

I’m glad you asked. Per Wikipedia, GeoJSON is an open standard format for encoding collections of simple geographical features along with their non-spatial attributes using JSON. What this means is that you can specify collections of lat/long points in a JSON file that is representative of a plot of land. Since they’re usually written in lat/long values, you can be sure that you’ll get the same result no matter what map API you’re using. Here’s an example of a .geo.json file that diagrams the state of Arkansas:

{{< highlight json "linenos=table" >}}
{
  "type":"FeatureCollection",
  "features":[
    {
      "type":"Feature",
      "id":"USA-AR",
      "properties":{"fips":"05","name":"Arkansas"},
      "geometry":{
        "type":"Polygon",
        "coordinates":[[[-94.473842,36.501861],[-90.152536,36.496384],... ]]
      }
    }
  ]
}
{{< / highlight >}}

Now you’re probably thinking “That’s cool, but what good does this do me?” While Google can’t specifically highlight plots of land on its own, it does have support for loading .geo.json files into your map and styling them however you want. This means that we can accomplish what we wanted to earlier: coloring in states, countries, or anything really. Here’s how we could include this arkansas.geo.json file into our existing map from above:

{{< highlight javascript "linenos=table" >}}
map.data.loadGeoJson('./arkansas.geo.json');
{{< / highlight >}}

And that’s it! This will insert the data from our .geo.json file into our map’s data – you probably won’t notice anything though because we don’t have any fill color. Let’s add some highlighting to this data:

{{< highlight javascript "linenos=table" >}}
// Overlay Styles
map.data.setStyle({
  fillColor: '#2687bf',
  fillOpacity: .3,
  strokeWeight: 0
});
{{< / highlight >}}

Perfect, now our map will specifically color in the state of Arkansas with a translucent blue. And that’s about all there is to it – now you can create Google Maps that highlight any plot of land you want. To see an example of everything we’ve discussed here, check out my demo down below.

Where to get GeoJSON files?
---------------------------

You may be left with a question right about now: “Where am I supposed to find the GeoJSON files I need?” And that’s a good question. Luckily, an awesome developer gathered GeoJSON files for every single country in the world, and if you’re wanting to map out the USA, he even gathered GeoJSON files for every single state AND its cities, all inside of a public GitHub repo.

Check it out here: [https://github.com/johan/world.geo.json](https://github.com/johan/world.geo.json)

* * *

Live Demo
---------

[Check out my demo](http://labs.thecodeboss.dev/geojson-demo/ "GeoJSON Demo") of using GeoJSON with the Google Maps API.

The [source code](https://github.com/alkrauss48/labs/tree/master/geojson-demo) is freely available too.
