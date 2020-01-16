BUILDDIR=__build

if [ -d "$BUILDDIR" ]; then
  rm -rf $BUILDDIR
fi

mkdir $BUILDDIR
cp -rf ./{server,dist,package-lock.json,nuxt.config.js,config} ./$BUILDDIR

DIST=$BUILDDIR node builder.js