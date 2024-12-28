import { z, ZodObject, ZodRawShape } from "zod";

export const validate = async <T extends ZodObject<ZodRawShape>>(
  schema: T,
  values: unknown,
) => {
  const resultSchema = await schema.safeParseAsync(values);

  const errors = resultSchema.error?.errors.reduce<Record<string, string[]>>(
    (acc, error) => {
      const path = error.path.join(".");
      if (acc[path]) {
        acc[path] = [...acc[path], error.message];
      } else {
        acc[path] = [error.message];
      }
      return acc;
    },
    {},
  );

  return {
    success: resultSchema.success,
    data: (resultSchema.data as z.output<typeof schema>) || null,
    errors: errors || null,
  };
};
