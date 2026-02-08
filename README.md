# SolidStart

Everything you need to build a Solid project, powered by [`solid-start`](https://start.solidjs.com);

## Creating a project

```bash
# create a new project in the current directory
npm init solid@latest

# create a new project in my-app
npm init solid@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

Solid apps are built with _presets_, which optimise your project for deployment to different environments.

By default, `npm run build` will generate a Node app that you can run with `npm start`. To use a different preset, add it to the `devDependencies` in `package.json` and specify in your `app.config.js`.

 ## This project was created with the [Solid CLI](https://github.com/solidjs-community/solid-cli)

## Deployment to GitHub Pages

This project includes an automated deployment script for GitHub Pages:

```bash
# Build and deploy with path fixes for GitHub Pages
bun run deploy

# Simple deploy (no path fixes)
bun run deploy:simple

# Clean docs folder
bun run deploy:clean
```

### GitHub Pages Setup

1. Run `bun run deploy` to generate the docs folder with fixed paths
2. Commit and push the docs folder:
   ```bash
   git add docs/
   git commit -m "Deploy to GitHub Pages"
   git push
   ```
3. Go to your repository Settings > Pages
4. Set "Source" to "Deploy from a branch"
5. Set "Branch" to "main" (or your default branch)
6. Set "Folder" to "/docs"
7. Click "Save"

Your site will be available at: `https://lorangeve.github.io/linkswap64/`

### What the deploy script does:
- ✅ Builds the project
- ✅ Copies all static files to `docs/` folder
- ✅ Fixes absolute paths to relative paths for GitHub Pages
- ✅ Creates `.nojekyll` file to bypass Jekyll processing
- ✅ Provides clear next steps
