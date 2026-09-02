# Migrate to NestJS 11

This project was migrated in this order:

1. Upgrade Node.js
2. Upgrade TypeScript
3. Migrate Yarn from v1 to v4
4. Upgrade NestJS

The core framework sequence remains Node → TypeScript → NestJS; Yarn was upgraded as an intermediate tooling migration required by the project setup.

---

## 1) Upgrade Node.js

### Goal
Use a Node.js runtime that is compatible with modern NestJS and TypeScript tooling.

### Changes
- Update the local runtime version to `20.20.2`.
- Set the project engine to Node `>=20.0.0`.
- Align the project with the active Node LTS version used by the repo.

### Evidence in the repository
- `.nvmrc` was updated to `20.20.2`
- `package.json` includes:

```json
"engines": {
  "node": ">=20.0.0"
}
```

### Why this comes first
The Node.js version must be stable before upgrading TypeScript and NestJS, because both toolchains depend on newer runtime and package compatibility.

---

## 2) Upgrade TypeScript

### Goal
Move the project to the newer TypeScript compiler and fix compatibility issues introduced by the newer version.

### Target version
The repo was upgraded to TypeScript `^6.0.0`.

### Changes made
- Update `typescript` to `^6.0.0`
- Update `@types/node` to `^22.0.0`
- Modernize `tsconfig.json` for newer compiler behavior
- Set `target` to `ES2022`
- Enable stricter compiler checks and modern config patterns
- Fix TypeORM and schema compatibility issues caused by the newer compiler
- Adjust test setup and e2e configuration to work correctly under TypeScript 6

### Example package changes
```json
"devDependencies": {
  "@types/node": "^22.0.0",
  "typescript": "^6.0.0"
}
```

### Key compatibility adjustments
- Replace older naming utilities with `SnakeNamingStrategy` for consistent naming in persistence schemas.
- Update TypeORM datasource typing to avoid older generic assumptions.
- Adjust `tsconfig.build.json` and `tsconfig.json` for modern compiler output and strictness.
- Fix e2e/test setup issues that surfaced only after the TypeScript upgrade.

### Example config shape
```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "ES2022",
    "strict": true,
    "skipLibCheck": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "types": ["node", "jest"]
  }
}
```

### Why this comes second
TypeScript is the compiler layer under NestJS. Upgrading TypeScript first makes the project compatible with modern decorators, type rules, and dependency APIs before NestJS itself is upgraded.

---

## 3) Migrate Yarn from v1 to v4

### Goal
Move the repository from classic Yarn v1 to Yarn v4 so the lockfile, installation behavior, and workspace-related tooling match the modern toolchain.

### Target version
The repo was migrated to Yarn `4.18.0`.

### Evidence in the repository
- `package.json` includes:

```json
"packageManager": "yarn@4.18.0"
```

- A Yarn v4 config file was added:

```yml
# .yarnrc.yml
nodeLinker: node-modules
```

### What changed
- Remove the legacy Yarn v1 configuration and lockfile assumptions.
- Add the v4 configuration file and update the package manager metadata.
- Regenerate the lockfile and ensure resolved dependency versions match the upgraded toolchain.
- Reinstall dependencies with Yarn 4 to avoid classic resolution drift.

### Practical migration steps
```bash
corepack enable
corepack prepare yarn@4.18.0 --activate
yarn --version
rm -rf node_modules yarn.lock
yarn install
```

### Why this comes before NestJS
The project had already upgraded Node and TypeScript before the framework step. The Yarn upgrade is part of the package manager/tooling modernization needed to keep installs and dependency resolution stable before the NestJS 11 upgrade is applied.

---

## 4) Upgrade NestJS

### Goal
Move the application from the older NestJS baseline to `@nestjs/*` `^11.0.0` and resolve the runtime compatibility changes.

### Target version
The project uses NestJS 11 packages such as:

```json
"@nestjs/common": "^11.0.0",
"@nestjs/config": "^4.0.0",
"@nestjs/core": "^11.0.0",
"@nestjs/cqrs": "^11.0.0",
"@nestjs/platform-express": "^11.0.0",
"@nestjs/swagger": "^11.0.0",
"@nestjs/typeorm": "^11.0.0",
"@nestjs/cli": "^11.0.0",
"@nestjs/testing": "^11.0.0"
```

### Changes made
- Update all `@nestjs/*` packages to version `11.0.0`
- Update the Nest CLI to `^11.0.0`
- Adjust test setup so Jest and global teardown work with the newer runtime assumptions

### Why this comes last
NestJS v11 is the application framework layer. It depends on a compatible Node.js runtime and TypeScript compiler. Upgrading in this order avoids a broken state where the framework is upgraded before the underlying toolchain is ready.

---

## Recommended execution order

```bash
# 1. Node.js
nvm install 20.20.2
nvm use 20.20.2

# 2. TypeScript
yarn add -D typescript@^6.0.0 @types/node@^22.0.0

# 3. Yarn v1 -> v4
corepack enable
corepack prepare yarn@4.18.0 --activate
yarn --version
rm -rf node_modules yarn.lock
yarn install

# 4. NestJS
yarn add @nestjs/common@^11.0.0 @nestjs/core@^11.0.0 @nestjs/config@^4.0.0 @nestjs/cqrs@^11.0.0 @nestjs/platform-express@^11.0.0 @nestjs/swagger@^11.0.0 @nestjs/typeorm@^11.0.0 @nestjs/cli@^11.0.0 @nestjs/testing@^11.0.0

# then verify
yarn build
yarn test:e2e
```

---

## Summary

The safe migration path for this repository was:

1. Node.js 20.x first
2. TypeScript 6 next
3. Yarn 1 to 4 as a tooling migration
4. NestJS 11 last

This order matches the repository history and avoids type and runtime incompatibility during the migration.
