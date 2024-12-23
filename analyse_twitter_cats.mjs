/**
 * Extract and analyze Twitter replies to the Cats challenge here:
*    https://t.me/Cats_housewtf/250
 * Programmer: @NabiKAZ (https://twitter.com/NabiKAZ)
 * Channel: https://t.me/BotSorati
 * Game link: https://t.me/catsgang_bot/join?startapp=2q1VC6ZdOAuQnAFKSOv1k
**/

/////////////////////////////////////////
// Find and enter these values ​​from your Twitter request headers:
const tweetId = "1869804995517837417";
const token = "...";
const cookies = "...";
const xCsrfToken = "...";
/////////////////////////////////////////

import fs from 'fs';
import fetch from 'node-fetch';
import Table from 'cli-table';

async function fetchComments(cursor = null) {

    const variables = { "focalTweetId": tweetId, "with_rux_injections": false, "rankingMode": "Relevance", "includePromotedContent": true, "withCommunity": true, "withQuickPromoteEligibilityTweetFields": true, "withBirdwatchNotes": true, "withVoice": true };
    const features = { "profile_label_improvements_pcf_label_in_post_enabled": false, "rweb_tipjar_consumption_enabled": true, "responsive_web_graphql_exclude_directive_enabled": true, "verified_phone_label_enabled": false, "creator_subscriptions_tweet_preview_api_enabled": true, "responsive_web_graphql_timeline_navigation_enabled": true, "responsive_web_graphql_skip_user_profile_image_extensions_enabled": false, "premium_content_api_read_enabled": false, "communities_web_enable_tweet_community_results_fetch": true, "c9s_tweet_anatomy_moderator_badge_enabled": true, "responsive_web_grok_analyze_button_fetch_trends_enabled": true, "articles_preview_enabled": true, "responsive_web_edit_tweet_api_enabled": true, "graphql_is_translatable_rweb_tweet_is_translatable_enabled": true, "view_counts_everywhere_api_enabled": true, "longform_notetweets_consumption_enabled": true, "responsive_web_twitter_article_tweet_consumption_enabled": true, "tweet_awards_web_tipping_enabled": false, "creator_subscriptions_quote_tweet_preview_enabled": false, "freedom_of_speech_not_reach_fetch_enabled": true, "standardized_nudges_misinfo": true, "tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled": true, "rweb_video_timestamps_enabled": true, "longform_notetweets_rich_text_read_enabled": true, "longform_notetweets_inline_media_enabled": true, "responsive_web_enhance_cards_enabled": false };
    const fieldToggles = { "withArticleRichContentState": true, "withArticlePlainText": false, "withGrokAnalyze": false, "withDisallowedReplyControls": false };

    if (cursor) variables.cursor = cursor;

    const query = new URLSearchParams({
        variables: JSON.stringify(variables),
        features: JSON.stringify(features),
        fieldToggles: JSON.stringify(fieldToggles)
    }).toString();

    const url = `https://x.com/i/api/graphql/iP4-On5YPLPgO9mjKRb2Gg/TweetDetail?${query}`;
    const response = await fetch(url, {
        headers: {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9,fa;q=0.8,de;q=0.7",
            "authorization": `Bearer ${token}`,
            "content-type": "application/json",
            "priority": "u=1, i",
            "sec-ch-ua": "\"Google Chrome\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-csrf-token": xCsrfToken,
            "x-twitter-active-user": "yes",
            "x-twitter-auth-type": "OAuth2Session",
            "x-twitter-client-language": "en",
            "cookie": cookies,
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        method: 'GET',
    });

    const data = await response.json();
    return data;
}

async function extractComments() {
    let cursor = null;
    const allComments = [];

    process.stdout.write("Loading");
    do {
        process.stdout.write(".");

        const data = await fetchComments(cursor);

        const comments = data.data.threaded_conversation_with_injections_v2.instructions
            .flatMap(inst => inst.entries)
            .filter(entry => entry?.content.entryType === "TimelineTimelineModule")
            .flatMap(entry => entry.content.items.map(item => {
                const tweet = item.item.itemContent.tweet_results?.result;
                if (!tweet) return null;
                return {
                    user: tweet?.core.user_results.result?.legacy.screen_name,
                    date: tweet?.legacy.created_at,
                    likes: tweet?.legacy.favorite_count,
                    replies: tweet?.legacy.reply_count,
                    text: tweet?.legacy.full_text,
                };
            }))
            .filter(comment => comment !== null);

        allComments.push(...comments);

        const cursorEntry = data.data.threaded_conversation_with_injections_v2.instructions
            .flatMap(inst => inst.entries)
            .find(entry => entry?.entryId.startsWith("cursor-bottom"));

        cursor = cursorEntry ? cursorEntry.content.itemContent.value : null;

    } while (cursor);

    return allComments;
}

// Get comments online
const comments = await extractComments();

// Read comments from the file
// const comments = JSON.parse(fs.readFileSync("./comments.json"));

// Write commenets in the file
// fs.writeFileSync("./comments.json", JSON.stringify(comments, null, 4));

// Sort comments by replies in descending order, then by date in ascending order
comments.sort((a, b) => {
    if (a.replies !== b.replies) return a.replies - b.replies;
    return new Date(a.date) - new Date(b.date);
});

// Sort comments by date in descending order, then by replies in ascending order
// comments.sort((a, b) => {
//     const dateDiff = new Date(a.date) - new Date(b.date);
//     if (dateDiff !== 0) return dateDiff;
//     return a.replies - b.replies;
// });

const table = new Table({
    head: ['#', 'User', 'Date', 'replies', 'likes'],
});

comments.forEach((comment, index) => {
    table.push([index + 1, comment.user ?? '', comment.date ?? '', comment.replies ?? '', comment.likes ?? '']);
});

console.log('')
console.log(table.toString());
