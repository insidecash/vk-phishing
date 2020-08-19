mkdir -p build

cp -r ./static ./build
cp -r ./plugins ./build
cp -r ./__sapper__ ./build
cp -r ./{config.yml,package.json,package-lock.json} ./build
