# use PowerShell instead of sh:
set windows-shell := ["powershell.exe", "-NoLogo", "-Command"]

default:
    clear
    just --list

i:
    clear
    rm -rf node_modules
    npx yarn install

b: 
    clear
    npx yarn build

db-create:
    clear
    npx yarn db:create

db-drop:
    clear
    npx yarn db:drop

db-reset: db-drop db-create

gen-migration feature name: b
    clear
    npx yarn typeorm:generate-migration src/{{feature}}/persistence/migrations/{{name}}

run-migration: b
    clear
    npx yarn typeorm:run-migrations

revert-migration: b
    clear
    npx yarn typeorm:revert-migration

pre-test: b
    # yarn jest --clearCache

e2e: pre-test
    clear
    npx yarn test:e2e

e2e-file: pre-test
    clear
    npx yarn test:e2e -f test/w-hra-planning/biz-partners-controller/create.e2e.ts --all

e2e-files: pre-test
    npx yarn test:e2e --findRelatedTests \
                test/w-hra-planning/sale-orders-controller/create.e2e.ts \
                # test/w-hra-modules/shipments/use-cases/commands/shipments/create/create.e2e.ts \
                # test/w-hra-modules/shipments/use-cases/commands/shipments/create/another.create.e2e.ts \
                # test/w-hra-planning/shipments-controller/create.e2e.ts \
                --all

e2e-folder name: pre-test
    clear
    npx yarn test:e2e --testPathPattern=test/{{name}}

e2e-w-hra-modules: pre-test
    clear
    npx yarn test:e2e --testPathPattern=test/w-hra-modules

s:
    clear
    npx yarn start:dev