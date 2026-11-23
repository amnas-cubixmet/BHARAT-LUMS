type FixturePhoto = {
  image: string;
  name: string;
  wattage?: number;
  rating?: string;
};

type FixturePhotoGroup = {
  title: string;
  description: string;
  photos: FixturePhoto[];
};

const labelNote =
  "Brand, wattage and IP rating are transcribed from the photographed labels. Contact us to confirm availability and request a datasheet.";

export const fixturePhotoGroups: Partial<Record<string, FixturePhotoGroup>> = {
  "led-flood-light": {
    title: "Oreli flood light variants",
    description: labelNote,
    photos: [
      { image: "oron-30", name: "OFL-ORON", wattage: 30, rating: "IP65" },
      { image: "oron-50", name: "OFL-ORON", wattage: 50, rating: "IP65" },
      { image: "oron-100", name: "OFL-ORON", wattage: 100, rating: "IP65" },
      { image: "glowbee-150", name: "OFL-GlowBee", wattage: 150, rating: "IP65" },
      { image: "glowbee-200", name: "OFL-GlowBee", wattage: 200, rating: "IP65" },
      { image: "vimio-150", name: "VIMIO15D150", wattage: 150, rating: "IP65" },
    ],
  },
  "led-street-light": {
    title: "Oreli street light variants",
    description: labelNote,
    photos: [
      { image: "neona-18", name: "OSL-NEONA", wattage: 18, rating: "IP65" },
      { image: "neona-24", name: "OSL-NEONA", wattage: 24, rating: "IP65" },
      { image: "neona-50", name: "OSL-NEONA", wattage: 50, rating: "IP65" },
      { image: "neona-100", name: "OSL-NEONA", wattage: 100, rating: "IP65" },
      { image: "novapro-50", name: "OSL-NOVAPRO", wattage: 50 },
      { image: "novapro-100", name: "OSL-NOVAPRO", wattage: 100 },
    ],
  },
  "led-high-bay-light": {
    title: "Round fixture photo references",
    description:
      "These photos show round fixture designs and reflector options. Model numbers, mounting applications and ratings are unconfirmed.",
    photos: [
      { image: "round-black-exposed", name: "Black round fixture with exposed LED board" },
      { image: "round-black-grouped", name: "Black round fixture with grouped lens modules" },
      { image: "round-black-multilens", name: "Black bracket-mounted multi-lens fixture" },
      { image: "round-silver-multilens", name: "Silver bracket-mounted multi-lens fixture" },
      { image: "reflector-grouped", name: "Round reflector with grouped lenses" },
      { image: "reflector-exposed", name: "Round reflector with exposed LED board" },
      { image: "reflector-dark-ring", name: "Large round reflector with dark inner ring" },
    ],
  },
  "led-warehouse-light": {
    title: "Linear fixture photo references",
    description:
      "These photos show single-bar and dual-bar fixtures. Model numbers, mounting applications and ratings are unconfirmed.",
    photos: [
      { image: "linear-single", name: "Single-bar modular LED fixture" },
      { image: "linear-dual", name: "Dual-bar modular LED fixture" },
    ],
  },
};
