# dtable-ui-component Development Guide

This guide applies to the whole repository. If a subdirectory later contains its own `AGENTS.md`, follow that file for work in its scope as well.

## What this repository contains

- `dtable-ui-component` is a React 18 component library for SeaTable interfaces. The source is JavaScript/JSX and is compiled with Babel and Webpack.
- `src/index.js` defines the library's public exports. `src/index.local.js` is the local development entry used by the development server.
- Most reusable controls, editors, formatters, and mobile/desktop variants live directly under `src/`. Shared implementation helpers are in `src/utils/`, `src/common/`, `src/hooks/`, `src/constants/`, `src/data/`, and `src/formatterConfig/`.
- Localization is implemented in `src/lang/index.js`; its message catalogs are the JSON files under `src/locales/`.
- Jest tests are under `tests/`, and Storybook examples are under `stories/` with configuration in `.storybook/`.
- `build/`, `lib/`, `es/`, `dist/`, `docs/`, and `storybook-static/` are ignored build or documentation outputs. Change source files and regenerate those outputs only when the task explicitly requires it.

## Working practices

- Start by reading the affected implementation, its public call chain, nearby tests, and relevant history. Establish the intended behavior and compatibility expectations before changing code.
- Keep the diff focused. Do not bundle formatting sweeps, dependency upgrades, generated-output refreshes, or unrelated cleanup with a feature or bug fix.
- Reuse the repository's existing components, formatters, constants, and utilities before adding a parallel implementation.
- `dtable-utils` provides the SeaTable data-model semantics. Reuse its public constants and helpers for column types, value conversion, validation, filtering, or sorting rather than recreating those rules in this package.
- Treat props, editor values, formatter values, callbacks, and exported components as library contracts. Preserve unrelated fields when updating object values, and make intentional, compatible changes to callback arguments and return values.
- When a component has desktop and mobile implementations (for example, `pc-editor.js` and `mb-editor.js`), inspect both paths before modifying shared behavior.
- Pair timers, event-bus subscriptions, document/window listeners, and asynchronous work with appropriate cleanup. Do not introduce direct state mutation unless the surrounding API explicitly uses it.
- Keep additions out of `src/index.js` unless they are meant to become a supported public import. Avoid changing the package entry point or generated package outputs incidentally.

## Code conventions

- Follow the nearest existing pattern and the enforced rules in `.eslintrc.json`.
- Use 2-space indentation, single quotes, semicolons, Unix line endings, and a final newline.
- Keep imports at the beginning of a module, avoid duplicate imports, use spaces inside object braces, and do not add spaces inside array brackets.
- Use `PascalCase` for React components and classes; use `camelCase` for functions and variables. Preserve established file naming within each feature area.
- Keep rendering components focused; put reusable non-rendering behavior in an appropriate existing utility, hook, or common module when that improves reuse without changing the public API.

## Text and localization

- Use `getLocale()` from `src/lang/` for user-visible component text rather than introducing new JSX/JavaScript literals when the text is part of the UI.
- Reuse a key when its meaning already matches. When adding a key, update all JSON files in `src/locales/` with the identical key set; the currently shipped locale catalogs are kept in sync.
- When changing a localized message, verify that the key remains present in every locale catalog and that interpolation names still match the values supplied to `getLocale()`.

## Frontend unit tests

### Test impact

For a user-visible behavior change or bug fix, state one of these decisions before completion:

- `NEED_TEST`: new focused coverage is needed.
- `UPDATE_TEST`: existing coverage expresses behavior that intentionally changed.
- `TEST_NOT_NEEDED`: no testable behavior or public-contract risk changed; give the reason.
- `NEED_HIGHER_LEVEL_TEST`: the risk needs browser, visual, or end-to-end verification that Jest/jsdom cannot faithfully provide.
- `INSUFFICIENT_EVIDENCE`: the expected behavior or the required test context is still unknown and should be resolved where possible.

This established library has a small Jest suite relative to its component surface. Do not backfill broad coverage in an unrelated change, but add or update a concise test whenever the change affects rendering or interaction, exported props/callbacks, data conversion or validation, defaults, compatibility, error handling, or a shared utility.

### Test design and implementation

- For a unit-test-reproducible defect, add the smallest realistic regression test that would fail before the fix.
- Assert observable DOM or accessibility output, public callbacks, returned values, or externally visible results—not private component state or implementation details.
- Cover the primary path and only the boundary, negative, compatibility, or error cases that correspond to a concrete changed risk.
- Prefer role, accessible-name, and label queries. Use a `data-testid` or a targeted selector only when the component cannot expose a meaningful semantic query.
- The current test stack is Jest 30.3.0, `@testing-library/react` 14.3.1, and `@testing-library/user-event` 13.5.0. `tests/setupTests.js` already imports `@testing-library/jest-dom`; do not repeat that setup in individual tests unless a test-specific need exists. Use the installed user-event v13 API rather than `userEvent.setup()`.
- Mock network, timers, randomness, browser APIs, and unrelated heavyweight dependencies when necessary, but do not mock away the condition or public result under test.
- Avoid broad snapshots and assertions that serve coverage only. Every added test needs an assertion that protects the intended behavior.

### Context, execution, and reporting

- Read `package.json`, `jest.config.js`, `tests/setupTests.js`, the direct call chain, and one to three nearby tests before designing coverage.
- Keep utility tests in `tests/utils/`. Follow the nearest convention for component tests; `tests/compnents/` is a pre-existing legacy spelling, so do not rename it as incidental cleanup.
- Run the narrowest relevant test command first, without watch mode:

  ```bash
  npm test -- <test-path> --watchAll=false
  ```

- Use the non-mutating lint command for changed source files or the full source tree when appropriate:

  ```bash
  npm run eslint
  ```

  `npm run lint` runs ESLint with `--fix`, so do not use it merely as a validation command.
- Run `npm run build` when a change could affect the package build, public entry, shared styles, or broad component integration. Report only commands that actually completed successfully.

For frontend behavior or unit-test work, include this concise record in the final response:

```text
Test Impact
- decision: NEED_TEST | UPDATE_TEST | TEST_NOT_NEEDED | NEED_HIGHER_LEVEL_TEST | INSUFFICIENT_EVIDENCE
- changed_behavior: user-visible behavior or public contract; otherwise none
- risk: failure the test or higher-level check addresses; otherwise none
- tests: tests added, updated, or omitted, with the reason
- verification: commands actually run and their results
- remaining_risks: unverified behavior; otherwise none
```

## Completion checklist

1. Confirm that the diff contains only the requested work and no generated artifacts, local configuration, or secrets.
2. Record the test-impact decision whenever frontend behavior or tests are relevant.
3. Run focused tests first; run linting or a build when the change warrants them.
4. Run `git diff --check` and inspect `git status` before delivery.
5. Summarize the behavior changed, validation actually performed, and any remaining risk.
