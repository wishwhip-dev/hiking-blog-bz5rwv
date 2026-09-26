# Plan

Goal: A blog about my hiking trips: posts with a title, date, photos and tags, a list of all posts newest first, and a page per post.

1. Six posts exist under app/posts/<slug>/ (lowercase hyphenated slugs), each about a distinct named hike, each with a meta.json holding a title, one-sentence blurb, a published date in YYYY-MM-DD format spread across at least a year, and 2–4 tags, and each reachable at its own /posts/<slug> route
2. The generated index at / lists all six posts ordered newest first by date, and each entry shows the title, the formatted publication date, the blurb and the tag badges
3. Each post page opens with the PostHeader block showing its title, publication date and tags before any body content, and every tag shown anywhere on a post (header and body) is a link to that tag's listing page
4. At least 16 scenic SVG illustrations live in public/ covering varied terrain — summit ridgelines, alpine lakes, forest, meadows, river crossings — and each post displays 2–4 of them inline via next/image, each with a caption naming the place or moment shown and alt text describing the scene
5. Every post sets "prose": true in its meta.json and reads as a photo essay: at least four sections of narrative prose with a photo, table or callout breaking the text so no more than two consecutive paragraphs run without one
6. Each post contains a trail-facts table rendered with the shadcn Table showing five fields for that hike: distance, elevation gain, time on trail, difficulty and best season
7. A /tags/<tag> route exists for at least 8 distinct tags (URL slugs lowercase and hyphenated), listing every post carrying that tag newest first; a tag carried by only one post still renders its page with that single entry, and /tags/<tag-that-does-not-exist> renders the not-found page
8. Each post ends with a 'More trips' section listing the other five posts by title as links to their pages
9. Visiting /posts/<slug-that-does-not-exist> renders the not-found page instead of an error or a blank screen
10. Each post page sets its browser tab title and meta description from its meta.json title and blurb
11. Photos render at a consistent width with their aspect ratio preserved — no stretching or cropping surprises at any viewport — with captions in small muted text beneath each image
12. At a phone-width viewport, the index list, the trail-facts tables and the photos stack into a single readable column with no horizontal scrolling

These are the outcomes this task is judged against.