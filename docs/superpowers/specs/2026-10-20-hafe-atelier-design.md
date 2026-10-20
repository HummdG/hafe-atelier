# Hafe Atelier — Bespoke Occasionwear Site (Next.js)

## Context
The user is launching **Hafe Atelier**: bespoke Pakistani occasionwear for women around the world. The only brief is a one-slide PPT (`website design.pptx`) that shows the home page ("Discover Hafe"), and its speaker notes name **sanasafinaz.com** as the main inspiration. The slide specifies:
- "Hafe Atelier" wordmark centred at the top (font TBD)
- a small shopping-trolley icon at the top right
- **vertical pagination dots on the right with full-page slide scrolling** (as on Sana Safinaz)
- a full-bleed photo of the user's own outfit (to be supplied; use a placeholder until then)
- the copy "Bespoke Pakistani occasionwear for women around the world" and "Your Vision, brought to life"

The working directory holds only the PPT, so this is a new project. The user gave creative licence to fill gaps but asked us to stick to the design approach: luxury, editorial, full-bleed photography, minimal chrome.

### Decided with the user
- **Made to order, not stock.** Customers *request* pieces. They don't buy from inventory.
- **Lookbook plus "Make this mine".** She browses collections of past and sample pieces. On any piece she can request it as is or with changes, or she can start from a blank brief.
- **No online payment.** Requests reach the owner by **email** or **WhatsApp**, and the owner agrees the price and takes payment personally.
- The trolley icon becomes a **"request bag"** that collects several pieces into one request.
- **No prices** are shown anywhere. Every piece says "Price on request", and the quote is given after consultation.
- **Every request is emailed** to the owner with its photos. Choosing WhatsApp *also* opens a pre-filled chat so the conversation can start there.

### My calls (the user approved the playback; reviewer fixes folded in)
- Latest Next.js (16, via `create-next-app@latest`, App Router) + TypeScript + Tailwind CSS v4. Design tokens go in CSS `@theme`, not a config file. Page `params` are awaited, and dynamic routes use `generateStaticParams` so they're generated statically.
- Zod 4 + react-hook-form + `@hookform/resolvers` v5+
- Sending domain: until the owner verifies a domain, use Resend's `onboarding@resend.dev` test sender
- Measurements: cm/inch toggle with Pakistani tailoring fields (shirt length, chest, waist, hip, shoulder, sleeve length, armhole, trouser length, bottom/ankle). Standard XS–XL is offered as an alternative.
- Add a `/privacy` placeholder page (the forms collect personal data, including from the EU) and a branded 404 page
- The footer "Stay in touch" becomes Instagram/WhatsApp follow links (no fake newsletter)
- Lead time and the contact number go in one `src/lib/site.ts` constants file
- Spam protection: a honeypot field + a simple in-memory rate limit on the API route
- Content lives in a typed data file (`src/data/products.ts`, `collections.ts`) with images in `public/images/`. No CMS or admin at launch.
- Email is sent through **Resend** from a Next.js Route Handler. The API key and recipient address come from env vars (`RESEND_API_KEY`, `ATELIER_EMAIL`), and without a key it falls back to logging. WhatsApp uses a `https://wa.me/<number>?text=` link with the request summary pre-filled (`NEXT_PUBLIC_WHATSAPP_NUMBER`).
- Fonts: **Cormorant Garamond** (serif wordmark and headings, matching the Sana Safinaz wordmark feel) + **Jost** (light uppercase nav). Loaded via `next/font/google` and swapped in one place, because the font is still "TBD".
- Palette: warm neutrals. Near-black `#1a1613`, ivory `#f7f3ee`, muted gold accent `#b08d57`, warm brown overlay. White text over dark photography on the hero.
- Placeholder imagery: neutral tinted blocks with a subtle texture, or royalty-free fashion photos, clearly marked for replacement
- Out of scope: accounts/login, payments, currency switching, search backend, admin panel, i18n

## Site map
| Route | Purpose |
|---|---|
| `/` **Discover Hafe** | Full-page vertical slider (right-side dots, native scroll-snap, keys). Slide 1 is the hero (outfit photo, tagline). Slides 2–4 are featured collections (Bridal, Formal, Festive), each with a "Explore" CTA. Slide 5 is "Your Vision, brought to life", a short bespoke pitch with "Start your piece" and "How it works". The last slide holds the footer. |
| `/collections` | Grid of collections |
| `/collections/[slug]` | Lookbook grid for one collection (portrait cards, hover shows a second image) |
| `/pieces/[slug]` | Piece detail: gallery, story, fabric/embroidery notes, typical lead time, a "Make this mine" button (opens the customise panel) and "Add to request bag" |
| `/bespoke` | "Start from scratch" brief form + How Bespoke Works (1 Share your vision → 2 Consultation → 3 Crafted in Pakistan → 4 Delivered worldwide) |
| `/request` | The request bag: list of pieces with their customisation notes, then the client details form, then submit by email or WhatsApp |
| `/request/sent` | Thank-you page |
| `/atelier` | About the brand / craft |
| `/size-guide` | Measurement guide (how to measure, standard XS–XL table) |
| `/contact` | WhatsApp, email, Instagram |

