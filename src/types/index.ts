export type ColorsUnion = string; //"red" | "green" | "blue" | "yellow"; // может быть расширяемым

export type ColorData = Record<string, string>;
//   тоже может быть любым
// {
//   main: string;
//   dark: string;
//   light: string;
//   extra: string;
// };

export type InputModel<T extends string = string> = Record<
  T,
  Record<string, string>
>;
