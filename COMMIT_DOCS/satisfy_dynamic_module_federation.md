Summary of changes - satisfy & module federation integration

What I changed

1. Added `client/src/utils/satisfy.ts`
   - Implemented a hoist-safe `export function satisfy(version: string, range: string): boolean`.
   - Included helper functions: `parseRange`, `parseComparatorString`, `parseGTE0`, `extractComparator`, `combineVersion`, and `compare`.
   - Exported an alias `wt` for backwards compatibility.
   - Ensured no imports from `remoteAppManager` or re-export barrels to avoid circular dependencies.

2. Updated `client/src/utils/dynamicModuleFederation.ts`
   - Added a direct import: `import { wt } from './satisfy';` (avoids barrel imports).
   - Extended `RemoteModuleConfig` with optional `requiredVersion?: string`.
   - Added version compatibility checking when loading remote modules; throws if a remote module's exposed `version` does not satisfy `requiredVersion`.
   - Threaded `requiredVersion` through `loadRemoteComponent` and `useRemoteComponent` hooks.

Reason

- The previous setup used non-hoisted exports and barrel imports that risked circular dependency with `remoteAppManager`, causing TDZ errors and HMR "waiting for update signal" issues.
- Making `satisfy` a hoisted function and importing it directly eliminates that cycle and allows modules to reference `wt` safely during module linking.

Notes & Next steps

- Ensure other modules import `wt` directly from `./utils/satisfy` not via `./utils` barrel.
- If any module currently calls `wt` at top-level during module evaluation, move that logic into a runtime function (e.g., in a boot/initializer) or lazily import satisfy.
- Run full lint/build and fix remaining TypeScript lint errors in the project (many unrelated lint issues exist).