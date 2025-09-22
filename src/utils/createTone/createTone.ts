import type { ColorData, ColorsUnion, InputModel } from "../../types";
import type { SubtoneReturn, ToneCallback, ToneOptions } from "./types";

export const createTone = <Return>(
  transform: (data: ColorData) => Return,
  options?: ToneOptions
): ToneCallback<Return> => {
  const toneFn = ((model: InputModel) => {
    const result = {} as Record<ColorsUnion, Return>;
    for (const key in model) {
      const colorKey = key as ColorsUnion;
      result[colorKey] = transform(model[colorKey]);
    }
    return result;
  }) as ToneCallback<Return>;

  // Метаданные
  toneFn.meta = {
    name: options?.name,
    subtone: options?.subtone
      ? Object.entries(options.subtone).reduce((acc, [subName, fn]) => {
          acc[subName] = fn;
          return acc;
        }, {} as Record<string, (data: ColorData) => SubtoneReturn>)
      : undefined,
  };

  return toneFn;
};
