IF EXIST src\ (
  npm install
  npm run build
) ELSE (
  npm install --only=prod
)
