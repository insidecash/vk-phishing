if [ -d "./src" ]; then
  npm install
  npm run build
else 
  npm install --only=prod
fi


