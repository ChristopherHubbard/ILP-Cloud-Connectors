module.exports = {
    "roots": [
      "<rootDir>/src/client"
    ],
    "transform": {
      "^.+\\.tsx?$": "ts-jest"
    },
    "moduleFileExtensions": [
      "ts",
      "tsx",
      "js",
      "jsx",
      "json",
      "node"
    ],
    "verbose": true,
    "coveragePathIgnorePatterns": [
      "<rootDir>/src/client/index.tsx"
    ]
  }