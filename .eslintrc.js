const RULES = {
  OFF: "off",
  WARN: "warn",
  ERROR: "error",
};

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  settings: {
    "import/resolver": {
      node: {
        moduleDirectory: ["node_modules", "src/"],
      },
    },
  },
  extends: ["plugin:react/recommended", "airbnb", "prettier"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    "arrow-body-style": RULES.WARN,
    "react/jsx-filename-extension": RULES.OFF,
    "no-nested-ternary": RULES.OFF,
    "react/function-component-definition": RULES.OFF,
    "react/react-in-jsx-scope": RULES.OFF,
    "no-unused-vars": RULES.WARN,
    "jsx-a11y/anchor-is-valid": RULES.OFF,
    "react/jsx-props-no-spreading": RULES.OFF,
    "import/prefer-default-export": RULES.WARN,
    "no-use-before-define": RULES.WARN,
    "react/require-default-props": RULES.WARN,
    "no-underscore-dangle": RULES.OFF,
    "no-param-reassign": RULES.WARN,
    "react/forbid-prop-types": RULES.WARN,
    "no-shadow": RULES.WARN,
    "react/no-array-index-key": RULES.OFF,
    "consistent-return": RULES.OFF,
    "no-console": [RULES.WARN, { allow: ["warn", "error"] }],
    "import/order": RULES.WARN,
  },
};
