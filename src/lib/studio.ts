export const arrangements = [
  "Single",
  "Parallel pair",
  "Suspended trio",
  "Continuous",
  "Horizontal",
  "Vertical",
  "Geometric",
] as const;
export const finishes = ["Black", "White", "Aluminum"] as const;
export const mountings = ["Suspended", "Surface", "Recessed"] as const;
export const environments = [
  "Living room",
  "Office",
  "Retail store",
  "Restaurant",
] as const;
export const temperatures = [
  { value: 2700, label: "Warm white", color: "#ffb66c" },
  { value: 4000, label: "Neutral white", color: "#fff0d7" },
  { value: 6500, label: "Cool white", color: "#c4ddff" },
] as const;

export type Setup = {
  brightness: number;
  temperature: (typeof temperatures)[number]["value"];
  power: boolean;
  arrangement: (typeof arrangements)[number];
  finish: (typeof finishes)[number];
  mounting: (typeof mountings)[number];
  environment: (typeof environments)[number];
};

export const defaultSetup: Setup = {
  brightness: 80,
  temperature: 2700,
  power: true,
  arrangement: "Suspended trio",
  finish: "Black",
  mounting: "Suspended",
  environment: "Office",
};

export const finishColor: Record<Setup["finish"], string> = {
  Black: "#26262a",
  White: "#e8e4df",
  Aluminum: "#9ca3aa",
};

type Fixture = {
  x: number;
  z: number;
  length: number;
  angle: number;
  vertical?: boolean;
};

export const fixtures: Record<Setup["arrangement"], Fixture[]> = {
  Single: [{ x: 0, z: 0, length: 4, angle: 0 }],
  "Parallel pair": [
    { x: 0, z: -0.7, length: 4, angle: 0 },
    { x: 0, z: 0.7, length: 4, angle: 0 },
  ],
  "Suspended trio": [-1.2, 0, 1.2].map((z) => ({
    x: 0,
    z,
    length: 4.2,
    angle: 0,
  })),
  Continuous: [-1.8, 0, 1.8].map((x) => ({ x, z: 0, length: 1.78, angle: 0 })),
  Horizontal: [
    { x: 0, z: 0, length: 4.4, angle: Math.PI / 2 },
    { x: 1.2, z: 0.2, length: 3.2, angle: Math.PI / 2 },
  ],
  Vertical: [-1.7, 0, 1.7].map((x) => ({
    x,
    z: -2.38,
    length: 2.3,
    angle: 0,
    vertical: true,
  })),
  Geometric: [
    { x: -0.7, z: -0.8, length: 3.4, angle: 0 },
    { x: 0.96, z: 0.42, length: 2.5, angle: Math.PI / 2 },
    { x: 2.14, z: 1.64, length: 2.4, angle: 0 },
  ],
};

export function summarizeSetup(setup: Setup) {
  return [
    setup.environment,
    setup.arrangement,
    setup.mounting,
    setup.finish,
    `${setup.temperature} K`,
    `${setup.brightness}% brightness`,
    `Power ${setup.power ? "on" : "off"}`,
  ].join(" · ");
}

export function setupQuery(setup: Setup) {
  return new URLSearchParams({
    environment: setup.environment,
    arrangement: setup.arrangement,
    mounting: setup.mounting,
    finish: setup.finish,
    temperature: String(setup.temperature),
    brightness: String(setup.brightness),
    power: setup.power ? "on" : "off",
  }).toString();
}
