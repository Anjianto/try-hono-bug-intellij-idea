if command -v dotenv > /dev/null; then
  echo "dotenv-cli command is available."
else
  echo "dotenv-cli command is not available."
  exit 1
fi

if [ -f ".env.test" ]; then
  echo ".env.test file exists in the current root project."
else
  echo ".env.test file does not exist in the current root project."
  exit 1
fi

if [ -f ".env" ]; then
  ENV_DATABASE_URL=$(grep -w "DATABASE_URL" .env | cut -d '=' -f2)
  TEST_ENV_DATABASE_URL=$(grep -w "DATABASE_URL" .env.test | cut -d '=' -f2)

  if [ "$ENV_DATABASE_URL" = "$TEST_ENV_DATABASE_URL" ]; then
    echo "DATABASE_URL in .env.test is the same as in .env. Please change DATABASE_URL on .env.test"
    exit 1
  fi
else
  echo ".env file does not exist in the current root project."
  exit 1
fi

echo "Reset testing database"
dotenv -e .env.test -- pnpm prisma migrate reset -f

printf "\n"
