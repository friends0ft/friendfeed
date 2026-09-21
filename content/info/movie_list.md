+++
title = "Movie List"
weight = 200
date = "2026-09-19T14:05:00-06:00"

[extra]
uuid = "movie_list"
pinned = true
+++

{% set movies = [

[ "Better Off Dead", "1985" ],
[ "Blues Brothers, The", "1980" ],
[ "Byzantium", "2012" ],
[ "Cabinet of Dr. Caligari, The", "1920" ],
[ "Conjuring 2, The", "2016" ],
[ "Dark Knight, The", "2008" ],
[ "Dracula", "1931, Spanish" ],
[ "Exorcist, The", "1973" ],
[ "Frankenhooker", "1980" ],
[ "Full Metal Jacket", "1987" ],
[ "Good, the Bad and the Ugly, The", "1966" ],
[ "In the Blink of an Eye", "2026" ],
[ "Interview with the Vampire", "1994" ], 
[ "Invasion of the Body Snatchers", "1978" ],
[ "Jojo Rabbit", "2019" ],
[ "Kissed", "1996" ],
[ "Law Abiding Citizen", "2009" ],
[ "Man Who Laughs, The", "1928" ],
[ "Masterminds", "2016" ],
[ "Metropolis", "1927" ],
[ "Momento", "2013" ],
[ "PCU", "1994" ],
[ "Signs", "2002" ],
[ "Underworld", "2003" ],
[ "Yojimbo", "1961" ],

] %}

Here's a list of movies people have recommended for movie night.\
Send me a text message if you have a high quality submission.

<ul class="two-columns">
{% for movie in movies %}
{% if movie[0] is ending_with(pat=", The") %}
	{% set movie = ["The " ~ (movie[0] | trim_end(pat=", The")), movie[1]] %}
{% endif %}
<li>
  {{ movie[0] }}
  <span style="opacity: 0.5; font-size: 0.8em; vertical-align: 0.025em">
    <i>({{ movie[1] }})</i>
  </span>
</li>
{% endfor %}
</ul>
