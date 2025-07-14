# use PowerShell instead of sh:
set windows-shell := ["powershell.exe", "-NoLogo", "-Command"]

default:
    clear
    just --list

i:
    clear
    rm -rf node_modules
    yarn install

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
    npx yarn test:e2e -f test/new-app-tests/m-main-app/commands/create-biz-partner.e2e.ts --all

e2e-files: pre-test
    npx yarn test:e2e --findRelatedTests \
                test/tariffs-module/tariffs/save.e2e.ts \
                --all

e2e-folder name: pre-test
    clear
    npx yarn test:e2e --testPathPattern=test/{{name}}

e2e-new: pre-test
    clear
    npx yarn test:e2e --testPathPattern=test/new-app-tests

s:
    clear
    yarn start:dev