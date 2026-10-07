# React Platform architecture proposal

Draft for the next experimental release · 6 October 2026

Build `@react-platform/core` as an independent successor to `react-primitives`: typed View, Text, Image, Pressable, StyleSheet and Platform APIs with native ESM and target-specific implementations. Use upstream React Strict DOM for its web/native authoring route and maintain the Figma polyfill in `react-designapp`, alongside an explicit static core target backed by that renderer. Keep Loom as the token and component authoring compiler. Treat Astryx as an optional design system integration, initially for web and token mapping.

The first outcome is one small component library rendered to semantic HTML, React Native views, and editable Figma frames and text. Portability is a tested contract for a defined subset; each target reports unsupported features. Existing packages remain available while the new surface is proved.

## Foundations before migration

| Repository | Existing implementation | Architectural consequence |
| --- | --- | --- |
| `react-platform` | Legacy core loads `react-primitives` or an injected object whose host components start as `null`. Native modules use platform file suffixes; generic ScrollView and Modal fall back to View. | Remove the `react-primitives` dependency from the new core. Replace mutable global injection with ESM target entries and explicit support contracts. |
| `react-designapp` | `react-designapp/figma` exports primitives and headless JSON rendering. `react-figmaapp` reexports that entry. `buildTree` uses React Test Renderer and Yoga 1.9.5. | Keep rendering, measurement, layout and serialization in this repository. Validate React 19 before sharing a modern runtime graph. |
| `react-strict-dom-figma` | An existing `html`/`css` facade normalizes static styles and renders through `react-figmaapp`. It has broad `any` types, fixed 16px relative units, LTR logical edges, margin-based gap approximation and omitted conditional styles. | Extend this adapter rather than create another Figma renderer. Tighten types and diagnostics before claiming Strict DOM compatibility. |
| Loom | SwiftUI-shaped primitives, token generation, expression IR and standalone Tailwind web generation; `createPrimitives(Host)` supports RN-shaped hosts. Its authoring components import only `@loom/primitives`. | Preserve authoring imports and existing generated web output. Integrate at the host and token boundaries; do not replace Loom's IR. |

These observations describe the baseline before core migration. See `packages/core/README.md` for the implemented slice and validation limits. Loom and the design renderer have local work in progress. Integration implementation must reconcile that state before updating dependencies or fixtures.

## Design decisions

Preserve the original primitive authoring model. Core components are the shared foundation for runtime libraries, Loom hosts and static design output. Core does not depend on React Strict DOM, StyleX or Loom. Web semantics are available through an optional higher layer; primitive consumers do not have to adopt HTML-shaped authoring.

