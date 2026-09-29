// ============================================================
// THE YARNIYA — CENTRAL DATA FILE
// Edit this file to add products, change prices, or add photos.
// Nothing here is invented — every price is exactly what was provided.
// Where a price isn't finalized yet, price is null and the UI shows
// "Price to be confirmed" instead of a number.
// ============================================================

const BRAND = {
  name: "The Yarniya",
  tagline: "Handmade with love, one stitch at a time.",
  instagram: "https://www.instagram.com/the_yarniya",
  // TODO: replace with The Yarniya's own WhatsApp business number (digits only,
  // country code first, e.g. "91XXXXXXXXXX"). Until then, WhatsApp ordering
  // is disabled and the site points people to Instagram instead.
  whatsapp: "",
  delivery: "All India Delivery Available",
  cod: "Cash on Delivery is not accepted",
  currency: { code: "INR", symbol: "₹" },
};

// Each product: id, name, category, price (number or null), images (array of
// paths, first = cover), description placeholder, available flag.
const PRODUCTS = [
  {
    id: "crochet-gajra",
    name: "Crochet Gajra",
    category: "hair-accessories",
    price: 499,
    images: ["assets/products/gajra-1.jpg", "assets/products/gajra-2.jpg", "assets/products/gajra-3.jpg"],
    description: "A handmade crochet gajra, finished stitch by stitch and ready to wear.",
    available: true,
  },
  {
    id: "crochet-scrunchies",
    name: "Crochet Scrunchies",
    category: "hair-accessories",
    price: 149,
    images: ["assets/products/scrunchies-1.jpg", "assets/products/scrunchies-2.jpg", "assets/products/scrunchies-3.jpg"],
    description: "Soft, bobble-stitch scrunchies, crocheted by hand.",
    available: true,
  },
  {
    id: "swiss-roll-keychain",
    name: "Swiss Roll Keychain",
    category: "keychains",
    price: 79,
    images: [
      "assets/products/swiss-roll-keychain-1.jpg",
      "assets/products/swiss-roll-keychain-2.jpg",
      "assets/products/swiss-roll-keychain-3.jpg",
      "assets/products/swiss-roll-keychain-4.jpg",
      "assets/products/swiss-roll-keychain-5.jpg",
    ],
    description: "A tiny crocheted swiss roll, made to hang on your keys or bag.",
    available: true,
  },
  {
    id: "floral-bandana",
    name: "Crochet Floral Bandana",
    category: "hair-accessories",
    price: 599,
    images: ["assets/products/floral-bandana-1.jpg", "assets/products/floral-bandana-2.jpg", "assets/products/floral-bandana-3.jpg"],
    description: "A granny-square bandana trimmed with hand-crocheted daisies.",
    available: true,
  },
  {
    id: "sunflower-keychain",
    name: "Sunflower Keychains",
    category: "keychains",
    price: 149,
    images: ["assets/products/sunflower-keychain-1.jpg"],
    description: "A hand-crocheted sunflower keychain with a little leaf.",
    available: true,
  },
  {
    id: "daisy-keychain",
    name: "Daisy Keychains",
    category: "keychains",
    price: 149,
    images: ["assets/products/daisy-keychain-1.jpg"],
    description: "A crocheted daisy keychain, petal by petal.",
    available: true,
  },
  {
    id: "mesh-bow-keychain",
    name: "Mesh Bow Keychain / Clip",
    category: "keychains",
    price: 199,
    images: [
      "assets/products/mesh-bow-keychain-1.jpg",
      "assets/products/mesh-bow-keychain-2.jpg",
      "assets/products/mesh-bow-keychain-3.jpg",
      "assets/products/mesh-bow-keychain-4.jpg",
    ],
    description: "An open-mesh crochet bow — as a keychain or a clip.",
    available: true,
  },
  {
    id: "lavender-pot",
    name: "Crochet Hanging Lavender Pot",
    category: "home",
    price: 999,
    images: ["assets/products/lavender-pot-1.jpg"],
    description: "A hanging crochet planter with trailing lavender-toned blooms.",
    available: true,
  },
  {
    id: "hair-bands",
    name: "Hair Bands",
    category: "hair-accessories",
    price: 299,
    images: [], // no confirmed photo yet — ask the client for one
    description: "Handmade crochet hair bands.",
    available: true,
  },
  {
    id: "tulip-bag-charm",
    name: "Tulip Bag Charms",
    category: "bag-charms",
    price: 149,
    images: [], // no confirmed client photo yet
    description: "A hand-crocheted tulip charm for your bag.",
    available: true,
  },
  {
    id: "lily-of-valley-charm",
    name: "Lily of the Valley Bag Charms",
    category: "bag-charms",
    price: 199,
    images: ["assets/products/lily-of-valley-charm-1.jpg", "assets/products/lily-of-valley-charm-2.jpg"],
    description: "A cluster of tiny crocheted lily-of-the-valley blooms.",
    available: true,
  },
  {
    id: "rose-bag-charm",
    name: "Rose Bag Charms",
    category: "bag-charms",
    price: 199,
    images: [
      "assets/products/rose-bag-charm-1.jpg",
      "assets/products/rose-bag-charm-2.jpg",
      "assets/products/rose-bag-charm-3.jpg",
      "assets/products/rose-bag-charm-4.jpg",
      "assets/products/rose-bag-charm-5.jpg",
      "assets/products/rose-bag-charm-6.jpg",
      "assets/products/rose-bag-charm-7.jpg",
      "assets/products/rose-bag-charm-8.jpg",
    ],
    description: "A miniature bouquet of crocheted roses in a basket charm.",
    available: true,
  },
  // Coasters: intentionally not added yet — client said to leave for now.
  // New/unconfirmed: a cupcake-shaped keychain was photographed
  // (assets/products/cupcake-keychain-NEW-1.jpg) but has no name or price
  // yet, so it is not listed as a product. Ask the client before adding it.
];

// Bouquet flowers. Rose has confirmed tier pricing; the rest are available
// to add to a bouquet but price is not finalized — UI shows "price to be
// confirmed" and still lets the customer build the bouquet.
const BOUQUET_FLOWERS = [
  {
    id: "rose",
    name: "Rose",
    image: "assets/products/rose-bag-charm-1.jpg",
    tierPricing: { 1: 149, 2: 279, 3: 399, 4: 499 }, // ₹ for exact stem counts 1–4
  },
  { id: "lily", name: "Lily", image: null, tierPricing: null },
  { id: "tulip", name: "Tulip", image: null, tierPricing: null },
  { id: "sunflower", name: "Sunflower", image: "assets/products/sunflower-keychain-1.jpg", tierPricing: null },
  { id: "daisy", name: "Daisy", image: "assets/products/daisy-keychain-1.jpg", tierPricing: null },
];

// Wrapping / ribbon / add-ons: not yet confirmed as available or priced for
// The Yarniya, so these stay empty (not invented) until the client confirms
// real options. The bouquet builder UI hides a section when its list is empty.
const BOUQUET_WRAPS = [];
const BOUQUET_RIBBONS = [];
const BOUQUET_ADDONS = [];
