
# use PowerShell instead of sh:
set windows-shell := ["powershell.exe", "-NoLogo", "-Command"]

alias am := add-migrations
alias rm := run-migrations

build: 
    clear
    yarn build

add-migrations name: build
    yarn typeorm:generate-migration {{name}}

run-migrations: build
    yarn typeorm:run-migrations

tests: build
    yarn test:e2e

e2e name: build
    yarn test:e2e -f {{name}} --all