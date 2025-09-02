# Practical NestJS

## Overview

This project is an experimental of using `DDD` and `modular architecture` within `NestJS(v10.0.0)`. The following technologies are used:

- `Postgres` as database
- `TypeORM` as ORM
- `Solace Queue` as message broker
- `TestContainers` for integration tests

## Organization

This project is structured in the following way:

1. `infra-modules`
- Where the things regarding to infrastructure are implemented to be reused in other modules
- For instances:
  - database
  - solace queue

2. `w-hra-modules`
- Where the `Bounded-Context` has come. Each of them serve as `business-model` and must not depend on each other.

3. `w-hra-planning`
- Where the main application is implemented by connecting all of the `w-hra-modules` and `infra-modules` to form a single application.

4. `w-hra-carries`
- TBD

## Processing flows

### `w-hra-modules`