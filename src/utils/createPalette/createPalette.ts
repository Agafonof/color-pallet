import type { ColorData, ColorsUnion, InputModel } from "src/types";
import type { ToneCallback } from "src/utils/createTone";

// пары [ключ, данные цвета]
type ColorEntry = [ColorsUnion, ColorData];

export const createPalette = <
  TBase extends ToneCallback<any> | undefined = undefined,
  TTones extends Record<string, ToneCallback<any>> | undefined = undefined
>(
  model: InputModel,
  options?: {
    base?: TBase;
    tones?: TTones;
  }
) => {
  const result: Record<string, any> = {};

  // массив записей с корректной типизацией
  const colorEntries: ColorEntry[] = Object.entries(model) as ColorEntry[];

  // массив записей тонов с корректной типизацией, если их нет — пустой массив
  const tonesEntries = options?.tones ? Object.entries(options.tones) : [];

  // для каждого цвета
  for (const [colorKey, colorData] of colorEntries) {
    //  базовый цвет: применяем базовый transform (если есть)
    if (options?.base) {
      const baseColor = options.base(model)[colorKey];
      result[colorKey] = {
        ...colorData, // сохраняем main/dark/light/extra
        ...baseColor, // добавляем background, color и т.п.
      };
    }

    //  для каждого дополнительного тона
    for (const [toneKey, toneFn] of tonesEntries) {
      const toneName = toneFn.meta.name || toneKey; // используем meta.name, если есть
      const toneResult = toneFn(model)[colorKey];
      // основной transform тона (без подтонов)
      result[`${colorKey}_${toneName}`] = toneResult;

      //  если есть подтон, применяем его к текущему цвету
      const subtoneEntries = toneFn.meta.subtone
        ? Object.entries(toneFn.meta.subtone)
        : [];
      for (const [subName, subFn] of subtoneEntries) {
        const subToneResult = subFn(colorData);
        // результат для конкретного подтон + тон + цвет
        result[`${colorKey}_${subName}_${toneName}`] = subToneResult;
      }
    }
  }

  return result as Record<string, any>;
};
