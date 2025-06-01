# EMOJI ANALYTICS SYSTEM

*Created: May 25, 2025*

## OVERVIEW

The Emoji Analytics System is an extension to the Custom Emoji System that collects, analyzes, and visualizes emoji usage data in Snakkaz Chat. It provides insights into how users interact with emojis, which emojis are most popular, and how emoji usage evolves over time.

## COMPONENTS

### Database Structure

The system uses a dedicated `emoji_analytics` table with the following structure:

```sql
CREATE TABLE emoji_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  emoji_id UUID NOT NULL REFERENCES custom_emojis(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  message_id UUID NOT NULL,
  usage_type TEXT NOT NULL CHECK (usage_type IN ('message', 'reaction')),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB
);
```

A database view called `emoji_usage_stats` provides aggregated statistics:

```sql
CREATE VIEW emoji_usage_stats AS
SELECT 
  e.id AS emoji_id,
  e.shortcode,
  e.name,
  e.category,
  e.usage,
  COUNT(DISTINCT ea.user_id) AS unique_users,
  COUNT(DISTINCT CASE WHEN ea.usage_type = 'reaction' THEN ea.id ELSE NULL END) AS reaction_count,
  COUNT(DISTINCT CASE WHEN ea.usage_type = 'message' THEN ea.id ELSE NULL END) AS message_count,
  MAX(ea.timestamp) AS last_used
FROM 
  custom_emojis e
LEFT JOIN 
  emoji_analytics ea ON e.id = ea.emoji_id
GROUP BY 
  e.id, e.shortcode, e.name, e.category, e.usage;
```

### Utility Functions

The analytics system includes several utility functions in `/src/utils/emojiAnalyticsUtils.ts`:

1. **trackEmojiInMessage** - Records emoji usage in messages
2. **trackEmojiInReaction** - Records emoji usage in reactions
3. **getEmojiStats** - Retrieves usage statistics for a specific emoji
4. **getTopEmojis** - Gets the most frequently used emojis
5. **getEmojiUsageOverTime** - Analyzes emoji usage patterns over time

### Integration Points

The analytics system integrates with the Custom Emoji System at the following points:

1. **Message Composition** - When an emoji is inserted in message text
2. **Message Reactions** - When an emoji is used as a reaction
3. **Emoji Picker** - Usage data influences search results and recommendations

## USAGE TRACKING

The system collects the following data points:

- **Which emoji** was used (emoji_id)
- **Who** used it (user_id)
- **Where** it was used (message_id)
- **How** it was used (as a reaction or in message text)
- **When** it was used (timestamp)

This data is collected anonymously and used only for improving the emoji system. No personal messaging content is stored with this data.

## PRIVACY CONSIDERATIONS

The analytics system respects user privacy:

1. Only emoji IDs are stored, not the actual messages they appear in
2. Row-level security ensures users can only insert their own analytics data
3. Aggregated data is used for general insights, not individual user tracking
4. All tracking is opt-out by default through user settings

## SEARCH ENHANCEMENT

The emoji analytics data directly enhances the search functionality:

1. More frequently used emojis receive higher search ranking
2. Recently used emojis appear in the "Recent" tab
3. Personal usage patterns influence search results
4. Popular emojis may be suggested when no search query is present

## ADMINISTRATIVE FEATURES

For workspace administrators, the system provides:

1. **Dashboard** showing emoji usage across the workspace
2. **Reports** on most popular emojis
3. **Trending** data showing changing emoji popularity
4. **Usage patterns** to inform decisions about emoji packs

## IMPLEMENTATION NOTES

### Data Collection

Analytics data is captured at two key points:

1. In the `useEmojiReactions` hook when reactions are added
2. In message text processing before sending messages

### Optimization

To minimize performance impact:

1. Analytics writes happen asynchronously
2. Batch processing is used for high-volume events
3. Indexes are created on frequently queried columns
4. Aggregated data is cached where appropriate

### Migration

The analytics system requires a database migration that:

1. Creates the `emoji_analytics` table
2. Sets up appropriate indexes
3. Implements RLS policies
4. Creates the `emoji_usage_stats` view

Run the migration using:
```bash
./apply-emoji-analytics-migration.sh
```

## MONITORING AND MAINTENANCE

Regular maintenance tasks include:

1. **Data pruning** - Old analytics data may be aggregated and purged
2. **Index optimization** - As the table grows, indexes may need tuning
3. **Usage reports** - Monthly reports can help identify trends
4. **Anomaly detection** - Unusual patterns might indicate spam or abuse

---

*Documentation last updated: May 25, 2025*
