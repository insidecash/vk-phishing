BUILDDIR=__build

mkdir $BUILDDIR
cp -rf ./{server,dist,package-lock.json,nuxt.config.js,config} ./$BUILDDIR

DIST=$BUILDDIR node builder.js