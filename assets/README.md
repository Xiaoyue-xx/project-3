# Assets

The application uses two original code-native SVG symbol libraries created for
this prototype and credited to `xiaoyuex_x`.

`pixel-characters.svg` contains the active 61-symbol character system:

- 4 character bases with integrated face and hair details
- 25 upper-body garment layers
- 14 lower-body garment layers
- 10 footwear layers
- 8 weather-protection and accessory layers

Every active character and wearable uses a shared integer grid, hard-edged
pixel shapes, and common body anchors. `art.svg` retains the non-character
interface artwork plus the earlier symbol definitions:

- 10 weather icons, including fog and unknown states
- 7 reminder icons
- 6 status icons
- 8 Y2K decorative symbols

`scripts/pixel-art.js` loads the character sprite and expands requested layers
into the page SVG before applying palette variables. This avoids Safari
rendering externally styled symbols as black silhouettes while keeping
`pixel-characters.svg` as the single source of character artwork.

`data/assets.js` maps every one of the 180 assembled outfit entries to a character,
lower-body, upper-body, and footwear layer in that z-order. The manifest also
routes active character assets to `pixel-characters.svg`, routes interface art
to `art.svg`, and owns three coordinated color palettes plus the rain, wind, and
snow protection overrides.

Run `npm run preview:assets` to generate representative and 180-entry contact-sheet
SVGs in the operating system's temporary directory. The responsive development
gallery is available at `/dev/asset-gallery.html` while the local server runs.

Reference images remain in `reference/` and are not shipped as application artwork.

## Pixel Y2K theme additions

- `fonts/silkscreen-400.woff2` and `fonts/silkscreen-700.woff2`: Silkscreen by
  Jason Kottke, SIL Open Font License 1.1, self-hosted so no third-party font
  request is made.
- Weather, reminder, and status icons in `art.svg` are now 16×16 pixel grids
  drawn as crisp 4-unit rects (same ids and 64×64 view boxes as before).
- Characters use a relaxed, asymmetric body: head scaled to 88%, visible neck,
  sloped shoulders, waist/hip shaping, bent elbows, larger hands, defined
  knees, and smaller shoes. A per-layer `pixel-shade` SVG filter adds bevel
  shading; garments, lowers, footwear, and head accessories were refit to it.
