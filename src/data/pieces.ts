import type { Piece } from "./types";

export const pieces: Piece[] = [
  {
    slug: "gul-e-rana-lehenga",
    name: "Gul-e-Rana Lehenga",
    collection: "bridal",
    description: "Raw silk lehenga with hand-worked zardozi and a tissue dupatta. Panelled for a full, quiet sweep.",
    fabric: "Raw silk, tissue",
    craft: "Zardozi",
    images: ["/images/placeholders/gul-e-rana-lehenga-1.svg", "/images/placeholders/gul-e-rana-lehenga-2.svg"],
  },
  {
    slug: "noor-jahan-gharara",
    name: "Noor Jahan Gharara",
    collection: "bridal",
    description: "A heritage gharara in jamawar, finished with dabka along the hem and a net dupatta edged in tilla.",
    fabric: "Jamawar, net",
    craft: "Dabka, tilla",
    images: ["/images/placeholders/noor-jahan-gharara-1.svg", "/images/placeholders/noor-jahan-gharara-2.svg"],
  },
  {
    slug: "mehr-un-nisa-sharara",
    name: "Mehr-un-Nisa Sharara",
    collection: "bridal",
    description: "Organza kameez with resham florals over a gota-trimmed sharara. Soft in movement, exact in cut.",
    fabric: "Organza, silk",
    craft: "Resham, gota",
    images: ["/images/placeholders/mehr-un-nisa-sharara-1.svg", "/images/placeholders/mehr-un-nisa-sharara-2.svg"],
  },
  {
    slug: "zarina-peshwas",
    name: "Zarina Peshwas",
    collection: "bridal",
    description: "Floor-length peshwas in raw silk, embroidered across the bodice with tilla and zardozi.",
    fabric: "Raw silk",
    craft: "Tilla, zardozi",
    images: ["/images/placeholders/zarina-peshwas-1.svg", "/images/placeholders/zarina-peshwas-2.svg"],
  },
  {
    slug: "raat-ki-rani-gown",
    name: "Raat ki Rani Gown",
    collection: "formal",
    description: "Chiffon gown with a structured bodice and a hand-beaded neckline, cut to fall straight to the floor.",
    fabric: "Chiffon, crepe",
    craft: "Dabka",
    images: ["/images/placeholders/raat-ki-rani-gown-1.svg", "/images/placeholders/raat-ki-rani-gown-2.svg"],
  },
  {
    slug: "sitara-anarkali",
    name: "Sitara Anarkali",
    collection: "formal",
    description: "Anarkali in organza layers, scattered with fine resham stars. Worn with silk churidar.",
    fabric: "Organza, silk",
    craft: "Resham",
    images: ["/images/placeholders/sitara-anarkali-1.svg", "/images/placeholders/sitara-anarkali-2.svg"],
  },
  {
    slug: "shabnam-cape-set",
    name: "Shabnam Cape Set",
    collection: "formal",
    description: "A fitted kurta and straight trouser under a sheer embroidered cape in chiffon.",
    fabric: "Chiffon, raw silk",
    craft: "Tilla",
    images: ["/images/placeholders/shabnam-cape-set-1.svg", "/images/placeholders/shabnam-cape-set-2.svg"],
  },
  {
    slug: "meher-jamawar-coat",
    name: "Meher Jamawar Coat",
    collection: "formal",
    description: "A tailored jamawar coat for winter evenings, lined in silk and worn over a plain shift.",
    fabric: "Jamawar, silk",
    craft: "Gota",
    images: ["/images/placeholders/meher-jamawar-coat-1.svg", "/images/placeholders/meher-jamawar-coat-2.svg"],
  },
  {
    slug: "chandni-kurta-set",
    name: "Chandni Kurta Set",
    collection: "festive",
    description: "A pale chiffon kurta with threadwork at the yoke, paired with a straight trouser and a soft dupatta.",
    fabric: "Chiffon",
    craft: "Resham",
    images: ["/images/placeholders/chandni-kurta-set-1.svg", "/images/placeholders/chandni-kurta-set-2.svg"],
  },
  {
    slug: "gulabi-angarkha",
    name: "Gulabi Angarkha",
    collection: "festive",
    description: "Angarkha in light organza with gota along the placket. Easy to wear from morning to night.",
    fabric: "Organza, cotton silk",
    craft: "Gota",
    images: ["/images/placeholders/gulabi-angarkha-1.svg", "/images/placeholders/gulabi-angarkha-2.svg"],
  },
  {
    slug: "eid-ka-chand-frock",
    name: "Eid ka Chand Frock",
    collection: "festive",
    description: "A flared frock with a scalloped hem, embroidered in tilla at the neck and cuffs.",
    fabric: "Raw silk, chiffon",
    craft: "Tilla",
    images: ["/images/placeholders/eid-ka-chand-frock-1.svg", "/images/placeholders/eid-ka-chand-frock-2.svg"],
  },
  {
    slug: "baharan-sharara-set",
    name: "Baharan Sharara Set",
    collection: "festive",
    description: "Sharara set in washed silk with dabka at the cuffs and a printed chiffon dupatta.",
    fabric: "Washed silk, chiffon",
    craft: "Dabka",
    images: ["/images/placeholders/baharan-sharara-set-1.svg", "/images/placeholders/baharan-sharara-set-2.svg"],
  },
];

export function getPiece(slug: string): Piece | undefined {
  return pieces.find((p) => p.slug === slug);
}

export function getPiecesByCollection(slug: string): Piece[] {
  return pieces.filter((p) => p.collection === slug);
}
