const DEFAULT_LIMIT = 20;
const DEFAULT_MIN_NUMBER = 0;
const DEFAULT_MAX_NUMBER = Number.MAX_SAFE_INTEGER;

export function defineLimit(
  limit: string | undefined,
  options?: { minNumber?: number; maxNumber?: number }
): number {
  const minNumber =
    typeof options?.minNumber === "number" && !isNaN(options.minNumber)
      ? options.minNumber
      : DEFAULT_MIN_NUMBER;

  const maxNumber =
    typeof options?.maxNumber === "number" && !isNaN(options.maxNumber)
      ? options.maxNumber
      : DEFAULT_MAX_NUMBER;

  const currLimit = Number.isNaN(Number(limit)) ? DEFAULT_LIMIT : Number(limit);

  return Math.max(minNumber, Math.min(maxNumber, currLimit));
}
