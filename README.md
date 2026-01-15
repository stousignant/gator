# Gator

Gator is a command-line interface (CLI) tool for aggregating and managing RSS feeds. This project demonstrates the implementation of a multi-user RSS feed aggregator using TypeScript and Node.js, capable of collecting posts from RSS feeds across the internet, storing them in a PostgreSQL database, and allowing users to follow feeds and browse aggregated content.

## Tech Stack

-   **Language**: TypeScript
-   **Runtime**: Node.js
-   **Database**: PostgreSQL
-   **ORM**: Drizzle ORM
-   **Tooling**: npm, tsx
-   **Key Libraries**: `fast-xml-parser` (RSS/XML parsing), `postgres` (database driver)

## Features

-   **User Management**: Register, login, and manage multiple users with persistent sessions.
-   **Feed Management**: Add RSS feeds from across the internet to be collected and stored in the database.
-   **Feed Following**: Follow and unfollow RSS feeds that other users have added, creating a social feed discovery experience.
-   **Automatic Aggregation**: Continuously fetch and store posts from RSS feeds at configurable intervals, preventing duplicate entries.
-   **Post Browsing**: View summaries of aggregated posts in the terminal with links to full articles, filtered by the feeds you follow.
-   **Persistent Storage**: All feeds, posts, and user relationships are stored in a PostgreSQL database for reliable data persistence.

## Achievements & Key Learnings

Building Gator provided valuable experience in:
-   **Database Design**: Designing relational schemas with Drizzle ORM, including users, feeds, posts, and many-to-many relationships (feed follows).
-   **RSS Feed Parsing**: Implementing robust RSS/XML parsing using `fast-xml-parser`, handling various feed formats and edge cases.
-   **CLI Architecture**: Creating a modular command system with middleware support (authentication) and a flexible command registry.
-   **Concurrent Operations**: Managing background feed aggregation with configurable intervals and graceful shutdown handling.
-   **Data Deduplication**: Implementing logic to prevent duplicate posts from being stored when feeds are fetched multiple times.
-   **Configuration Management**: Building a file-based configuration system for database connections and user sessions.

## Getting Started

### Prerequisites

-   **Node.js** (v20+ recommended)
-   **npm**
-   **PostgreSQL** (running instance with a database created)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/stousignant/gator.git
    cd gator
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Set up your configuration file:
    Create a `.gatorconfig.json` file in your home directory with the following structure:
    ```json
    {
      "db_url": "postgresql://username:password@localhost:5432/database_name",
      "current_user_name": ""
    }
    ```
    Replace the `db_url` with your PostgreSQL connection string and leave `current_user_name` empty initially.

4.  Run database migrations:
    ```bash
    npm run db:migrate
    ```

### Usage

Gator uses a command-based interface. The general syntax is:

```bash
npm start -- <command> [args...]
```

#### Available Commands

**User Management:**
-   `register <username>` - Register a new user
-   `login <username>` - Log in as a user
-   `reset` - Reset the current user session
-   `users` - List all registered users

**Feed Management:**
-   `addfeed <name> <url>` - Add a new RSS feed (requires login)
-   `feeds` - List all available feeds

**Following Feeds:**
-   `follow <url>` - Follow an existing feed by URL (requires login)
-   `following` - List all feeds you're currently following (requires login)
-   `unfollow <url>` - Unfollow a feed by URL (requires login)

**Content Browsing:**
-   `browse [limit]` - Browse posts from feeds you follow (requires login)
    -   `limit`: Optional number of posts to display (default: 2)

**Feed Aggregation:**
-   `agg <time_between_reqs>` - Start the feed aggregator
    -   `time_between_reqs`: Time interval between feed fetches (format: `<number><unit>` where unit is `ms`, `s`, `m`, or `h`)
    -   Example: `5m` for 5 minutes, `1h` for 1 hour
    -   Press `Ctrl+C` to stop the aggregator

**Examples:**

```bash
# Register and login
npm start -- register alice
npm start -- login alice

# Add a feed
npm start -- addfeed "Hacker News" "https://hnrss.org/frontpage"

# Follow a feed added by another user
npm start -- follow "https://hnrss.org/frontpage"

# Browse posts
npm start -- browse 10

# Start aggregating feeds every 5 minutes
npm start -- agg 5m
```

## Database Schema

The application uses the following main tables:
-   **users**: Stores user accounts
-   **feeds**: Stores RSS feed metadata (name, URL, creator)
-   **feed_follows**: Many-to-many relationship between users and feeds
-   **posts**: Stores individual posts from RSS feeds with deduplication by URL

## Output

When browsing posts, the tool displays:
-   Feed name in brackets
-   Post title
-   Post URL
-   Post description (truncated to 100 characters if longer)
-   Publication date (if available)

Example output:
```
[Hacker News] Example Post Title
  https://example.com/post
  This is a description of the post...
  Published: 2024-01-15T10:30:00.000Z
```

---
*This project was built as part of the backend engineering curriculum at [Boot.dev](https://www.boot.dev/).*
