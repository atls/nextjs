# Next Config With Workspaces

## Install

```
yarn add @atlantis-lab/next-config-with-workspaces
```

## Example usage

```typescript
const { withWorkspaces } = require('@atlantis-lab/next-config-with-workspaces')
const withPlugins = require('next-compose-plugins')

module.exports = withPlugins([withWorkspaces])
```
