import type { InputModel } from "src/types";
import type { ToneCallback } from "src/utils/createTone";

export type PaletteOptions<
  TBase extends ToneCallback<any> | undefined = undefined,
  TTones extends Record<string, ToneCallback<any>> | undefined = undefined
> = {
  base?: TBase;
  tones?: TTones;
};

export type BaseReturn<T extends ToneCallback<any>> = T extends ToneCallback<
  infer R
>
  ? R
  : never;

// Тип результата одного тона (включая subtone)
export type ToneWithSubtones<T extends ToneCallback<any>> = BaseReturn<T> & {
  [K in keyof T["meta"]["subtone"]]?: 
    T["meta"]["subtone"][K] extends (model: InputModel) => infer R ? R : never;
};

