# Testing RSS Feeds Guide

This guide will help you test the posts feature with multiple RSS feeds.

## Step 1: Run the Database Migration

First, apply the new posts table migration:

```bash
npm run db:migrate
```

This will create the `posts` table in your database.

## Step 2: Set Up a User (if not already done)

```bash
npm start register <username>
npm start login <username>
```

## Step 3: Add RSS Feeds

Add several RSS feeds to test with. Here are some popular RSS feeds you can use:

### News & Tech Feeds:
```bash
npm start addfeed "Hacker News" "https://hnrss.org/frontpage"
npm start addfeed "BBC News" "http://feeds.bbci.co.uk/news/rss.xml"
npm start addfeed "TechCrunch" "https://techcrunch.com/feed/"
npm start addfeed "The Verge" "https://www.theverge.com/rss/index.xml"
npm start addfeed "Ars Technica" "https://feeds.arstechnica.com/arstechnica/index"
```

### Developer Feeds:
```bash
npm start addfeed "GitHub Blog" "https://github.blog/feed/"
npm start addfeed "Stack Overflow Blog" "https://stackoverflow.blog/feed/"
npm start addfeed "CSS-Tricks" "https://css-tricks.com/feed/"
```

### Other Popular Feeds:
```bash
npm start addfeed "Reddit Programming" "https://www.reddit.com/r/programming/.rss"
npm start addfeed "XKCD" "https://xkcd.com/atom.xml"
npm start addfeed "NASA" "https://www.nasa.gov/rss/dyn/breaking_news.rss"
```

**Note:** When you add a feed, you automatically follow it, so you don't need to run `follow` separately.

## Step 4: Verify Your Feeds

Check that your feeds are registered:

```bash
npm start feeds
```

Check which feeds you're following:

```bash
npm start following
```

## Step 5: Run the Aggregator

Now run the aggregator to fetch and save posts from all your feeds. The aggregator will:
- Fetch feeds one at a time
- Parse posts from each feed
- Save posts to the database (skipping duplicates)
- Show progress for each feed

Run it with a time interval between requests (e.g., 5 seconds):

```bash
npm start agg 5s
```

Or for a longer interval (e.g., 1 minute):

```bash
npm start agg 1m
```

The aggregator will:
- Run immediately once
- Then continue fetching feeds at the specified interval
- Press `Ctrl+C` to stop

You should see output like:
```
Collecting feeds every 5s
Feed Hacker News: saved 30 posts, skipped 0 duplicates
Feed BBC News: saved 25 posts, skipped 0 duplicates
...
```

## Step 6: Browse Your Posts

View the latest posts from all your followed feeds:

```bash
# View default 2 posts
npm start browse

# View 10 posts
npm start browse 10

# View 50 posts
npm start browse 50
```

The output will show:
- Feed name in brackets
- Post title
- Post URL
- Description (if available, truncated to 100 chars)
- Published date (if available)

## Step 7: Test Different Scenarios

### Test Duplicate Handling
Run the aggregator again - it should skip posts that already exist:

```bash
npm start agg 5s
```

You should see "skipped X duplicates" messages.

### Test with Different Feed Formats
Try feeds with different date formats, missing descriptions, etc. The parser should handle:
- ISO 8601 dates
- RFC 2822 dates
- Missing descriptions
- Missing published dates

### Test Browse Limits
Try different limit values:
```bash
npm start browse 1
npm start browse 5
npm start browse 20
```

## Troubleshooting

### If migration fails:
- Make sure your database is running
- Check your `.gatorconfig.json` has the correct `db_url`
- Verify the migration file exists: `src/lib/db/migrations/0004_add_posts.sql`

### If feeds fail to fetch:
- Check your internet connection
- Some feeds may require authentication or have rate limits
- Check the feed URL is valid by visiting it in a browser

### If no posts appear:
- Make sure you've run the aggregator (`agg` command)
- Verify you're following feeds (`following` command)
- Check that feeds were successfully fetched (look for "saved X posts" messages)

## Example Complete Workflow

```bash
# 1. Run migration
npm run db:migrate

# 2. Register and login
npm start register testuser
npm start login testuser

# 3. Add some feeds
npm start addfeed "Hacker News" "https://hnrss.org/frontpage"
npm start addfeed "XKCD" "https://xkcd.com/atom.xml"
npm start addfeed "GitHub Blog" "https://github.blog/feed/"

# 4. Verify
npm start following

# 5. Fetch posts (run for a bit, then Ctrl+C)
npm start agg 10s

# 6. Browse posts
npm start browse 10
```

Happy testing! 🎉