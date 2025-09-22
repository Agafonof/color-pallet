import type { ColorData, ColorsUnion, InputModel } from "src/types";

// тип результата одного subtone (любой набор полей)
export type SubtoneReturn = Record<string, unknown>;

// Опции для createTone
export type ToneOptions<Subtone extends SubtoneReturn = SubtoneReturn> = {
  name?: string;
  subtone?: Record<string, (data: ColorData) => Subtone>;
};

// Тип для возвращаемой функции createTone
export type ToneCallback<Return> = {
  (model: InputModel): Record<ColorsUnion, Return>;
  meta: {
    name?: string;
    subtone?: Record<string, (data: ColorData) => SubtoneReturn>;
  };
};
