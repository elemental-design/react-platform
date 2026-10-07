import { withRecipe } from './load-recipe.mjs';
await withRecipe(({ buttonManifest }) => process.stdout.write(JSON.stringify(buttonManifest, null, 2) + '\n'));
