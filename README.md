# Hafé Atelier

Marketing and made-to-order request site for Hafé Atelier, a bespoke Pakistani occasionwear label. Built with Next.js (App Router), Tailwind CSS 4, react-hook-form and zod. There is no checkout: clients build a request bag and send it to the atelier by email, with an optional WhatsApp hand-off. No prices are shown anywhere ("Price on request").

## Setup

```bash
npm install
cp .env.example .env.local   # then fill in the values below
npm run dev                  # http://localhost:3000
```

Other scripts: `npm run lint`, `npm test`, `npm run build`, `npm run start`, `npm run placeholders` (regenerates the placeholder SVGs).

## Environment variables

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Resend key used to email each request. If unset, the email is logged to the server console and the request still succeeds. |
| `ATELIER_EMAIL` | Address that receives requests. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Digits with country code (for example `923001234567`). Enables the WhatsApp option and contact link. Optional. |
| `NEXT_PUBLIC_SITE_URL` | Public site URL (for example `https://hafeatelier.com`), used to resolve Open Graph image URLs. Defaults to `http://localhost:3000`. |

Emails are sent from `Hafé Atelier <onboarding@resend.dev>` until you verify your own domain in Resend and change the sender in `src/lib/email.ts`.

## Swapping photos

Photos are SVG placeholders in `public/images/placeholders/`. Drop real images (JPG, PNG, WebP) into `public/images/` and update the paths:

- Hero image, contact details and lead time: `src/lib/site.ts`
- Collection covers: `src/data/collections.ts`
- Piece photos: the `images` array of each piece in `src/data/pieces.ts` (first image is the cover)

## Swapping fonts

Fonts are loaded with `next/font/google` in one file, `src/app/fonts.ts`: Cormorant Garamond as `--font-serif` and Jost as `--font-sans`. Replace the imports there; the CSS variable names stay the same so nothing else changes. Colour tokens (ink, ivory, gold, umber) live in the `@theme` block of `src/app/globals.css`.

## Adding a piece

1. Add the photos under `public/images/`.
2. Add an entry to the `pieces` array in `src/data/pieces.ts` with a unique `slug`, `name`, `collection` (`bridal`, `formal` or `festive`), `description`, `fabric`, `craft` and `images`.
3. That is all: the piece page, collection listing and static params are generated from the data. Run `npm test` to check the data (unique slugs, valid collections).

To add a new collection, extend `CollectionSlug` in `src/data/types.ts` and add it to `src/data/collections.ts`.
