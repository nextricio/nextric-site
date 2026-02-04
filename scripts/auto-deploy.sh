#!/bin/bash

# Autonomous deployment script for nextric.io
# Run by dev-builder agent to publish content automatically

set -e

# Load environment
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$SCRIPT_DIR/../.env" ]; then
    source "$SCRIPT_DIR/../.env"
fi

# Configuration
SITE_DIR="/root/.openclaw/workspace/mission-control/nextric-site"
CONTENT_DIR="/root/.openclaw/workspace/mission-control/content"
POSTS_DIR="$SITE_DIR/_posts"
GITHUB_URL="https://${GITHUB_USERNAME}:${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/${GITHUB_REPO}.git"

echo "🚀 Nextric Auto-Deploy Starting..."
echo "📅 $(date)"

# Check for content to deploy
if [ ! -d "$CONTENT_DIR" ] || [ -z "$(ls -A $CONTENT_DIR/*.md 2>/dev/null)" ]; then
    echo "ℹ️ No new content to deploy"
    exit 0
fi

cd "$SITE_DIR"

# Configure git for automated commits
git config user.name "${GIT_AUTHOR_NAME:-Nextric Dev Bot}"
git config user.email "${GIT_AUTHOR_EMAIL:-dev@nextric.io}"

# Ensure remote uses token
if [ -n "$GITHUB_TOKEN" ]; then
    git remote set-url origin "$GITHUB_URL"
fi

# Pull latest changes first
echo "⬇️ Pulling latest changes..."
git pull origin main --no-rebase || true

# Process and deploy content files
DEPLOY_COUNT=0
for file in "$CONTENT_DIR"/*.md; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        
        # Extract date from frontmatter or use today
        if grep -q "^date:" "$file"; then
            post_date=$(grep "^date:" "$file" | head -1 | sed 's/date: *//' | sed 's/"//g' | cut -d' ' -f1)
        else
            post_date=$(date +%Y-%m-%d)
        fi
        
        # Create Jekyll filename
        jekyll_name="${post_date}-${filename}"
        
        # Copy to posts
        cp "$file" "$POSTS_DIR/$jekyll_name"
        echo "✅ Published: $jekyll_name"
        
        # Remove from source
        rm "$file"
        ((DEPLOY_COUNT++))
    fi
done

if [ $DEPLOY_COUNT -eq 0 ]; then
    echo "ℹ️ No new content deployed"
    exit 0
fi

# Commit and push
echo ""
echo "📤 Committing and pushing..."
git add _posts/
git commit -m "Auto-deploy: $DEPLOY_COUNT articles ($(date +%Y-%m-%d_%H:%M))"
git push origin main

echo ""
echo "✅ Deployment complete!"
echo "🌐 Site will update at: https://nextric.io"
echo "⏱️  Allow 1-2 minutes for GitHub Pages to build"
echo ""
echo "📊 Deployed $DEPLOY_COUNT article(s)"