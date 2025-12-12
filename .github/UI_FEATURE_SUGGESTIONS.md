# UI Improvements & Feature Suggestions

## Visual / Accessibility Improvements

- Improve color contrast across the app: darker primary text, higher-contrast buttons, and temperature color cues (hot = warm color, cold = cool color).
- Add accessible labels to interactive elements (buttons, city list items).
- Offer a dark theme toggle and follow system theme by default.
- Increase tappable areas and use `IconButton` for delete actions to avoid nested touchable issues.
- Provide larger text option in settings for accessibility.

## UX Improvements

- Add a visible "Primary city" or "Pinned" indicator on the Cities list.
- Add swipe-to-delete for cities in the list with confirmation.
- Add pull-to-refresh on Home and Forecast views (already supported on Forecast via RefreshControl).
- Animate transitions between tabs for smoother feedback.

## New Features to Consider

- Favorite/pin cities and reorder via drag-and-drop.
- Weather notifications for severe alerts and daily summary.
- Offline cache indicator and manual cache refresh.
- Share current weather snapshot via system share sheet.
- Multi-city comparison screen (side-by-side cards).
- Map view to pick a city directly on a map.
- Widgets (Android/iOS) showing current temp for primary city.

## Small Technical Suggestions

- Add a settings screen for units, theme, and notification preferences.
- Add simple analytics events for city selection and app start to help prioritize features.
- Externalize colors into a single `theme` or `colors` file for consistency.

If you'd like, I can implement a dark theme toggle and extract colors into a `src/utils/theme.ts` file next. Want me to proceed with that?
