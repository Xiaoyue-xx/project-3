# Assets

`art.svg` is the original code-native symbol library created for this prototype
and credited to `xiaoyuex_x`. It contains 90 reusable symbols:

- 2 character bases with integrated face and hair details
- 25 upper-body garment layers
- 14 lower-body garment layers
- 10 footwear layers
- 8 weather-protection and accessory layers
- 10 weather icons, including fog and unknown states
- 7 reminder icons
- 6 status icons
- 8 Y2K decorative symbols

`data/assets.js` maps every one of the 90 assembled outfit entries to a character,
lower-body, upper-body, and footwear layer in that z-order. The manifest also
owns three color palettes and the rain, wind, and snow protection overrides.

Run `npm run preview:assets` to generate representative and 90-entry contact-sheet
SVGs in the operating system's temporary directory. The responsive development
gallery is available at `/dev/asset-gallery.html` while the local server runs.

Reference images remain in `reference/` and are not shipped as application artwork.
