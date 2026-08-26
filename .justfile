# use PowerShell instead of sh:
default:
    clear
    just --list

i:
    clear
    rm -rf node_modules
    yarn install

b: 
    clear
    yarn build

gen-lib name:
    clear
    yarn nest g library {{name}} --no-spec

db-create:
    clear
    yarn db:create

db-drop:
    clear
    yarn db:drop

db-reset: db-drop db-create

gen-migration feature name: b
    clear
    yarn typeorm:generate-migration {{feature}}/persistence/migrations/{{name}}

create-migration feature name:
    clear
    yarn typeorm:create-migration src/{{feature}}/persistence/migrations/{{name}}

run-migration: b
    clear
    yarn typeorm:run-migrations

revert-migration: b
    clear
    yarn typeorm:revert-migration

pre-test: b
    # yarn jest --clearCache

e2e: pre-test
    clear
    yarn test:e2e

e2e-file: pre-test
    clear
    yarn test:e2e --runTestsByPath test/w-hra-planning/biz-units-controller/get.e2e.ts

e2e-files: pre-test
    yarn test:e2e --findRelatedTests \
                test/app.e2e.ts \
                test/w-hra-planning/sale-orders-controller/create.e2e.ts \
                test/w-hra-modules/caching/use-cache-manager.e2e.ts \
                test/w-hra-modules/caching/use-caching-service.e2e.ts \
                # test/w-hra-planning/sale-orders-controller/create.e2e.ts \
                # test/w-hra-modules/shipments/use-cases/commands/shipments/create/create.e2e.ts \
                # test/w-hra-modules/shipments/use-cases/commands/shipments/create/another.create.e2e.ts \
                # test/w-hra-planning/shipments-controller/create.e2e.ts \
                --all

e2e-folder name: pre-test
    clear
    yarn test:e2e --testPathPattern={{name}}

e2e-modules: pre-test
    clear
    yarn test:e2e --testPathPattern=test/w-hra-modules

s:
    clear
    yarn start:dev