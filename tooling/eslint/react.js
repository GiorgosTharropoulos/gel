import reactQueryPlugin from "@tanstack/eslint-plugin-query";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactPlugin from "eslint-plugin-react";
import hooksPlugin from "eslint-plugin-react-hooks";
import globals from "globals";

function getReactQueryPluginRules() {
  const first = reactQueryPlugin.configs["flat/recommended"][0];
  if (!first) {
    throw new Error(
      'Expected reactQueryPlugin.configs["flat/recommended"][0] to be defined',
    );
  }

  const { rules } = first;
  if (!rules) {
    throw new Error(
      'Expected reactQueryPlugin.configs["flat/recommended"][0].rules to be defined',
    );
  }

  return rules;
}

/** @type {Awaited<import("typescript-eslint").Config>} */
export default [
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      react: reactPlugin,
      "react-hooks": hooksPlugin,
      "@tanstack/query": reactQueryPlugin,
      "jsx-a11y": jsxA11y,
    },
    rules: {
      ...reactPlugin.configs.flat.recommended.rules,
      ...reactPlugin.configs.flat["jsx-runtime"].rules,
      ...hooksPlugin.configs.recommended.rules,
      ...getReactQueryPluginRules(),
      ...jsxA11y.flatConfigs.recommended.rules,
      "react/prop-types": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    languageOptions: {
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: {
        ...globals.browser,
        React: "writable",
      },
    },
  },
];
