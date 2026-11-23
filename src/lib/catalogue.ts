const ledFamilies = [
  [
    "floodlights",
    "LED Flood Lights",
    "Wide-area lighting for façades, yards and project sites.",
    "products/flood-light",
  ],
  [
    "led-street-lights",
    "LED Street Lights",
    "Pole-mounted lighting concepts for roads and access routes.",
    "products/street-light",
  ],
  [
    "high-bay-industrial-lighting",
    "LED High Bay Lights",
    "Overhead lighting concepts for tall industrial spaces.",
    "products/high-bay",
  ],
  [
    "led-industrial-lights",
    "LED Industrial Lights",
    "Industrial fixtures for manufacturing areas and utility spaces.",
    "products/industrial-batten",
  ],
  [
    "commercial-lighting",
    "LED Commercial Lights",
    "Lighting concepts for shops, workplaces and shared buildings.",
    "products/commercial-troffer",
  ],
  [
    "led-panel-lights",
    "LED Panel Lights",
    "Slim luminous panels for modular ceilings and interiors.",
    "products/panel-light",
  ],
  [
    "led-office-lights",
    "LED Office Lights",
    "Lighting concepts for workstations, meeting rooms and offices.",
    "products/office-linear",
  ],
  [
    "outdoor-lighting",
    "LED Outdoor Lights",
    "Architectural lighting for paths, entrances and landscapes.",
    "products/outdoor-bollard",
  ],
  [
    "led-high-mast-lighting",
    "LED High Mast Lighting",
    "Elevated luminaires for large open sites.",
    "products/high-mast",
  ],
  [
    "led-warehouse-lighting",
    "LED Warehouse Lighting",
    "Overhead lighting for storage aisles and distribution facilities.",
    "products/warehouse-high-bay",
  ],
] as const;

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

const collectionFrom = ([slug, name, description, image]: readonly [
  string,
  string,
  string,
  string,
]) => ({
  slug,
  name,
  description,
  image,
});
export const catalogueCategories = ledFamilies.map(collectionFrom);
export const collections = [
  ...families.map(collectionFrom),
  ...catalogueCategories,
];
export const featuredCollections = [
  collections[0],
  collections[5],
  collections[4],
];
export const artwork = (name: string) => `/images/${name}.webp`;

export type ProductImage = {
  src: string;
  alt: string;
  label: string;
  representative: boolean;
};

export type Product = {
  slug: string;
  name: string;
  images: [ProductImage, ...ProductImage[]];
  categories: string[];
  description: string;
  features: string[];
  applications: string;
  status: "draft" | "verified";
  wattages?: number[];
  specifications?: { name: string; value: string }[];
  datasheet?: `/${string}.pdf`;
  catalogue?: `/${string}.pdf`;
};

function representativeImage(file: string, alt: string) {
  return {
    status: "draft" as const,
    images: [
      {
        src: artwork(`products/${file}`),
        alt,
        label: "Fixture view",
        representative: true,
      },
      {
        src: artwork(`products/${file}-detail`),
        alt: `Detail of ${alt.toLowerCase()}`,
        label: "Detail crop",
        representative: true,
      },
    ] satisfies Product["images"],
  };
}

