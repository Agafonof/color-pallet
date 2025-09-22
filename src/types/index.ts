type ColorsUnion = "red" | "green" | "blue" | "yellow"; // может быть расширяемым
type ColorData = {
  // тоже может быть любым
  main: string;
  dark: string;
  light: string;
  extra: string;
};

type InputModel = Record<ColorsUnion, ColorData>;
