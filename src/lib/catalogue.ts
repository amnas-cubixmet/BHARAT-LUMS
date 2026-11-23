const families = [
  [
    "linear-led-lighting",
    "Linear LED Lighting",
    "Clean, continuous lines for ceilings, walls and suspended installations.",
    "linear",
  ],
  [
    "architectural-lighting",
    "Architectural Lighting",
    "Light that follows the structure and reveals its material.",
    "recessed",
  ],
  [
    "pendant-lighting",
    "Pendant Lighting",
    "Suspended fixtures that define the space below.",
    "linear",
  ],
  [
    "track-lighting",
    "Track Lighting",
    "Adjustable light for changing displays and layouts.",
    "track",
  ],
  [
    "magnetic-track-lighting",
    "Magnetic Track Lighting",
    "A flexible track layout for directional and diffuse fixtures.",
    "track",
  ],
  [
    "recessed-lighting",
    "Recessed Lighting",
    "Light integrated into the ceiling plane.",
    "recessed",
  ],
  [
    "surface-mounted-lighting",
    "Surface-Mounted Lighting",
    "Direct-mounted profiles for exposed ceilings and walls.",
    "linear",
  ],
  [
    "downlights",
    "Downlights",
    "Discrete overhead lighting for circulation and task areas.",
    "track",
  ],
  [
    "spotlights",
    "Spotlights",
    "Focused light for artwork, merchandise and textured surfaces.",
    "track",
  ],
  [
    "high-bay-industrial-lighting",
    "High Bay Industrial Lighting",
    "Lighting concepts for tall, open working spaces.",
    "office",
  ],
  [
    "floodlights",
    "Floodlights",
    "Broad-area lighting for façades and outdoor spaces.",
    "hero",
  ],
  [
    "outdoor-lighting",
    "Outdoor Lighting",
    "Lighting concepts for building edges, paths and entrances.",
    "hero",
  ],
  [
    "commercial-lighting",
    "Commercial Lighting",
    "Layered light for offices, shops and shared interiors.",
    "office",
  ],
  [
    "decorative-lighting",
    "Decorative Lighting",
    "Fixtures that shape the character of an interior.",
    "dining",
  ],
  [
    "smart-lighting",
    "Smart Lighting",
    "Controllable lighting concepts for changing needs.",
    "living",
  ],
  [
    "modular-lighting-systems",
    "Modular Lighting Systems",
    "Linked sections for uninterrupted runs and geometric layouts.",
    "recessed",
  ],
] as const;

export const collections = families.map(([slug, name, description, image]) => ({
  slug,
  name,
  description,
  image,
}));
export const featuredCollections = [
  collections[0],
  collections[5],
  collections[4],
];
export const artwork = (name: string) => `/images/${name}.webp`;