## Global chrome (from the slide + Sana Safinaz)
- **Announcement marquee** at the very top, as a scrolling line ("Worldwide delivery · Bespoke lead time 6–8 weeks · WhatsApp …")
- **Header**: hamburger on the left (opens a full-height drawer menu), the centred serif "HAFE ATELIER" wordmark, and on the right a trolley icon with a count badge. It is transparent with white text over the home hero and solid ivory on inner pages.
- **Footer**: "Stay in touch" Instagram/WhatsApp follow links (no newsletter backend), page links, privacy link

## Key components / files
```
src/app/layout.tsx              fonts, header, marquee, RequestBagProvider
src/app/page.tsx                Discover Hafe (FullPageSlider)
src/app/collections/…, pieces/[slug]/page.tsx, bespoke/, request/, atelier/, size-guide/, contact/
src/app/api/request/route.ts    POST → validate (zod) → Resend email (fallback: console log)
src/components/FullPageSlider.tsx   client; CSS scroll-snap sections, dot nav, keyboard ↑↓, IntersectionObserver + URL hash sync; snapping off for prefers-reduced-motion
src/components/Header.tsx, Marquee.tsx, MenuDrawer.tsx, Footer.tsx
src/components/PieceCard.tsx, Gallery.tsx
src/components/CustomiseForm.tsx    changes wanted, colour/fabric prefs, occasion + date, size (standard or custom measurements), notes, inspiration image upload (client-side preview; images sent as email attachments, size-capped)
src/components/RequestBagProvider.tsx  React context + localStorage persistence
src/components/ClientDetailsForm.tsx  name, email, WhatsApp number, country, preferred contact
src/lib/whatsapp.ts             builds the wa.me message from the bag
src/data/collections.ts, products.ts   typed seed content (~3 collections × 4–6 pieces, invented names/copy in brand voice)
```
- The full-page slider is custom-built with **native CSS scroll-snap** (`snap-y snap-mandatory` on a `100svh` container) instead of hijacking the wheel, so trackpad inertia stays sane. An IntersectionObserver drives the active dot and the URL hash. Clicking a dot calls `scrollIntoView`, and ↑/↓/PageUp/PageDown are handled. The footer slide uses `snap-end` with its natural height. The marquee and header overlay the slides instead of shrinking them. With reduced motion, snapping is turned off. `fullpage.js` is avoided because it needs a commercial licence.
- **Request bag:** the text data persists in localStorage. Inspiration images are uploaded on `/request` and `/bespoke` only, resized in the browser (max 1600px JPEG) and capped at about 4 MB total so they stay under the Vercel body limit. The bag count badge renders only after mount to avoid a hydration mismatch.
- The WhatsApp message is a short summary (piece names + name + "full details emailed"), truncated to about 1,500 characters
- Forms use `react-hook-form` + `zod`, and the same schema is shared with the API route.

## Implementation order
1. Scaffold `create-next-app` (TS, Tailwind, App Router, src dir). Add fonts, design tokens and the global chrome.
2. FullPageSlider + home slides with placeholder imagery
3. Data model + collections/lookbook/piece pages
4. Request bag context + CustomiseForm + `/request`
5. API route (Resend) + WhatsApp link + thank-you page
6. Bespoke, Atelier, Size guide, Contact content pages
7. Responsive pass (mobile drawer, slider fallback), accessibility (focus, aria-labels on dots), metadata/OG

Before coding, save this design as `docs/superpowers/specs/2026-10-20-hafe-atelier-design.md` and run `git init`. Then expand it into a task plan via superpowers:writing-plans.

## Verification
- `npm run build` and `npm run lint` pass
- `npm run dev`, then drive in Chrome: the home page snaps slide by slide with the wheel, the arrow keys and the dots, and the active dot updates. On a mobile viewport it scrolls normally.
- Add 2 pieces with customisations to the bag. Reload and the bag persists. Submit with no `RESEND_API_KEY` and the payload is logged and you're redirected to `/request/sent`. With a key, the email arrives.
- The WhatsApp button opens wa.me with a correctly encoded summary
- Invalid form input shows inline errors. The page has no horizontal scroll at 375px.

## Things the owner supplies later
Outfit/lookbook photos, final font choice, WhatsApp number, receiving email + Resend key, real collection names and copy, lead times, social links.
