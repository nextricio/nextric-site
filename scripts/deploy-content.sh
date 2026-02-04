#!/bin/bash

# Deploy articles from /mission-control/content/ to nextric-site
# Usage: ./scripts/deploy-content.sh

set -e

SOURCE_DIR="/root/.openclaw/workspace/mission-control/content"
SITE_DIR="/root/.openclaw/workspace/mission-control/nextric-site"
POSTS_DIR="$SITE_DIR/_posts"

echo "🚀 Deploying content to Nextric.io..."

# Check if source directory exists
if [ ! -d "$SOURCE_DIR" ]; then
    echo "❌ Source directory not found: $SOURCE_DIR"
    exit 1
fi

# Count markdown files
MD_COUNT=$(find "$SOURCE_DIR" -name "*.md" -type f | wc -l)
echo "📄 Found $MD_COUNT markdown files"

if [ "$MD_COUNT" -eq 0 ]; then
    echo "⚠️ No content to deploy"
    exit 0
fi

# Copy and rename files to Jekyll format
find "$SOURCE_DIR" -name "*.md" -type f | while read -r file; do
    filename=$(basename "$file")
    
    # Extract date from frontmatter or use current date
    if grep -q "^date:" "$file"; then
        post_date=$(grep "^date:" "$file" | head -1 | sed 's/date: *//' | sed 's/"//g' | cut -d' ' -f1)
    else
        post_date=$(date +%Y-%m-%d)
    fi
    
    # Create jekyll filename: YYYY-MM-DD-original-name.md
    jekyll_name="${post_date}-${filename}"
    
    # Copy to posts directory
    cp "$file" "$POSTS_DIR/$jekyll_name"
    echo "✅ Published: $jekyll_name"
    
    # Remove from source (optional - comment out if you want to keep copies)
    rm "$file"
done

echo ""
echo "📝 Committing and pushing..."

cd "$SITE_DIR"

# Check if there are changes
if [ -n "$(git status --porcelain 2>/dev/null)" ]; then
    git add _posts/
    git commit -m "Auto-publish: $(date +%Y-%m-%d_%H:%M:%S)"
    git push origin main
    echo "✅ Deployed successfully!"
else
    echo "⚠️ No changes to commit"
fi

echo ""
echo "🌐 Site will be live at: https://nextric.io"
echo "⏱️  Changes may take 1-2 minutes to appear"