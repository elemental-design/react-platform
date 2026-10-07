# React Platform

Read `docs/architecture.md` and the affected package README before changes.

## Architecture

- Core owns View, Text, Image, Pressable, StyleSheet and Platform. It must never import react-primitives, React Strict DOM, StyleX, Loom or Astryx.
- Resolve hosts through ESM conditional exports or explicit `/web`, `/native`, `/figma` entries. No global injection, runtime require probing or eager renderer registry.
- Upstream React Strict DOM owns web/native. `react-strict-dom-figma` lives in the sibling `react-designapp` repository. Do not build a competing Strict DOM layer here.
- Figma is a static projection. Never invoke callbacks or claim focus/editing/animation support. Fail unsupported styles instead of silently losing them.
- Loom owns token authoring, restricted TSX, component IR and standalone generation. Future integration supplies a host and manifests; it does not replace Loom's compiler.
- Astryx inspires optional tokens and recipes. It is not a core dependency or a promise of complete Astryx API compatibility.

## Scope and workflow

The active pnpm workspace contains modern core and the shared MDX compiler. Legacy native, SVG, storage, datetimepicker and notification packages are outside this migration. Do not modernize expo-notifications or other service integrations without a specific request.

Use strict TypeScript and built ESM, explicit `.js` internal imports, named exports and renderer-independent shared types. Keep optional hosts out of default web imports and contracts. Do not add fake ambient host declarations; optional runtime imports are isolated in small JS boundary modules and validated by the typed adapter factory.

Run `pnpm check` for core changes. Tests must verify behavior, bundle isolation, type errors and resolver contracts. A stub host test does not prove device behavior; report native-device validation separately. Preserve sibling repository changes and follow their own AGENTS.md before modifying them.

Do not commit or publish unless requested. Keep implementation status in `packages/core/README.md`; distinguish working fixtures from proposed architecture.
