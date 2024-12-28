sh ./pretest.sh

dotenv -e .env.test -- pnpm vitest -c vitest.config.api.ts --no-file-parallelism
