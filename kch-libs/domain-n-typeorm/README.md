# Domain and TypeORM

## Versions
- NestJS - 10

## Version of packages

```bash

add @nestjs/typeorm@10.0.2 @nestjs/config@3.2.2 @nestjs/swagger@7.3.1 typeorm pg typeorm-transactional typeorm-extension typeorm-naming-strategies 

```

## Overview

### A `src` folder
- Define a template for either module or application of **NestJS**. There are
    - `entity.base.ts`: an abstract class which must be used as a base class of your entities in further
    - `typeorm-module.configurations.ts`: a template of registering `TypeOrmModule` for application
    - `typeorm-datasource.configurations.ts`: a default options of postgres database which will be used to define a kind of **TypeOrm** configuration

### A `test` folder
- `test.setup.ts`: an example of using `typeorm-module.configurations.ts`
- `sample-app`: an example of NestJS's module
    - Notes:
        - `test.datasource.ts` a kind of **TypeOrm** configuration which is mentioned above

## How it works

- Generate an migration for `sample-app`'s entities by the command
    ```bash
    yarn test:pre
    ```
- Then, starting the e2e test which simulate an application
    - Import `sample-app-module`
    - Configure `TypeOrmModule` as global 

## Notes
- The command to delete database by using postgres tools
```bash
.\dropdb --username=postgres --password=postgres --host=localhost --port=5432 --echo --if-exists --force a-test-db
```