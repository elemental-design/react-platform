# Astryx inspired portable recipe

This Button demonstrates component recipes and semantic theme values across core hosts. It is not a port of Astryx, and the palette is locally authored. Bind `createButton` to core's web, native or Figma entry. The Figma adapter uses `SnapshotProvider` for a selected pressed state.

`buttonManifest` is a serializable agent interface: component identity, typed parameters, defaults, allowed variants, concrete theme tokens, target limitations and named fixtures. The generated `button.manifest.json` is ready to inspect without evaluating React code. Run `pnpm --filter @react-platform/core exec node scripts/manifest.mjs > packages/core/examples/astryx-inspired/button.manifest.json` from the repository root to regenerate it; tests detect drift. `example:manifest` emits the same JSON to stdout. Agents can choose supported props and regenerate fixtures instead of inventing arbitrary CSS.

The recipe and manifest are a first interface fixture. Loom integration should emit this information from Loom's existing component IR and token source; it should not require agents to maintain duplicate manifests by hand. Loom remains responsible for authoring validation and deterministic generation. This example does not install or modify Loom or Astryx.

Run `pnpm --filter @react-platform/core example:figma` to generate `button-gallery.figma.json` for the separate Figma importer. The file uses fixed metadata for reproducible output and includes the named manifest fixtures. Generation does not modify a live Figma document.
