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

#### Initial Setup

clean-up-dependencies:
    clear
    rm -rf ./**/node_modules
    rm -rf ./**/yarn.lock
    yarn cache clean
    yarn workspace @kch/m-projects remove \
        @kch/domain-n-typeorm
    yarn workspace @kch/m-people remove \
        @kch/domain-n-typeorm

build-kch-libs: 
    clear
    yarn install
    yarn workspace @kch/domain-n-typeorm dev:pack

install-dependencies: 
    clear
    yarn workspace @kch/m-projects add \
        ../../.zzz/kch-domain-n-typeorm-v0.0.1.tgz
    yarn workspace @kch/m-people add \
        ../../.zzz/kch-domain-n-typeorm-v0.0.1.tgz

build-kch-modules: clean-up-dependencies build-kch-libs install-dependencies
    clear
    yarn workspace @kch/m-projects dev:pack
    yarn workspace @kch/m-people dev:pack

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