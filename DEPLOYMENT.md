# Auto-deployment configuration

## How It Works

Content written by agents in `/mission-control/content/` is automatically deployed to nextric.io.

## Manual Deployment

```bash
/mission-control/nextric-site/scripts/deploy-content.sh
```

## Automatic Deployment

To enable automatic deployment after each article:

1. Add to content-writer agent's completion script
2. Or set up a cron job to check every hour

## GitHub Actions

The site automatically rebuilds on every push to main branch.

## File Naming

Articles are renamed to Jekyll format: `YYYY-MM-DD-title.md`

## Verification

After deployment, check:
- https://nextric.io (main site)
- https://nextric.io/feed.xml (RSS feed)