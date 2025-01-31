# Practical NestJS

- An example of using [Nest](https://github.com/nestjs/nest)
- High-lighted points
  - Use TypeOrm as ORM within Postgres
  - Use Redis
  - Use [testcontainer](https://testcontainers.com/) to implement e2e tests

## Notes:
### To generate migrations for specific feature
- `typeorm.datasource.ts` -> comment out all the features that we don't want to generate migration
- run the following command `just gen-migration [feature's folder name] [name of migration]`
- `typeorm.datasource.ts` -> uncomment

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

