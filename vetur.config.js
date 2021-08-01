/** @type {import('vls').VeturConfig} */
module.exports = {
  settings: {
    // "vetur.useWorkspaceDependencies": true,
    // "vetur.experimental.templateInterpolationService": true
  },
  projects: [
    './frontend-typescript', // shorthand for only root.
    {
      root: './frontend-typescript',
      package: './package.json',
      tsconfig: './tsconfig.json',
      globalComponents: [
        './src/components/**/*.vue'
      ]
    },
    './frontend', // shorthand for only root.
    {
      root: './frontend',
      package: './package.json',
      globalComponents: [
        './src/components/**/*.vue'
      ]
    }
  ]
}