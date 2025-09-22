import { useState } from "react";
import { input, input1, input2 } from "./constants";

import { createPalette, createTone } from "./utils";

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
      "8-bit": (data) => ({
        borderColor: data.main,
      }),
      "16-bit": (data) => ({
        borderColor: data.main,
        anotherColor: data.light,
      }),
      "24-bit": (data) => ({
        extraColor: data.extra,
      }),
    },
  }
);

const colors = createPalette(input, {
  base: baseColors,
  tones: {
    brightness,
    depths,
  },
});
const colors1 = createPalette(input1, {
  base: baseColors,
  tones: {
    brightness,
    depths,
  },
});
const colors2 = createPalette(input2, {
  base: baseColors,
  tones: {
    brightness,
    depths,
  },
});

const ObjectDisplay: React.FC<{ data: Record<string, any> }> = ({ data }) => (
  <ul>
    {Object.entries(data).map(([key, value]) => (
      <li key={key}>
        <strong>{key}:</strong>{" "}
        {value && typeof value === "object" && !Array.isArray(value) ? (
          <ObjectDisplay data={value} />
        ) : (
          <span>{String(value)}</span>
        )}
      </li>
    ))}
  </ul>
);

const palettes = { colors, colors1, colors2 };
const paletteInputs = { colors: input, colors1: input1, colors2: input2 };

function App() {
  const [activePalette, setActivePalette] =
    useState<keyof typeof palettes>("colors");

  // Берем выбранную палитру
  const selectedColors = palettes[activePalette];

  // Формируем группы цветов
  const colorGroups: { baseColor: string; entries: [string, any][] }[] = [];
  const grouped: Record<string, [string, any][]> = {};

  for (const [key, value] of Object.entries(selectedColors)) {
    const baseColor = key.split("_")[0]; // "red", "blue" и т.д.
    if (!grouped[baseColor]) grouped[baseColor] = [];
    grouped[baseColor].push([key, value] as [string, any]);
  }

  for (const [baseColor, entries] of Object.entries(grouped)) {
    colorGroups.push({ baseColor, entries });
  }

  return (
    <div className="App">
      <h1>Color Palette Demo</h1>
      {/* Чудовищные стили */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
        {Object.entries(paletteInputs).map(([key, palette]) => {
          const colorsArray = Object.values(palette);
          const gradientColors = colorsArray.map((c) => c.main).join(", ");
          return (
            <button
              key={key}
              onClick={() => setActivePalette(key as keyof typeof palettes)}
              style={{
                padding: "8px 16px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                color: "#fff",
                fontWeight: activePalette === key ? "bold" : "normal",
                background: `linear-gradient(90deg, ${gradientColors})`,
              }}
            >
              {key.toUpperCase()}
            </button>
          );
        })}
      </div>

      {/* Отображение цветов */}
      <div className="palette-grid">
        {colorGroups.map((group) => (
          <div key={group.baseColor} style={{ marginBottom: "24px" }}>
            <h2>{group.baseColor}</h2>
            {group.entries.map(([key, value]) => (
              <div className="palette-item" key={key}>
                <div
                  className="color-box"
                  style={{
                    backgroundColor: (value.background || value.main) as string,
                  }}
                >
                  {key}
                </div>
                <ObjectDisplay data={value} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
