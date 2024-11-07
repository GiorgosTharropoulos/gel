import reactQueryPlugin from "@tanstack/eslint-plugin-query";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactPlugin from "eslint-plugin-react";
import hooksPlugin from "eslint-plugin-react-hooks";
import globals from "globals";

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
      ...reactQueryPlugin.configs["flat/recommended"][0].rules,
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
