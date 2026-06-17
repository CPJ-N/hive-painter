import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  ...nextVitals,
  {
    rules: {
      "prefer-const": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
];

export default eslintConfig;
