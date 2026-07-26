# HotGames.ai Home Discovery Update

Date: 2026-07-26

## What Changed

- Rebuilt the homepage as a compact game discovery interface.
- Added unified search across game names, descriptions, genres, and platforms.
- Added category filters for Browser, Puzzle, Action, RPG, and IO games.
- Added device-local Saved Games and Recently Played sections.
- Added controls to clear device-local saved and recent game history.
- Added a Surprise Me action that selects from the current visible results.
- Added a dedicated browser puzzle area for Blockzzle, Ringzzle, and DaySudoku.
- Added internal detail links for all three first-party browser puzzle games.
- Consolidated repeated game card markup into a shared Hugo partial.
- Improved desktop, tablet, mobile, keyboard, reduced-motion, and theme support.

## Content And SEO

- Updated the homepage title and description to describe browser games and curated picks.
- Reframed unsupported popularity-style labels as factual genre or editorial labels.
- Kept the existing `/trending-games/` route while changing its visible title to `Featured Games`.
- Preserved existing game, post, privacy, terms, contact, sitemap, and filter URLs.

## First-Party Game Distinctions

- Blockzzle remains a block puzzle game about placing pieces and clearing lines.
- Ringzzle remains a color rings puzzle game with matching color lines and Color Burst.
- DaySudoku remains a daily Sudoku game with a Key9-first flow.

## Explicit Non-Changes

- No Blockzzle, Ringzzle, or DaySudoku repository files were changed.
- No iframe, game source code, backend, login, email capture, ads, leaderboard system, database, or API was added.
- No new analytics, JavaScript dependency, npm dependency, or build tool was added.
- No fake ranking, popularity, review, rating, download, or traffic claim was added.
- No generated `public/` or `resources/_gen/` files are intended for commit.