const ledConcepts: Product[] = [
  {
    slug: "led-flood-light",
    name: "LED Flood Light",
    categories: ["floodlights", "led-high-mast-lighting"],
    ...representativeImage(
      "flood-light",
      "Rectangular LED flood light with an adjustable bracket",
    ),
    description:
      "A rectangular floodlight concept with an adjustable bracket for aiming.",
    features: ["Rectangular fixture body", "Yoke-style mounting bracket"],
    applications: "Building façades, open yards and outdoor work areas.",
  },
  {
    slug: "led-street-light",
    name: "LED Street Light",
    categories: ["led-street-lights", "outdoor-lighting"],
    ...representativeImage(
      "street-light",
      "Silver LED street light head with a pole mounting socket",
    ),
    description:
      "An elongated LED luminaire concept for pole-mounted road lighting.",
    features: ["Slim pole-top housing", "Downward-facing lens array"],
    applications: "Access roads, site entrances and parking circulation.",
  },
  {
    slug: "led-high-bay-light",
    name: "LED High Bay Light",
    categories: [
      "high-bay-industrial-lighting",
      "led-industrial-lights",
      "led-warehouse-lighting",
    ],
    ...representativeImage(
      "high-bay",
      "Round black high bay light with cooling fins",
    ),
    description:
      "A circular hanging fixture concept for tall ceilings and open interiors.",
    features: ["Circular fixture body", "Suspended mounting concept"],
    applications: "Production halls, workshops and open storage spaces.",
  },
  {
    slug: "led-industrial-light",
    name: "LED Industrial Batten",
    categories: ["led-industrial-lights", "led-warehouse-lighting"],
    ...representativeImage(
      "industrial-batten",
      "Industrial LED batten with a rounded frosted cover and side clips",
    ),
    description: "An enclosed linear fixture concept for industrial spaces.",
    features: ["Linear housing", "Frosted cover and side clips"],
    applications: "Utility passages, work areas and manufacturing facilities.",
  },
  {
    slug: "led-commercial-light",
    name: "LED Commercial Troffer",
    categories: ["commercial-lighting", "led-office-lights"],
    ...representativeImage(
      "commercial-troffer",
      "Recessed commercial LED troffer with white diffusing channels",
    ),
    description: "A recessed ceiling fixture concept with diffusing channels.",
    features: ["Ceiling-grid form", "Integrated diffuser channels"],
    applications: "Retail interiors, shared workspaces and reception areas.",
  },
  {
    slug: "led-panel-light",
    name: "LED Flat Panel",
    categories: [
      "led-panel-lights",
      "led-office-lights",
      "commercial-lighting",
    ],
    ...representativeImage(
      "panel-light",
      "Square white LED flat panel with a slim perimeter frame",
    ),
    description: "A thin square fixture concept with a broad luminous face.",
    features: ["Square form factor", "Frosted face"],
    applications: "Modular ceilings, clinics and other commercial interiors.",
  },
  {
    slug: "led-office-light",
    name: "LED Office Linear Light",
    categories: ["led-office-lights", "commercial-lighting"],
    ...representativeImage(
      "office-linear",
      "White suspended office luminaire with a continuous diffuser",
    ),
    description:
      "A suspended, white linear fixture concept for workplace layouts.",
    features: ["Cable suspension concept", "Continuous linear diffuser"],
    applications: "Desk clusters, meeting rooms and office circulation.",
  },
  {
    slug: "led-outdoor-light",
    name: "LED Outdoor Bollard",
    categories: ["outdoor-lighting"],
    ...representativeImage(
      "outdoor-bollard",
      "Black rectangular outdoor bollard with a recessed light window",
    ),
    description:
      "A freestanding outdoor fixture concept with a recessed light opening.",
    features: ["Upright rectangular housing", "Recessed light opening"],
    applications: "Paths, entrances and landscaped circulation areas.",
  },
  {
    slug: "led-high-mast",
    name: "LED High Mast Assembly",
    categories: ["led-high-mast-lighting", "floodlights"],
    ...representativeImage(
      "high-mast",
      "High mast assembly with multiple LED luminaires on a circular support",
    ),
    description:
      "A high mast lighting concept with multiple individually aimed luminaires.",
    features: ["Circular luminaire support", "Multi-head arrangement"],
    applications: "Sports grounds, logistics yards and large outdoor sites.",
  },
  {
    slug: "led-warehouse-light",
    name: "LED Warehouse Linear High Bay",
    categories: [
      "led-warehouse-lighting",
      "led-industrial-lights",
      "high-bay-industrial-lighting",
    ],
    ...representativeImage(
      "warehouse-high-bay",
      "Rectangular warehouse high bay with two parallel rows of lenses",
    ),
    description:
      "A linear high bay fixture concept for storage and distribution spaces.",
    features: ["Rectangular overhead housing", "Parallel linear lens rows"],
    applications: "Warehouse aisles, loading areas and distribution halls.",
  },
];

const architecturalConcepts: Product[] = [
  {
    slug: "suspended-linear",
    name: "Suspended Linear",
    ...representativeImage(
      "suspended-linear",
      "Suspended black linear LED bar with two cables",
    ),
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
    ...representativeImage(
      "recessed-linear",
      "Recessed aluminium lighting channel with a white diffuser",
    ),
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
    ...representativeImage(
      "magnetic-spot-track",
      "Black track rail with two adjustable spotheads",
    ),
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
    ...representativeImage(
      "surface-linear",
      "Surface-mounted silver LED bar with a continuous diffuser",
    ),
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
    ...representativeImage(
      "modular-corner",
      "Black L-shaped linear LED profile with an illuminated strip",
    ),
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

export const products: Product[] = [...ledConcepts, ...architecturalConcepts];

export const publishedProducts = products.filter(
  (product) => product.status === "verified",
);
export const catalogueDownload = publishedProducts.find(
  (product) => product.catalogue,
)?.catalogue;

export function catalogueLabel(product: Product) {
  return product.status === "verified"
    ? "Verified fixture"
    : "Representative fixture";
}

export function relatedProducts(product: Product) {
  return publishedProducts
    .filter((item) => item.slug !== product.slug)
    .filter((item) => score(item) > 0)
    .sort((a, b) => score(b) - score(a))
    .slice(0, 3);

  function score(item: Product) {
    const shared = item.categories.filter((category) =>
      product.categories.includes(category),
    ).length;
    return shared;
  }
}

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

export type Project = (typeof projects)[number];
export type Collection = (typeof collections)[number];
