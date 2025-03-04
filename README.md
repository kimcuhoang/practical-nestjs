# Practical NestJS

## Versions
- NestJS 10

## Overview
- The project has been organized as monorepo via **yarn workspaces**
- The `kch-libs` aims to define the infrastructure packages
- The `kch-modules` aims to define the feature packages

## How it works
```bash
yarn workspaces run dev:pack
```

```bash
yarn workspace @kch/m-projects test:e2e
```