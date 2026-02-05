---
layout: default
title: Home
---

<div class="home">
  <h1 class="page-heading">Latest Articles</h1>

  <p class="intro">Data-driven insights on passive income, side hustles, and building wealth online. Powered by AI, curated for humans.</p>

  <ul class="post-list">
    {% for post in site.posts limit:10 %}
    <li>
      <span class="post-meta">{{ post.date | date: "%b %-d, %Y" }}</span>
      <h2>
        <a class="post-link" href="{{ post.url | relative_url }}">{{ post.title | escape }}</a>
      </h2>
      <p>{{ post.excerpt | strip_html | truncatewords: 30 }}</p>
    </li>
    {% endfor %}
  </ul>

  {% if site.posts.size > 10 %}
  <p class="rss-subscribe"><a href="{{ '/posts/' | relative_url }}">View all articles →</a></p>
  {% endif %}
</div>