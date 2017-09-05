# babel-preset-platform [![travis-ci](https://travis-ci.org/bernardmcmanus/babel-preset-platform.svg)](https://travis-ci.org/bernardmcmanus/babel-preset-platform)
> Set platform-specific options in babel configs

## Usage

##### target
```bash
BABEL_PLATFORM=node babel ...
BABEL_PLATFORM=browser webpack ...
```

##### .babelrc
```js
{
  presets: [
    ['platform', {
      browser: {
        // browser-only presets
        presets: [
          ['env', {
            targets: { browsers: 'last 2 versions' }
          }]
        ]
      },
      node: {
        // node-only presets
        presets: [
          ['env', {
            targets: { node: 'current' }
          }]
        ],
        // node-only plugins
        plugins: ['dynamic-import-node']
      },
      '*': {
        // common presets
        presets: [
          // shared options for env preset
          ['env', {
            enabled: ['transform-classes']
          }]
        ]
      }
    }]
    ...
  ],
  plugins: [
    ...
  ]
}
```
