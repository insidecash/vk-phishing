mkdir -p build

cp -r ./static ./build
cp -r ./plugins ./build
cp -r ./__sapper__ ./build
cp ./{config.yml,package.json,package-lock.json,yarn.lock,Dockerfile,.dockerignore} ./build
cp ./{install,start}.{sh,bat} ./build
