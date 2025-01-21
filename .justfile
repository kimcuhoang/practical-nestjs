# use PowerShell instead of sh:
set windows-shell := ["powershell.exe", "-NoLogo", "-Command"]

i:
    clear
    rm -rf node_modules
    yarn install

b: 
    clear
    yarn build

db-create:
    clear
    yarn db:create

db-drop:
    clear
    yarn db:drop

db-reset: db-drop db-create

gen-migration feature name: b
    clear
    yarn typeorm:generate-migration src/{{feature}}/persistence/migrations/{{name}}

run-migration: b
    clear
    yarn typeorm:run-migrations

pre-test: b
    yarn jest --clearCache

e2e: pre-test
    clear
    yarn test:e2e

e2e-file: pre-test
    clear
    yarn test:e2e -f test/localizations/app.localizations.e2e.ts --all

e2e-files: pre-test
    yarn test:e2e --findRelatedTests \
                test/localizations/app.localizations.e2e.ts \
                test/projects/create.e2e.ts \
                --all

e2e-folder name: pre-test
    clear
    yarn test:e2e --testPathPattern=test/{{name}}

s:
    clear
    yarn start:dev