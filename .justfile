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

e2e: b
    clear
    yarn test:e2e

e2e-file: b
    clear
    yarn test:e2e -f test/app.e2e.ts --all

e2e-folder name: b
    clear
    yarn test:e2e --testPathPattern=test/{{name}}

start:
    clear
    yarn start:dev