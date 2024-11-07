import { fixupPluginRules } from "@eslint/compat";
import testingLibraryPlugin from "eslint-plugin-testing-library";
import vitestPlugin from "eslint-plugin-vitest";

/** @type {Awaited<import("typescript-eslint").Config>} */
export default [
  {
    plugins: {
      vitest: vitestPlugin,
      "testing-library": fixupPluginRules({
        rules: testingLibraryPlugin.rules,
      }),
    },
    files: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
    rules: {
      ...vitestPlugin.configs.recommended.rules,
      ...testingLibraryPlugin.configs.react.rules,
    },
  },
];
