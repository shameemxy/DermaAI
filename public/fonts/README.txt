=====================================================
Silver Editorial Custom Font Setup Instructions
=====================================================

Place your "Silver Editorial" font files in this folder (`/public/fonts/`):

1. `SilverEditorial-Regular.woff2` (or .ttf / .woff)
2. `SilverEditorial-Italic.woff2` (or .ttf / .woff)

Once placed, you can update `app/layout.tsx` to enable localFont loading directly.
Currently, fallback font ("Georgia", serif) is configured so the app renders cleanly even before font files are copied.
