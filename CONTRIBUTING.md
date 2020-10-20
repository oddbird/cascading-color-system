# Contributing

Run `yarn` to install dependencies…

## Organization

- `css/`: GENERATED CSS for use without a build step
- `docs/`: GENERATED SassDoc/Herman documentation
- `sass/`: the tool itself
  - `config/`: all the use-defined variables
  - `partials/`: all the logic and output
  - `_ccs.scss`: forwards the combined Sass module
  - `_output.scss`: generates the default CSS output
- `demo/`: demo site (also used for testing)
- `_index.scss`: root-level index file for importing the module

## Development

The following scripts can help you work:

- `yarn build-sass`: compiles the `output` file to `css/ccs.css`
- `yarn build-docs`: compiles SassDoc/Herman documentation
- `yarn build-js`: compiles `dist.js` for packaging
- `yarn build-demo`: compiles the demo site styles
- `yarn build` or `yarn commit`: all the build steps at once
- `yarn watch`: a watcher for the site styles

## Process

1. Create a new branch for each feature/bug being addressed
2. Make any changes required
3. Update inline documentation as you go
4. Document changes in [CHANGELOG.md](https://github.com/oddbird/cascading-color-system/blob/main/CHANGELOG.md)
5. Run `yarn commit`
6. Commit your changes
7. Create a Pull Request on GitHub

## Release

1. Update `package.json`
2. Run `yarn commit` to update generated docs
3. Commit and push changes
4. Create release through GitHub UI
5. Pull changes, and `npm publish`
