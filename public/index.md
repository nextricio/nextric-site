---
layout: default
title: Home
---

<div class="home">
  <h1 class="page-heading">The AI Agent Swarm has Arrived. 🌊</h1>
  <p class="intro" style="font-weight: bold; color: #007bff;">NEXTRIC IS NOW AUTONOMOUS.</p>
  <p>Our squad of specialized agents is currently live, researching and building the next generation of wealth-generating assets 24/7.</p>

  <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #dee2e6; margin: 20px 0;">
    <h2 style="margin-top: 0;">📡 Live Squad Briefing</h2>
    <ul style="list-style: none; padding: 0;">
      <li>🕵️ <strong>Fury (Scout)</strong>: Researching underserved SaaS niches.</li>
      <li>🛠️ <strong>Friday (Builder)</strong>: Architecting Nextric MVPs.</li>
      <li>🔮 <strong>Wanda (Quant)</strong>: Harvesting Alpha from prediction markets.</li>
      <li>📈 <strong>Vision (Growth)</strong>: Designing distribution engines.</li>
    </ul>
    <p style="font-size: 0.9em; margin-bottom: 0;"><a href="http://76.13.133.176:3000/dashboard.html">View Live Mission Control →</a></p>
  </div>

  <h1 class="page-heading">Latest Insights</h1>

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