export const products = [
  {
    slug: "suspended-linear",
    name: "Suspended Linear",
    image: "linear",
    gallery: ["office", "living"],
    categories: [
      "linear-led-lighting",
      "pendant-lighting",
      "architectural-lighting",
      "commercial-lighting",
    ],
    description:
      "A slim, suspended bar that keeps the overhead silhouette clear.",
    features: [
      "Straight LED profile",
      "Suspended mounting concept",
      "Single or parallel arrangements",
    ],
    applications:
      "Worktables, kitchen islands, reception desks and meeting rooms.",
  },
  {
    slug: "recessed-linear",
    name: "Recessed Continuous Line",
    image: "recessed",
    gallery: ["hero", "office"],
    categories: [
      "linear-led-lighting",
      "recessed-lighting",
      "architectural-lighting",
      "modular-lighting-systems",
    ],
    description:
      "A continuous line of light integrated into a ceiling or wall plane.",
    features: [
      "Recessed profile",
      "Continuous architectural runs",
      "Corner layouts",
    ],
    applications: "Corridors, gallery entrances and ceiling details.",
  },
  {
    slug: "magnetic-spot-track",
    name: "Magnetic Spot Track",
    image: "track",
    gallery: ["dining"],
    categories: [
      "track-lighting",
      "magnetic-track-lighting",
      "spotlights",
      "downlights",
      "commercial-lighting",
    ],
    description:
      "A directional track concept for accenting objects and surfaces.",
    features: [
      "Directional heads",
      "Repositionable layout concept",
      "Targeted accent lighting",
    ],
    applications: "Retail displays, hospitality interiors and galleries.",
  },
  {
    slug: "surface-linear",
    name: "Surface Linear Profile",
    image: "linear",
    gallery: ["recessed"],
    categories: [
      "linear-led-lighting",
      "surface-mounted-lighting",
      "modular-lighting-systems",
    ],
    description:
      "A low-profile linear fixture for mounting against a ceiling or wall.",
    features: [
      "Direct mounting concept",
      "Straight and joining runs",
      "Clean diffuser line",
    ],
    applications: "Circulation areas, workspaces and exposed ceilings.",
  },
  {
    slug: "modular-corner",
    name: "Modular Corner System",
    image: "recessed",
    gallery: ["hero"],
    categories: [
      "linear-led-lighting",
      "modular-lighting-systems",
      "architectural-lighting",
    ],
    description:
      "Joined linear profiles that trace corners and geometric details.",
    features: [
      "Corner geometry",
      "Linked segments",
      "Suspended or recessed concepts",
    ],
    applications: "Lobbies, showrooms and architectural ceiling layouts.",
  },
];

export const projectCategories = [
  "Residential",
  "Hospitality",
  "Commercial",
  "Corporate",
  "Retail",
  "Restaurants",
  "Architecture",
  "Outdoor Spaces",
];

export const projects = [
  {
    slug: "the-quiet-residence",
    name: "The Quiet Residence",
    category: "Residential",
    image: "living",
    gallery: "linear",
    overview:
      "A living room study that balances an illuminated gathering area with dark, quiet edges.",
    approach:
      "A suspended line draws attention to the seating area. Soft ambient light keeps the surrounding concrete and fabric readable.",
    application: "Suspended Linear",
    product: "suspended-linear",
  },
  {
    slug: "after-hours",
    name: "After Hours",
    category: "Restaurants",
    image: "dining",
    gallery: "track",
    overview:
      "A restaurant lighting study that uses low ambient light and warm highlights around each table.",
    approach:
      "Concentrate light on the tables and wash the wall behind them. Keep the fixture profiles visually quiet.",
    application: "Magnetic Spot Track",
    product: "magnetic-spot-track",
  },
  {
    slug: "a-line-through-the-room",
    name: "A Line Through the Room",
    category: "Corporate",
    image: "office",
    gallery: "recessed",
    overview:
      "A boardroom concept organized around long lines and a single shared table.",
    approach:
      "Parallel suspended profiles follow the table and give the room a clear axis without competing with its glazing.",
    application: "Suspended Linear",
    product: "suspended-linear",
  },
  {
    slug: "the-retail-study",
    name: "The Retail Study",
    category: "Retail",
    image: "track",
    gallery: "recessed",
    overview:
      "A retail concept that uses directional accents to organize a changing display.",
    approach:
      "Aim individual fixtures at key surfaces and leave circulation space with softer general illumination.",
    application: "Magnetic Spot Track",
    product: "magnetic-spot-track",
  },
  {
    slug: "the-arrival-gallery",
    name: "The Arrival Gallery",
    category: "Architecture",
    image: "hero",
    gallery: "office",
    overview:
      "Suspended lines define the height and depth of an arrival lobby.",
    approach:
      "Vary the suspension height to emphasize the ceiling volume and reveal the floor as people enter.",
    application: "Modular Corner System",
    product: "modular-corner",
  },
];

export type Product = (typeof products)[number];
export type Project = (typeof projects)[number];
export type Collection = (typeof collections)[number];
