# Cascading Color Systems

[Demo Site](https://cascading-colors.netlify.app/)

Generate dynamic and themable color palettes using CSS custom properties,
and allow (persistent) user-adjustments with a bit of light-weight JS.

We provide both the Sass,
and a pre-built CSS file.
Both allow adjustments to default settings --
but only the Sass files can change how many colors are generated.

## Installation & Requirements

Download the files from [GitHub][gh],
or install using npm or yarn:

```bash
npm install cascading-color-systems --save-dev
yarn add cascading-color-systems --dev
```

### CSS (minimal configuration)

The default configuration can be used as plain CSS:

```css
/* css */
@import "<path-to>/cascading-color-systems/css/ccs.css";
```

```html
<!-- html -->
<link src="<path-to>/cascading-color-systems/css/ccs.css" rel="stylesheet" />
```

You can copy that file anywhere you want,
and it works without dependencies.

### Sass (full configuration)

If you want to use the Sass features,
you will need [Dart-Sass][sass] `v1.23+`
(which may still be in Beta).
This was partially an experiment
in the latest Sass feature: Modules.

Import using the new module import syntax:

```scss
@use '<path-to>/cascading-color-systems/' as ccs with (
  /* configuration options */
);
```

[gh]: https://github.com/oddbird/cascading-color-system/
[sass]: https://www.npmjs.com/package/sass

## Getting started

### CCS Root

Both imports generate
core configuration options
as CSS custom properties
(set by Sass when applicable) eg:

```scss
[data-ccs="root"] {
  --ccs-prime--config: 330;
  --ccs-lightness--config: 50%;
  --ccs-saturation--config: 50%;
  --ccs-contrast--config: 50%;
  --ccs-fade-background--config: 0.9;
}
```

Add the `data-ccs='root'` attribute to your `html` element
in order to make your Cascading Colors configuration
available to an entire page.
This attribute will also be used by JavaScript
to apply dynamic user settings globally.

### CCS Color Attributes

Custom properties only re-calculate
where they are defined --
so we've created a
`[data-ccs-colors]` attribute,
which can be applied anywhere
new colors are needed.

We configure the default `color` and `background-color` settings:

```scss
[data-ccs-colors] {
  background-color: var(--ccs-background, var(--ccs--bg-full));
  color: var(--ccs-color, var(--ccs--fg-full));
}
```

Along with fallback values for light/dark modes,
in case CSS custom properties are not supported:

```scss
[data-ccs-colors],
[data-ccs-colors="light"] {
  background-color: $fallback-light;
  color: $fallback-dark;
}

[data-ccs-colors="invert"],
[data-ccs-colors="dark"] {
  background-color: $fallback-dark;
  color: $fallback-light;
}
```

You can override the default colors and backgrounds
by defining `--ccs-color` and `--ccs-background`:

```scss
[data-ccs-colors] {
  --ccs-background: var(--ccs-neutral--bg-full);
  --ccs-color: var(--ccs-neutral--fg-full);
}
```

This attribute generates all your colors as custom properties:

- `--ccs-prime`, `--ccs-*`:
  Colors generated from the given `$hues`, `$saturation`, and `$lightness` --
  along with any `neutral` colors,
  which will use their own customizable (low) `$saturation`
- `--ccs-*--fg-full` :
  All color hues get a full-contrast foreground
- `--ccs-*--bg-full` :
  All color hues get a full-contrast background
- `--ccs--bg-full` white or black, depending on light/dark mode
- `--ccs--fg-full` white or black, depending on light/dark mode

We also provide the color attributes needed
to generate a larger palette:

- `--ccs-h--*`:
  the calculated hue for each color,
  afterresolving user-settings, theme-settings, and global configuration
- `--ccs-contrast`:
  the calculated contrast range
  based on theme, user, and global settings
- `--ccs-l`, `--ccs-l--<fg | bg>-contrast`:
  the calculated base lightness (user, theme, global)
  and full-contrast fg/bg values
- `--ccs-s`, `--ccs-s--<fg | bg>-contrast`:
  the calculated base saturation (user, theme, global)
  and full-contrast fg/bg values
- `--ccs-mode`:
  the calculated light (`1`) or dark (`-1`) mode
  (user, theme, html, or system preference)
- `--ccs-invert` the opposite of CCS-mode

You can pass explicit light/dark mode overrides in html
by including a value with the attribute:

```html
<section data-ccs-colors="light">
  <!-- light background, dark foreground -->

  <div data-ccs-colors="invert">
    <!-- invert the colors (can't be nested multiple times) -->
  </div>
</section>

<section data-ccs-colors="dark">
  <!-- dark background, light foreground -->
</section>
```

### CCS Color Palettes

More complex color palettes have to be generated in Sass,
based on the number of `$steps` desired
to get from the base colors to their full-contrast versions.

If you import the static CSS file,
we generate a palette based on the default settings,
with 4 steps in either direction.
Each step is named `--ccs-<hue>--<direction><step>`,
eg `--ccs-prime--fg1`, or `--ccs-accent--bg3`.

### Creating Themes

Themes can be used to pre-set any color values
(especially the accent hue),
and even show/hide user customization controls.
We provide several built-in themes,
and you can add your own
using the `[data-ccs-theme]` attribute:

```scss
[data-ccs-theme="complement"] {
  /* set the accent color 180 degrees off the primary color */
  --ccs-accent--theme: calc(var(--ccs-h--prime) + 180);
}

[data-ccs-theme="triad"] {
  /* triad logic */
}
```

### Sass Configuration

In most cases,
you'll want to define the `prime` hue,
and possibly a few other options --
and then trigger a build from the module itself.
Here's the code from one of my sites:

```scss
@use "../../node_modules/cascading-color-systems/" as ccs with (
  $hues: 120, // shorthand for setting the prime hue only
  $saturation: 70%,
  $contrast: 48%,
  $steps: 6,
  $fade-background: 15%,
  $fades: 0.75,
  $build: true,
);
```

The `$build: true` configuration
will generate CSS output based on your settings.
I recommend that for most use-cases,
but you can leave that out
and apply individual mixins:

```scss
[data-ccs-colors] {
  @include colors;
}
```

### User Settings & JavaScript

The provided JS
can be hooked up to a form
to accept user-input,
generate custom properties based on their input,
store their preferences in `localStorage`,
or revert back to the configured site defaults.

Use the `dist.js` UMD module directly in a browser:

```html
<script type="text/javascript" src="dist.js"></script>
<script type="text/javascript">
  ccs.default();
</script>
```

Or import and use `index.js`,
if you have a modern build system with ES Module support:

```js
import ccs from "cascading-color-systems";

ccs();
```

We provide several hooks for the JS to use

- `[data-ccs="root"]`:
  where user settings should be applied
- `[data-ccs="menu"]`:
  if you hide the settings by default,
  we'll show them when the JS is available
- `[data-ccs-input="mode"]`:
  a button to toggle light/dark modes
- `[data-ccs-input="unset"]`:
  a button to unset all user preferences
  and clear related local storage
- `[data-ccs-input="theme"]`:
  Allow users to select from available `theme` options
- `[data-ccs-input="hue"]`:
  Allow users to change the primary hue
- `[data-ccs-input="saturation"]`:
  Allow users to adjust the baseline saturation
- `[data-ccs-input="lightness"]`:
  Allow users to adjust the baseline lightness
- `[data-ccs-input="contrast"]`:
  Allow users to adjust the contrast range

Themes can also use the `[data-ccs-field]` on wrappers,
to show and hide inputs/labels directly in the CSS
based on a given theme.
For example, a high-contrast theme
might not accept `contrast` input:

```scss
[data-ccs-theme="contrast"] {
  --ccs-contrast: 200%; /* override all other contrast settings */
  --ccs-custom-contrast: none; /* hide [data-ccs-field="contrast"] */
}
```
