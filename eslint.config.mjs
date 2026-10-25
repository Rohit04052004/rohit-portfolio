import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // Ported macOS-desktop UI (components/desktop.tsx, window.tsx, dock.tsx, etc. and apps/*):
    // these rules target a future React Compiler and flag long-standing, functionally-safe
    // patterns (hydrate state from localStorage on mount, a null-guarded ref read used for
    // mouse-driven magnification, closures over consts defined later in the same component).
    // Downgraded to warnings here rather than restructuring tested third-party interaction code.
    files: [
      "src/app/page.tsx",
      "src/components/desktop.tsx",
      "src/components/window.tsx",
      "src/components/dock.tsx",
      "src/components/menubar.tsx",
      "src/components/launchpad.tsx",
      "src/components/spotlight.tsx",
      "src/components/control-center.tsx",
      "src/components/hover-heading.tsx",
      "src/components/weather-widget.tsx",
      "src/components/apps/**",
    ],
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/immutability": "warn",
      "react-hooks/static-components": "warn",
    },
  },
]);

export default eslintConfig;
