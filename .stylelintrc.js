module.exports = {
  extends: "stylelint-config-standard",
  ignoreFiles: ['node_modules/**/*.less', '**/*.md', '**/*.ts', '**/*.tsx', '**/*.js'],
  rules: {
    "string-quotes": "single",
    "color-hex-length": null,
    "selector-pseudo-class-no-unknown": [
      true,
      {
        "ignorePseudoClasses": [
          "global",
          "local"
        ]
      }
    ]
  }
}