import { describe, it, expect } from "vitest"; // или 'jest', если используешь Jest
import { createPalette } from "./createPalette";
import { createTone } from "../createTone";
import { input, output } from "src/constants";

const baseColors = createTone((data) => ({
  background: data.main,
  color: data.main,
}));

const brightness = createTone(
  (data) => ({
    foreground: data.main,
    customProp: "#f0f0f0",
  }),
  {
    name: "brightness",
    subtone: {
      low: (data) => ({ white: data.light }),
      medium: (data) => ({ shadow: data.main }),
      high: (data) => ({
        someProp: "transparent",
        anotherProp: "#fff",
        thirdCustomProp: data.main,
      }),
      ultra: (data) => ({ intensive: data.extra }),
    },
  }
);

const depths = createTone(
  (data) => ({
    background: data.light,
    foreground: data.main,
    color: data.extra,
  }),
  {
    name: "depth",
    subtone: {
      "8-bit": (data) => ({ borderColor: data.main }),
      "16-bit": (data) => ({
        borderColor: data.main,
        anotherColor: data.light,
      }),
      "24-bit": (data) => ({ extraColor: data.extra }),
    },
  }
);

describe("createPalette", () => {
  it("should generate the correct palette", () => {
    const colors = createPalette(input, {
      base: baseColors,
      tones: { brightness, depths },
    });

    // Сравнение всего объекта
    expect(colors).toEqual(output);
  });

  it("should include base colors", () => {
    const colors = createPalette(input, { base: baseColors });
    expect(colors.red.background).toBe("red");
    expect(colors.green.color).toBe("green");
  });

  it("should include tones without subtone", () => {
    const colors = createPalette(input, { tones: { brightness } });
    expect(colors.red_brightness.foreground).toBe("red");
    expect(colors.red_brightness.customProp).toBe("#f0f0f0");
  });

  it("should include subtone keys", () => {
    const colors = createPalette(input, { tones: { brightness } });
    expect(colors.red_low_brightness.white).toBe("lightred");
    expect(colors.red_high_brightness.someProp).toBe("transparent");
  });
});
