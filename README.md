# Practical NestJS

- An example of using [Nest](https://github.com/nestjs/nest)
- High-lighted points
  - Use TypeOrm as ORM within Postgres
  - Use Redis
  - Use [testcontainer](https://testcontainers.com/) to implement e2e tests

## Notes:

### TypeORM
- [Avoid relation property initializers](https://typeorm.io/docs/relations/relations-faq/#avoid-relation-property-initializers)

### To generate migrations for specific feature
- `typeorm.datasource.ts` -> comment out all the features that we don't want to generate migration
- run the following command `just gen-migration [feature's folder name] [name of migration]`
- `typeorm.datasource.ts` -> uncomment

### About `whitelist` and `forbidNonWhitelisted`

- When performing a POST request with Supertest in NestJS, if the payload fields lack class-validator decorators, the ValidationPipe might not parse or expose those fields as expected. This behavior is related to how class-validator and class-transformer interact with the ValidationPipe in NestJS.

- The `ValidationPipe` has options like `whitelist` and `forbidNonWhitelisted`.
    - If `whitelist` is set to true, `class-transformer` will automatically remove properties from the incoming payload that do not have any decorator (including `class-validator` decorators) in the corresponding DTO class.
    - If `forbidNonWhitelisted` is also set to true in conjunction with `whitelist`, the `ValidationPipe` will throw an error if non-whitelisted properties are present in the payload.

- By default, `ValidationPipe` in NestJS might have `whitelist` enabled or implicitly remove fields without decorators during the transformation process, leading to the payload not being fully parsed for fields without class-validator decorators.

- Disable whitelist: Set whitelist to false in your ValidationPipe configuration. This will prevent class-transformer from stripping out properties that lack decorators.


