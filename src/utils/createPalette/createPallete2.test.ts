import { describe, it, expect } from "vitest"; // или 'jest', если используешь Jest
import { createPalette } from "./createPalette";
import { createTone } from "../createTone";
import type { InputModel } from "src/types";

const input: InputModel = {
  red: { main: "red", dark: "darkred", light: "lightred", extra: "extrared" },
  green: {
    main: "green",
    dark: "darkgreen",
    light: "lightgreen",
    extra: "extragreen",
  },
};

describe("createPalette", () => {
  it("генерирует палитру только с базовым цветом", () => {
    const base = createTone((data) => ({
      background: data.main,
      color: data.main,
    }));
    const colors = createPalette(input, { base });
    expect(colors.red).toEqual({
      main: "red",
      dark: "darkred",
      light: "lightred",
      extra: "extrared",
      background: "red",
      color: "red",
    });
    expect(colors.green).toEqual({
      main: "green",
      dark: "darkgreen",
      light: "lightgreen",
      extra: "extragreen",
      background: "green",
      color: "green",
    });
  });

  it("генерирует палитру с одним тоном без подтонов", () => {
    const tone = createTone((data) => ({ foreground: data.main }));
    const colors = createPalette(input, { tones: { tone } });
    expect(colors.red_tone).toEqual({ foreground: "red" });
    expect(colors.green_tone).toEqual({ foreground: "green" });
  });

  it("генерирует палитру с подтоном", () => {
    const tone = createTone((data) => ({ foreground: data.main }), {
      subtone: { light: (d) => ({ shadow: d.light }) },
    });
    const colors = createPalette(input, { tones: { tone } });
    expect(colors.red_tone).toEqual({ foreground: "red" });
    expect(colors.red_light_tone).toEqual({ shadow: "lightred" });
    expect(colors.green_light_tone).toEqual({ shadow: "lightgreen" });
  });

  it("поддерживает несколько тонов с разными подтонами", () => {
    const brightness = createTone((data) => ({ foreground: data.main }), {
      name: "brightness",
      subtone: { low: (d) => ({ white: d.light }) },
    });
    const depth = createTone((data) => ({ background: data.light }), {
      name: "depth",
      subtone: { high: (d) => ({ border: d.dark }) },
    });

    const colors = createPalette(input, { tones: { brightness, depth } });

    expect(colors.red_brightness).toEqual({ foreground: "red" });
    expect(colors.red_low_brightness).toEqual({ white: "lightred" });
    expect(colors.red_depth).toEqual({ background: "lightred" });
    expect(colors.red_high_depth).toEqual({ border: "darkred" });

    expect(colors.green_brightness).toEqual({ foreground: "green" });
    expect(colors.green_low_brightness).toEqual({ white: "lightgreen" });
    expect(colors.green_depth).toEqual({ background: "lightgreen" });
    expect(colors.green_high_depth).toEqual({ border: "darkgreen" });
  });

  it("базовый объект цвета расширяется, а не заменяется", () => {
    const base = createTone((data) => ({
      background: data.main,
      color: data.main,
    }));
    const brightness = createTone((data) => ({ foreground: data.main }));

    const colors = createPalette(input, { base, tones: { brightness } });
    expect(colors.red).toHaveProperty("main", "red");
    expect(colors.red).toHaveProperty("background", "red");
    expect(colors.red).toHaveProperty("color", "red");
    expect(colors.red_brightness).toEqual({ foreground: "red" });
  });
});