Use upstream React Strict DOM unchanged on web and React Native. Maintain `react-strict-dom-figma` in the React Designapp monorepo as the static Figma polyfill for its `html`/`css` API. A Figma build resolves `react-strict-dom` to that package; web/native builds retain upstream resolution. Do not introduce a competing semantic implementation in React Platform. Upstream does not need to depend on our core: these are complementary authoring routes that converge on host renderers. [Gallagher's explanation](https://nicolasgallagher.com/one-react-for-web-and-native/).

Retain the earlier proposals' small primitives and independent platform implementations, using package exports and scoped build configuration for selection. Adding a design target should not make application packages load design serialization dependencies. [Primitive strategy](https://github.com/lelandrichardson/react-primitives/issues/54), [platform discussion](https://github.com/react-native-community/discussions-and-proposals/issues/50).

Separate runtime UI from design snapshots. A Figma frame can represent a button's selected visual state and retain its semantic identity; it cannot implement keyboard activation, focus management or a live form. Static projection must describe that difference instead of claiming equivalent behavior.

Keep compiler ownership narrow. Loom owns its authoring grammar, expressions, component identity and token source. React Platform owns target profiles and adapter conformance. React Designapp owns design document construction. No second universal scene graph is needed for the first release.

## Package boundaries

The following names describe proposed packages, not APIs that exist today.

| Package | Responsibility | Dependencies |
| --- | --- | --- |
| `@react-platform/core` | View, Text, Image, Pressable, StyleSheet, Platform; target descriptors and diagnostics via separate subpaths | React peer; target entry imports only its host dependency; no `react-primitives`, Strict DOM or StyleX dependency |
| `react-strict-dom` | Upstream `html`/`css` runtime route for web and React Native | Upstream dependencies; no React Platform fork |
| `react-strict-dom-figma` | Static Figma polyfill, maintained in the React Designapp monorepo | React Designapp primitives; owns CSS and semantic projection |
| `@react-platform/design` | Export session, asset manifest, snapshot settings and semantic metadata sidecar | React Designapp Figma entry; adapter contracts |
| `@react-platform/loom` | Optional RN-shaped host factory and token mapping for Loom | Core contracts and target adapters; use Loom's existing host factory |
| `@react-platform/astryx` | Explicit theme mapping and selected component integrations | Optional Astryx web peers; no Astryx import in core |
| `@react-platform/conformance` | Fixtures and checks reusable by target maintainers | Development dependencies only |

Keep legacy `@react-platform/native`, SVG, storage and other service packages separate. Do not repurpose their published behavior as an accidental breaking change. New packages use strict TypeScript, declaration exports and built ESM. Add CommonJS only for design consumers that demonstrably require it. Use pnpm workspaces and a single locked compatibility fixture across repositories before publishing.

Expose explicit core entrypoints as the reliable contract. The root core export defaults to web and supports `react-native` and custom `figma` conditions. A Figma consumer must configure its resolver to select `figma`, or alias the root to `/figma`; Node does not infer that condition. Strict DOM target selection is separate: only Figma builds alias upstream `react-strict-dom` to the design polyfill. Reject builds where native and figma conditions are both enabled. Test bundler resolution rather than assuming each tool uses identical precedence.

Do not alias all of `react-native` or `react-dom` to design primitives. Apply the Strict DOM alias only in the Figma build and validate the used API subset. Imports with platform suffixes remain escape hatches for features outside the shared contract.

## Primitive contract

The initial shared exports are `View`, `Text`, `Image`, `Pressable`, `StyleSheet` and `Platform`. Preserve `Touchable` as a deprecated compatibility alias with a documented prop migration; do not promise every legacy responder behavior. Dimensions, PixelRatio, Easing and Animated remain optional subpaths or packages so a Text import does not pull them in. ScrollView, TextInput and Modal stay in the higher-level native package.

View is a layout container; Text is the explicit text boundary; Image uses a typed source descriptor; Pressable owns activation, disabled behavior and interaction state. Shared styles use an explicitly supported RN-like object vocabulary, numeric logical units and arrays with falsy entries. Define defaults once: column flex layout for View, border-box sizing, zero box margins, no browser button chrome, and inherited typography through Text. Apply these defaults in the web adapter and test them against native/design output.

`StyleSheet.create` returns typed, immutable style definitions; `flatten` resolves arrays and `compose` combines entries without mutation. These values remain interpretable by design adapters. No Babel transform or StyleX runtime is required for basic core usage. Dynamic styles are ordinary React composition; theme lookup belongs to the caller or a higher layer. Reject unsupported style properties in strict design export.

Pressable styles may depend on a small documented state object (`pressed`, `hovered`, `focused`, `disabled`). A snapshot selects that state explicitly. Web Pressable must use a real button for the button role, normalize browser styles and preserve keyboard/disabled semantics. Links and form controls belong to explicit semantic adapters; do not make every View interactive through click handlers. The Strict DOM route supplies richer HTML semantics independently; its Figma polyfill preserves those semantics as snapshot metadata. Do not expand portable View into an arbitrary HTML tag API.

Shared events contain documented portable fields and an optional target event escape hatch. Shared refs expose only supported operations through typed handles; raw HTMLElement and RN refs belong to target-specific exports. No fake synchronous measurement or focus methods on the design target. Platform provides immutable OS/target information and typed `select`, with no `inject` mutation.

Implement web hosts directly on React DOM, native hosts as thin adapters to React Native, and Figma hosts on `react-designapp/figma`. Core owns normalization and contract validation; host renderers retain reconciliation and layout. Do not implement another React reconciler or Yoga engine in core. Additional renderers provide a scoped `createPrimitives(host, descriptor)` factory from `/adapter`; they do not register themselves in a global singleton. Built-in exports remain stable module bindings and require no provider to select the host.

## ESM and bundle isolation

Publish built ESM with `type: module`, named exports, explicit `.js` relative imports and declarations. Preserve per-component modules. Export barrels only reexport the selected target; they never import every renderer or construct a runtime registry. Mark pure modules `sideEffects: false`; any required CSS is a separate opt-in export listed as a side effect. [Node package exports documentation](https://nodejs.org/api/packages.html#conditional-exports).

Illustrative root export structure:

```json
{
  "type": "module",
  "exports": {
    ".": {
      "figma": { "types": "./dist/figma/index.d.ts", "default": "./dist/figma/index.js" },
      "react-native": { "types": "./dist/native/index.d.ts", "default": "./dist/native/index.js" },
      "default": { "types": "./dist/web/index.d.ts", "default": "./dist/web/index.js" }
    },
    "./web": { "types": "./dist/web/index.d.ts", "default": "./dist/web/index.js" },
    "./native": { "types": "./dist/native/index.d.ts", "default": "./dist/native/index.js" },
    "./figma": { "types": "./dist/figma/index.d.ts", "default": "./dist/figma/index.js" },
    "./contracts": { "types": "./dist/contracts/index.d.ts", "default": "./dist/contracts/index.js" }
  }
}
```

Add documented component subpaths such as `/text` with the same conditional target mapping. Keep shared prop declarations renderer-independent; target declarations may extend them explicitly. `/contracts` must not evaluate React or a renderer. Optional host peers are imported only from their respective target entries, so web installation and bundling do not require Figma or native packages.

Tree shaking removes unused exports when a consumer bundler supports it; it is not guaranteed by ESM syntax alone. Verify a Text-only production bundle excludes Image, Pressable, native hosts, design serialization and optional animation code. Dynamic `import()` enables route/component code splitting; keep base primitives synchronous to avoid unnecessary Suspense boundaries. Load the design exporter and asset tooling on demand, not during a core import. SSR imports must not access `window` or install listeners; subscription utilities initialize on use.

## Supported authoring routes

Primitive components import directly from core:

```tsx
import { Pressable, Text, StyleSheet } from '@react-platform/core';

const styles = StyleSheet.create({
  button: { padding: 12, backgroundColor: '#173f35' },
  label: { fontSize: 16, color: '#ffffff' },
});

export function ContinueButton({ disabled = false, onPress }) {
  return (
    <Pressable disabled={disabled} onPress={onPress} style={styles.button}>
      <Text style={styles.label}>Continue</Text>
    </Pressable>
  );
}
```

The semantic authoring route imports `html` and `css` directly from upstream React Strict DOM, resolved to its Figma polyfill only for design exports. A minimal proposed example uses styles common to all three targets:

```tsx
import { css, html } from 'react-strict-dom';

const styles = css.create({
  root: { display: 'flex', flexDirection: 'row', padding: 12 },
  label: { fontSize: 16, color: '#ffffff' },
});

export function ContinueButton({ disabled = false, onClick }) {
  return (
    <html.button disabled={disabled} onClick={onClick} style={styles.root}>
      <html.span style={styles.label}>Continue</html.span>
    </html.button>
  );
}
```

The examples are API intent, not compiled fixtures. Core owns primitive types; upstream owns runtime Strict DOM types. The Figma polyfill must expose a documented static subset, with explicit semantic projection and CSS-default normalization. A permissive string-indexed `html` object is insufficient. Strict DOM components must typecheck and pass fixtures against upstream and the polyfill. The Figma alias is a static projection contract, not a promise of interactive DOM behavior or arbitrary compiled StyleX compatibility.

Loom components continue to import `HStack`, `Text`, `Pressable` and other primitives from `@loom/primitives`. Its compiler must not be expanded to accept arbitrary Strict DOM or Astryx TSX. Bind Loom's existing `createPrimitives(Host)` factory to an adapter over core primitives, including source/event/style translation where its Host differs. The integration package supplies that host without moving token resolution or stack semantics into React Platform. Existing RN and Figma hosts can coexist during migration.

Loom's standalone Tailwind output remains an independent shipping route. A future Strict DOM generator is a separate Loom proposal with its own grammar and acceptance criteria; this architecture does not require it.

## Target and capability contract

Use target descriptors rather than a global mutable injection singleton. A session distinguishes renderer (`dom`, `react-native`, `designapp`), destination (`web`, `ios`, `android`, `figma`, later `sketch`), and mode (`interactive`, `snapshot`). Descriptors are versioned with the adapter and runtime combination.

Each feature is `supported`, `approximated`, `projected` or `unsupported`. A descriptor includes restrictions and a diagnostic code, not just a boolean. `projected` means a visual snapshot of an interactive concept. The following is the proposed first-release policy, subject to conformance gates:

| Feature | Web and native | Figma snapshot |
| --- | --- | --- |
| Flex row/column, text, image | Core contract implemented by each host | Supported subset with measured bounds |
| Gap | Verify host support against core fixtures | Approximated until layout supports real gap; non-wrapping direct host children only |
| Button activation | Interactive; test target event and disabled semantics | Projected appearance; callbacks never invoked by exporter |
| Input editing, focus and refs | Upstream-specific typed support | Static value or placeholder; imperative access unsupported |
| Hover, pressed and theme variants | Target-supported interaction styles | Explicit chosen snapshot state and token mode |
| Grid, container queries, complex selectors | Capability-specific; web can use target-only files | Unsupported in initial portable profile |
| SVG and icon assets | Separate optional asset implementation | Explicit vector conversion or raster asset; no assumption of Strict DOM SVG support |
| Modal, virtualized list, animation | Target-specific implementation | Explicit selected visual composition; runtime behavior unsupported |

Design exports default to strict mode: unsupported visual declarations fail; approximations require a named opt-in. Recognized event props are expected static projections and are recorded in the report. Unsupported imperative requirements fail. A permissive preview may return warnings, but never silently drop features.

Diagnostics include code, target, component or node path, feature, limitation and remedy. Include source location when the build transform has one; runtime errors must not invent locations. Initial codes: `RP001` unsupported feature, `RP002` approximation, `RP003` unresolved token, `RP004` incompatible style artifact, `RP005` host version mismatch. Keep Loom's existing `LOOMxxx` errors intact and nest them as causes where appropriate.

## Styles and tokens

Core StyleSheet values remain plain, typed style definitions. Web translates them to CSS, native to RN style values, and Figma to concrete design values. The Strict DOM Figma polyfill separately normalizes supported CSS to React Designapp styles. Preserve authored CSS defaults there rather than leaking primitive column-flex defaults into HTML-shaped code. Runtime Strict DOM continues to use its upstream style pipeline. Compiled StyleX class artifacts cannot be reversed into editable Figma styles reliably; reject them with `RP004` rather than accepting opaque objects. An optional compile-time CSS path is later optimization work with its own tests; it is not a prerequisite for core.

Treat static functions in `css.create`, theme variables and conditional styles as separate support milestones. Initially share literal styles and values produced from an explicit token manifest. Do not advertise complete upstream `css` compatibility because the adapter exports identically named functions.

Loom remains the canonical token source for Loom projects. Add explicit mapping to its native `Theme` fields (`color`, `space`, `radius`, `typography`) and to the runtime style pipeline. ThemeProvider currently uses React Provider's `value` prop; do not invent a `theme` prop on it. Resolve design token values against a selected mode while retaining source token IDs in metadata.

Define unit rules in the portable profile: numeric lengths represent CSS px on web and logical units on native/design; scale keys are resolved by Loom first. Snapshot viewport, root font size and direction are explicit inputs. For the initial Figma adapter require LTR and its existing 16px relative-unit rule. RTL and inherited `em` calculation are later work, and mismatched assumptions must fail validation.

Keep asset resolution outside component evaluation. A session receives stable asset IDs, resolved bytes or trusted local references, font identities and measurement policy. Missing assets and unavailable required fonts fail strict export. Deterministic fixtures use embedded or local assets and a fixed font. Estimated typography requires an explicit approximation opt-in.

## Figma integration

The export path is shared primitive component → core Figma adapter → React Designapp primitives → measured design tree → Figma REST-shaped JSON → separate importer. Strict DOM components follow a parallel path: `react-strict-dom-figma` → React Designapp primitives → the same measured tree and serializer. The polyfill need not route through core; reuse normalization helpers only where the contracts agree, avoiding a circular core/design dependency. Generating JSON does not create a live Figma document, and this format is not a `.fig` file or a REST write API.

Start with the existing `react-designapp/figma` entry, using `react-figmaapp` where the adapter already expects it. Wrap the result with an export report and metadata sidecar. Proposed envelope: `schemaVersion`, `document`, `metadata`, `assets`, `diagnostics`. The importer receives `document`; the envelope is a new React Platform format.

Metadata records component ID/version, fixture props, chosen state, semantic roles and labels, source token bindings, and stable logical node IDs. State is selected through fixture props or supported snapshot style evaluation; a session cannot force arbitrary component hooks into a pressed or loading state. Associate logical IDs with generated document IDs during serialization. Names alone are insufficient and must not be used as identity.

Existing serialization returns empty component/component-set registries. Therefore the first milestone guarantees editable frames, text and supported images, not Figma components, variants or variables. Creating native Figma components and variable bindings requires coordinated serializer and importer work after the sidecar contract. Use `autoLayout: true` where the supported fixture benefits from it; validate actual exported layout metadata.

Deterministic sessions must fix document name, metadata timestamps/version fields, viewport, fonts, assets, theme and ID allocation. Compare canonical exports twice in fresh sessions and retain a manifest of those inputs. Do not promise byte stability merely because the component source is unchanged.

## Astryx integration decision

Astryx is a beta React 19+ design system built with StyleX. Its checked core manifest declares React DOM, and Button uses a raw `<button>` with DOM refs and event types. It should initially be treated as a web integration, not a portable renderer backend. [README](https://github.com/facebook/astryx), [core manifest](https://github.com/facebook/astryx/blob/main/packages/core/package.json), [Button source](https://github.com/facebook/astryx/blob/main/packages/core/src/Button/Button.tsx).

Adopt useful concepts through an optional integration: semantic token mapping, component recipes, accessible labels and explicit variant schemas. Begin with a reviewed mapping table for colors, spacing, typography and radius. Unsupported mappings are errors; similar token names are not proof of equivalent semantics.

For component reuse, compare three paths in a Button spike: web-only Astryx consumption, an independently authored core-primitive recipe matching selected variants, or an audited source port to upstream Strict DOM plus its Figma polyfill. Prefer the recipe if it keeps the contract small. A source port must account for DOM hooks, refs, selectors and StyleX transforms; changing JSX tags alone is insufficient. Do not maintain a broad Astryx fork before this spike establishes value.

## Compatibility and migration

Target React 19 for the new packages, but gate release on a real renderer fixture. React Designapp currently develops against React 16-era types and React Test Renderer; wildcard peers do not establish React 19 support. Align React and its renderer in the integration graph and prove hooks, synchronous export and layout before relaxing peer versions.

The inspected upstream Strict DOM manifest is `0.0.55` with React 19 and RN ≥0.82 peers; Astryx core is `0.6.5` with StyleX `^0.19.0`, whereas that Strict DOM manifest uses `^0.18.3`. These are mutable branch observations, not a tested release matrix. Pin exact compatible artifacts after the spike; avoid assuming StyleX tokens and transform output are interchangeable. [Strict DOM manifest](https://github.com/facebook/react-strict-dom/blob/main/packages/react-strict-dom/package.json).

Remove `react-primitives` from the new core implementation and peer requirements. Preserve familiar named primitive imports through a versioned experimental release, with a compatibility table for changed style/event/ref behavior. Provide an opt-in codemod for import paths and Touchable migration; do not preserve mutable `inject` or the old default export object. These are explicit breaking changes from core 0.0.x. Existing service packages can gain their own capability descriptions later. Deprecation comes only after replacement coverage and migration examples exist.

## Implementation sequence and release gates

| Milestone | Deliverable | Acceptance |
| --- | --- | --- |
| P0 Core contract and compatibility fixture | Primitive props/styles/defaults and exact version matrix; a Button/stack/text/image gallery using host renderers | React 19 hooks and synchronous design export work; one React instance per graph; baseline diagnostics and bounds captured; no `react-primitives` dependency |
| P1 ESM primitive core | Web/native/Figma implementations, StyleSheet, Platform and explicit target entries | Every target typechecks; Text-only bundle excludes unused hosts/features; code splitting and SSR fixtures pass; no global injection; wrong target configuration fails clearly |
| P1b Figma polyfill contract | Harden `react-strict-dom-figma` inside React Designapp; retain upstream for web/native | Shared upstream-import fixtures pass in all targets; static types and diagnostics enforce limits; core bundle excludes Strict DOM/StyleX |
| P2 Strict design export | Harden existing Figma adapter; export envelope, asset inputs and diagnostics | No silent conditional-style loss; gap restrictions enforced; missing fonts/tokens fail; repeat exports match; real importer creates editable frames/text with expected bounds |
| P3 Loom bridge | Host integration and token-to-Theme mapping after Loom's fixture and theme tasks | Original `.loom.tsx` Button renders without duplicated source; IR and existing generated web output have no drift; auto-layout metadata and token identities survive |
| P4 Astryx spike | Token mapping plus one selected Button recipe or audited port | Light/dark and disabled/loading fixtures agree with mapped design intent; web keyboard behavior preserved; unsupported props fail instead of disappearing |
| P5 Experimental release | Supported-target matrix, examples, migration guide and CI | Package export tests in Node, a web bundler and Metro; SSR/hydration fixture; native interaction checks; design conformance gallery; documented opt-ins and known limits |

P0 is the first implementation task. Keep it as a contained integration fixture in React Platform, consume local packages through explicit entries, and record required renderer fixes separately. Loom's existing T10–T12 sequence remains its own workstream; changes there must follow its task scopes. Do not mark those tasks complete based on this proposal.

Conformance compares semantics and layout constraints, not identical raster output. Assert web tag/role/disabled behavior, native accessibility and activation, and Figma node structure, dimensions, typography and diagnostic reports. Use numeric tolerances for font/layout differences, with explicit fixture-specific bounds. Include nested text, fragments, hidden children, custom components, logical edges, image fit and unsupported features.

The recommended next step is P0, followed by P1, P1b and P2. Hold additional controls, new renderers and compiler targets until that shared fixture demonstrates the boundaries in practice.

## Agent interface and design system recipes

An Astryx-inspired library can be cross-platform by defining its recipes in portable primitives or Loom's supported authoring subset. This does not automatically make the upstream Astryx package portable. Share design intent through semantic tokens, explicit props and named variants; adapt interactions and static projections through the existing host contracts.

The implemented Button example includes a serializable manifest describing component identity/version, parameters, defaults, enum values, tokens, target limits and named snapshot fixtures. An agent can inspect these fields, choose a valid composition and validate its output. This is an initial interface fixture, not a general-purpose agent protocol or an implemented Loom integration.

The next Loom integration should generate the manifest from Loom's component IR and token source, adding source references, structured diagnostics and fixture commands. Agents should propose restricted TSX or structured prop/variant edits, run Loom's validation and conformance checks, then inspect web/native/design output. Keep actions as symbolic bindings in specifications; static exports never execute them. This makes the interface checkable and avoids separately maintained component specifications.

## Shared MDX compilation (implemented)

`packages/mdx` now owns the renderer-independent MDX 3/YAML/source-map pipeline as `@react-platform/mdx`, with an optional `/esbuild` entry. It does not depend on core, React runtime, upstream Strict DOM, or a design host. `mdx-slides` keeps AST slide grouping, presentation metadata/notes, players, templates, and exports; its compiler calls this package. React Designapp's MDX example maps one document through its existing Strict DOM Figma polyfill. Horizontal rules remain document content; a frame-per-slide Figma exporter is deferred to mdx-slides.

This adds only the MDX package to the active workspace, without bringing legacy service packages into the migration. Local sibling consumers link the unpublished compiler package and build it explicitly. See `packages/mdx/README.md` for the implemented APIs and test scope.
