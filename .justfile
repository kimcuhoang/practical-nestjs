# use PowerShell instead of sh:
set windows-shell := ["powershell.exe", "-NoLogo", "-Command"]

registry-url := "http://localhost:4873"

default:
    clear
    just --list

init:
    clear
    rm -rf ./**/node_modules
    rm -rf ./**/yarn.lock
    yarn install

ws workspace *command:
    clear
    yarn workspace @kch/{{workspace}} {{command}}

ws-db-reset workspace:
    clear
    yarn workspace @kch/{{workspace}} db:drop
    yarn workspace @kch/{{workspace}} db:create

ws-test-pre workspace:
    clear
    yarn workspace @kch/{{workspace}} test:pre

nest-new project:
    clear
    nest new {{project}}

publish workspace:
    clear
    yarn workspace @kch/{{workspace}} build
    yarn workspace @kch/{{workspace}} publish --registry {{registry-url}}

unpublish package:
    clear
    npm unpublish --registry {{registry-url}} @kch/{{package}} --force

y-add workspace package:
    clear
    yarn workspace @kch/{{workspace}} add @kch/{{package}} --registry {{registry-url}}

y-remove workspace package:
    clear
    yarn workspace @kch/{{workspace}} remove @kch/{{package}}
    

# db-create:
#     clear
#     yarn db:create

# db-drop:
#     clear
#     yarn db:drop

# db-reset: db-drop db-create

# gen-migration feature name: b
#     clear
#     yarn typeorm:generate-migration src/{{feature}}/persistence/migrations/{{name}}

# run-migration: b
#     clear
#     yarn typeorm:run-migrations

# pre-test: b
#     # yarn jest --clearCache

# e2e: pre-test
#     clear
#     yarn test:e2e

# e2e-file: pre-test
#     clear
#     yarn test:e2e -f test/projects/persistence/test-bulk-insert.e2e.ts --all

# e2e-files: pre-test
#     yarn test:e2e --findRelatedTests \
#                 test/notifications/event-handlers/project-created.handler.e2e.ts \
#                 test/projects/commands/test-bulk-insert-command.e2e.ts \
#                 --all

# e2e-folder name: pre-test
#     clear
#     yarn test:e2e --testPathPattern=test/{{name}}

# s:
#     clear
#     yarn start:dev