# Hafe Atelier Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Next.js site for Hafe Atelier, a made-to-order Pakistani occasionwear brand. Customers browse a lookbook, customise pieces or brief one from scratch, collect them in a request bag, and send the request by email (always) and optionally WhatsApp. There are no prices and no payment.

**Architecture:** Next.js App Router with static pages generated from typed data files. One Route Handler (`/api/request`) validates the request with Zod and emails it via Resend, logging it instead when no key is set. Client state (the request bag) lives in a React context persisted to localStorage. The home page is a native CSS scroll-snap full-page slider with right-side dots.

**Tech Stack:** Next.js 16 (App Router, TypeScript), Tailwind CSS v4, Zod 4, react-hook-form + @hookform/resolvers v5, Resend, Vitest + jsdom + @testing-library/react.

**Spec:** `docs/superpowers/specs/2026-10-20-hafe-atelier-design.md`

## Global Constraints
- No prices anywhere. Every piece shows the copy "Price on request".
- No payment, accounts, currency switching, search backend, CMS/admin or i18n.
- Every submitted request is emailed. WhatsApp *additionally* opens `https://wa.me/<number>?text=…`.
- Env vars: `RESEND_API_KEY`, `ATELIER_EMAIL`, `NEXT_PUBLIC_WHATSAPP_NUMBER`. With no `RESEND_API_KEY`, log the payload and still return success. The sender is `Hafe Atelier <onboarding@resend.dev>`.
- Fonts via `next/font/google`: Cormorant Garamond (`--font-serif`) and Jost (`--font-sans`), defined in one file (`src/app/fonts.ts`).
- Tokens live in `src/app/globals.css` `@theme` (no tailwind.config): `--color-ink: #1a1613`, `--color-ivory: #f7f3ee`, `--color-gold: #b08d57`, `--color-umber: #3b2a20`.
- Copy: wordmark "HAFE ATELIER"; tagline "Bespoke Pakistani occasionwear for women around the world"; "Your Vision, brought to life"; home page title "Discover Hafe".
- Lead time "6–8 weeks", contact details and the hero image path live only in `src/lib/site.ts`.
- Uploads: images only, resized client-side to max 1600px JPEG, ≤ 4,000,000 bytes in total per request. The server rejects anything over that with 413.
- Rate limit: 5 requests per IP per 10 minutes, giving 429. A non-empty honeypot field `website` gets a silent 200 and nothing is sent.
- WhatsApp message ≤ 1,500 characters before URL encoding.
- Page `params` are awaited (`params: Promise<{slug: string}>`), and dynamic routes export `generateStaticParams`. Unknown slugs call `notFound()`.
- Use `100svh` for full-screen sections. The header and marquee overlay the home slides. No horizontal scroll at 375px width.
- Placeholder images are SVGs under `public/images/placeholders/`. Each one is referenced through data or `site.ts` so the owner can swap in real photos.

## Review Focus
1. **Corrupt or old localStorage bag** (bad JSON, wrong shape): the bag loads as empty instead of crashing the site. The test lives in Task 2.
2. **Oversized or non-image uploads** (a 12 MB phone photo, a PDF): photos get resized, non-images are rejected with a message, and an over-budget total shows "Photos too large…" on the client and returns 413 on the server. Tests are in Tasks 7 and 8.
3. **Urdu/emoji and very long notes in WhatsApp**: the message is correctly URI-encoded and truncated to ≤ 1,500 characters without splitting a surrogate pair. The test lives in Task 7.
4. **Measurements**: when custom measurements are chosen, zero, negative or empty values for chest, waist, hip or shirt length fail validation, and the unit (cm/in) is carried through to the email. Tests are in Tasks 2 and 8.
5. **A from-scratch item** (`pieceSlug: null`) and **an empty bag on `/request`**: scratch items flow through the bag, the email and WhatsApp as "Bespoke from scratch", and an empty bag shows an empty state with links instead of a form. Tests are in Tasks 2, 7 and 8.

---

### Task 1: Scaffold, tooling, tokens, site constants

**Files:**
- Create (via CLI): Next app in the repo root
- Create: `src/app/fonts.ts`, `src/lib/site.ts`, `vitest.config.ts`, `vitest.setup.ts`, `.env.example`, `scripts/make-placeholders.mjs`, `public/images/placeholders/*.svg`
- Modify: `src/app/globals.css`, `package.json` (scripts `test`, `placeholders`)
- Test: `src/lib/site.test.ts`

**Interfaces:**
- Produces: `site: { name: "Hafe Atelier"; tagline: string; vision: "Your Vision, brought to life"; leadTime: "6–8 weeks"; email: string; whatsappNumber: string; instagram: string; heroImage: string; announcements: string[] }` from `src/lib/site.ts`. `whatsappNumber` reads `process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ""`.
- Produces: `serif` and `sans` font objects from `src/app/fonts.ts`, exposing CSS vars `--font-serif` / `--font-sans`.

- [ ] **Step 1:** Scaffold into a temp dir and move it into the root, because the root already holds `docs/` and the PPT. Run `npx create-next-app@latest hafe-tmp --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --no-turbopack`, then move the contents up and delete `hafe-tmp`. Add `website design.pptx`, `node_modules`, `.next` and `.env*.local` to `.gitignore`. If the CLI prompts for anything else, accept its defaults.
- [ ] **Step 2:** Install `zod react-hook-form @hookform/resolvers resend` and dev deps `vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event vite-tsconfig-paths`. Add the scripts `"test": "vitest run"` and `"placeholders": "node scripts/make-placeholders.mjs"`.
- [ ] **Step 3: Write the failing test** `src/lib/site.test.ts`:
```ts
import { site } from "./site";
test("site constants", () => {
  expect(site.name).toBe("Hafe Atelier");
  expect(site.tagline).toBe("Bespoke Pakistani occasionwear for women around the world");
  expect(site.leadTime).toBe("6–8 weeks");
  expect(site.heroImage).toMatch(/^\/images\//);
});
```
- [ ] **Step 4:** Run `npm test`. It should FAIL because the module can't be found.
- [ ] **Step 5:** Implement `site.ts`, `fonts.ts`, the vitest config (jsdom, globals, tsconfig paths, setup imports jest-dom), the `@theme` tokens in `globals.css` (body ivory/ink, `--font-serif`/`--font-sans` mapped to `font-serif`/`font-sans`), and `.env.example` listing the three env vars.
- [ ] **Step 6:** Write `scripts/make-placeholders.mjs`. It writes 3:4 portrait SVGs (warm umber→ivory gradients with a faint grain pattern and a centred serif label) for `hero`, `bridal`, `formal`, `festive`, `bespoke` and each piece slug from Task 5 (`<slug>-1.svg`, `<slug>-2.svg`). The hero is 16:9. Run `npm run placeholders`.
- [ ] **Step 7:** Run `npm test && npm run build`. Both should PASS.
- [ ] **Step 8:** Commit with `chore: scaffold Next.js app with tokens, fonts and site constants`.

### Task 2: Request schema and request bag state

**Files:**
- Create: `src/lib/request-schema.ts`, `src/lib/bag.ts`, `src/components/RequestBagProvider.tsx`
- Test: `src/lib/request-schema.test.ts`, `src/lib/bag.test.ts`

**Interfaces:**
- Produces (`request-schema.ts`, all exported with inferred types):
  - `MEASUREMENT_KEYS = ["shirtLength","chest","waist","hip","shoulder","sleeveLength","armhole","trouserLength","bottom"] as const`, `REQUIRED_MEASUREMENTS = ["shirtLength","chest","waist","hip"] as const`, `STANDARD_SIZES = ["XS","S","M","L","XL"] as const`
  - `customisationSchema` → `Customisation { changes: string; colours: string; fabric: string; occasion: string; eventDate?: string; sizeMode: "standard"|"custom"; standardSize?: StandardSize; unit: "cm"|"in"; measurements?: Partial<Record<MeasurementKey, number>>; notes: string }`. This is a superRefine: standard mode requires `standardSize`, and custom mode requires every REQUIRED_MEASUREMENTS key > 0. All measurements must be positive and ≤ 300.
  - `bagItemSchema` → `BagItem { id: string; pieceSlug: string | null; pieceName: string; customisation: Customisation }`
  - `clientSchema` → `ClientDetails { name: string(min 2); email: email; whatsapp: string; country: string(min 2); preferredContact: "email"|"whatsapp" }`
  - `requestSchema` → `RequestPayload { items: BagItem[] (min 1, max 10); client: ClientDetails; website?: string }`
  - `SCRATCH_NAME = "Bespoke from scratch"`
- Produces (`bag.ts`): `type BagAction = {type:"add"; item: BagItem} | {type:"update"; id: string; customisation: Customisation} | {type:"remove"; id: string} | {type:"clear"}`; `bagReducer(state: BagItem[], action: BagAction): BagItem[]`; `BAG_KEY = "hafe-bag-v1"`; `loadBag(storage: Pick<Storage,"getItem">): BagItem[]`; `saveBag(storage: Pick<Storage,"setItem">, items: BagItem[]): void`.
- Produces (`RequestBagProvider.tsx`, client): `RequestBagProvider`, `useBag(): { items: BagItem[]; count: number; hydrated: boolean; add(item: Omit<BagItem,"id">): string; update(id, c: Customisation): void; remove(id): void; clear(): void }`. IDs come from `crypto.randomUUID()`. The provider loads in `useEffect` (so `hydrated` starts false) and saves on change after hydration.

- [ ] **Step 1: Write failing tests** `request-schema.test.ts`:
  - `"standard size requires standardSize"`: `{sizeMode:"standard"}` with no size → `success === false`
  - `"custom mode rejects zero/negative/missing required measurements"`: chest 0 → false; waist −5 → false; missing hip → false; all four > 0 with unit "in" → true, and the parsed `unit === "in"`
  - `"request needs at least one item"`: `items: []` → false
  - `"scratch item with null pieceSlug is valid"`
- [ ] **Step 2: Write failing tests** `bag.test.ts`:
  - add/update/remove/clear behave immutably (the original array is unchanged)
  - `loadBag` returns `[]` for a missing key, `"{not json"`, `'{"a":1}'`, and an array holding one invalid item. It drops invalid items and keeps valid ones.
  - round trip: `saveBag` then `loadBag` gives the same items back
- [ ] **Step 3:** Run `npm test`. These should FAIL.
- [ ] **Step 4:** Implement `request-schema.ts` and `bag.ts`. `loadBag` wraps the read and parse in try/catch and validates each item with `bagItemSchema.safeParse`.
- [ ] **Step 5:** Implement `RequestBagProvider.tsx` with `useReducer(bagReducer, [])` and guard every storage access with try/catch.
- [ ] **Step 6:** Run `npm test`. It should PASS.
- [ ] **Step 7:** Commit with `feat: request schema and persistent request bag`.

### Task 3: Global chrome (marquee, header, drawer, footer, 404, privacy)

**Files:**
- Create: `src/components/Marquee.tsx`, `Header.tsx`, `MenuDrawer.tsx`, `Footer.tsx`, `TrolleyIcon.tsx`, `src/app/not-found.tsx`, `src/app/privacy/page.tsx`
- Modify: `src/app/layout.tsx`
- Test: `src/components/Header.test.tsx`

**Interfaces:**
- Consumes: `useBag`, `RequestBagProvider` (Task 2), `site` (Task 1)
- Produces: `<Header variant="overlay" | "solid" />`. The layout decides the variant by pathname: `"/"` is overlay, everything else is solid, so Header is a client component using `usePathname`. `<Footer />` is a server component reused by the home slider's last slide and by the layout on inner pages. The layout skips the footer on `/` because the slider renders it.
- Nav links (drawer and footer): Discover Hafe `/`, Collections `/collections`, Bespoke `/bespoke`, The Atelier `/atelier`, Size Guide `/size-guide`, Contact `/contact`, Privacy `/privacy` (footer only).

- [ ] **Step 1: Write failing test** `Header.test.tsx` (mock `next/navigation` `usePathname`; wrap in the provider):
  - renders the text "HAFE ATELIER" as a link to `/`
  - has a link with accessible name matching `/request bag/i` to `/request`
  - before hydration no count badge renders. After adding an item (seed localStorage before render, then `await findByText("1")`), the badge shows 1.
  - the menu button `aria-expanded` toggles false→true on click and the drawer shows "Collections"
- [ ] **Step 2:** Run `npm test`. It should FAIL.
- [ ] **Step 3:** Implement the components.
  - **Header:** a 3-column grid (hamburger | serif wordmark, `tracking-[0.15em] text-2xl md:text-4xl` | trolley + badge). Overlay is `absolute inset-x-0 text-ivory` and solid is `sticky bg-ivory text-ink border-b`.
  - **Marquee:** a thin ink strip, `site.announcements` joined with " · ", a CSS keyframe translateX loop, `hover:[animation-play-state:paused]`, and `motion-reduce:animate-none`.
  - **MenuDrawer:** full-height left panel, focus moves to close button, Esc closes, body scroll locked.
  - **Footer:** a "Stay in touch" heading with Instagram/WhatsApp links, the nav, and "© {year} Hafe Atelier".
  - **404:** a serif "This piece is still being stitched" with a link home.
  - **Privacy:** placeholder text covering what the forms collect, why, that it's emailed to the atelier, and the contact for deletion.
- [ ] **Step 4:** Run `npm test && npm run build`. Both should PASS.
- [ ] **Step 5:** Commit with `feat: global header, marquee, menu drawer, footer, 404 and privacy`.

### Task 4: Full-page slider and Discover Hafe home

**Files:**
- Create: `src/components/FullPageSlider.tsx`, `src/components/home/HeroSlide.tsx`, `CollectionSlide.tsx`, `VisionSlide.tsx`
- Modify: `src/app/page.tsx`
- Test: `src/components/FullPageSlider.test.tsx`

**Interfaces:**
- Consumes: `site`, `Footer`, `getCollection` (Task 5. Until then, Task 4 uses the three collection slugs/names inline. Task 5 Step 6 switches it to data.)
- Produces: `<FullPageSlider sections={{ id: string; label: string; content: ReactNode; fit?: "screen" | "auto" }[]} />`. `fit:"auto"` (footer) uses `snap-end` and its natural height. All others are `h-[100svh] snap-start`.

- [ ] **Step 1: Write failing tests** (stub `IntersectionObserver` and `Element.prototype.scrollIntoView` with `vi.fn()`):
  - renders one dot button per section with `aria-label` "Go to {label}" inside `nav[aria-label="Slides"]`
  - clicking dot 3 calls `scrollIntoView` on the element with id = sections[2].id
  - first dot has `aria-current="true"` initially. Simulating the IO callback with section 2 intersecting moves `aria-current` to dot 2 and calls `history.replaceState` with `#<id>`.
  - pressing ArrowDown on the container scrolls to the next section
- [ ] **Step 2:** Run `npm test`. It should FAIL.
- [ ] **Step 3:** Implement the slider. Use a `h-[100svh] overflow-y-auto snap-y snap-mandatory motion-reduce:snap-none` container and an IntersectionObserver (`root` = container, `threshold: 0.6`). Dots are fixed to the right edge, vertically centred: small white circles with the active one filled ink-on-light, matching the slide. Dot colour adapts by using `mix-blend-difference`. Keyboard handlers on the container (`tabIndex={0}`) cover ArrowUp/Down and PageUp/Down.
- [ ] **Step 4:** Build the slides and the page.
  - **HeroSlide:** full-bleed `site.heroImage` (`next/image`, `fill`, `priority`, `unoptimized` for `.svg`) with a dark gradient on the left. "Bespoke Pakistani / occasionwear" in large serif with "for women around the world" below it in light uppercase sans, and a small "Discover Hafe" eyebrow.
  - **CollectionSlide:** full-bleed cover, the collection name in large serif, its tagline, and an "Explore" link outlined in white.
  - **VisionSlide:** ivory background with the large serif "Your Vision, brought to life", 2–3 lines of copy, the buttons "Start your piece" → `/bespoke` and "How it works" → `/bespoke#how`, and the lead time.
  - **page.tsx** sections are hero, bridal, formal, festive, vision and footer (`fit:"auto"`). The page metadata title is "Discover Hafe | Hafe Atelier".
- [ ] **Step 5:** Run `npm test && npm run build`. Both should PASS.
- [ ] **Step 6:** Commit with `feat: Discover Hafe full-page slider home`.

### Task 5: Lookbook data, collections and piece pages

**Files:**
- Create: `src/data/types.ts`, `src/data/collections.ts`, `src/data/pieces.ts`, `src/components/Photo.tsx`, `PieceCard.tsx`, `Gallery.tsx`, `src/app/collections/page.tsx`, `src/app/collections/[slug]/page.tsx`, `src/app/pieces/[slug]/page.tsx`
- Test: `src/data/data.test.ts`, `src/components/PieceCard.test.tsx`

**Interfaces:**
- Produces: `Collection { slug: "bridal"|"formal"|"festive"; name: string; tagline: string; description: string; cover: string }`; `Piece { slug: string; name: string; collection: Collection["slug"]; description: string; fabric: string; craft: string; images: [string, ...string[]] }`.
- Produces: `collections: Collection[]`, `getCollection(slug: string): Collection | undefined`, `pieces: Piece[]`, `getPiece(slug: string): Piece | undefined`, `getPiecesByCollection(slug: string): Piece[]`.
- Produces: `<Photo src alt className? sizes? priority? />`, a `next/image` `fill` wrapper that sets `unoptimized` when the src ends in `.svg`.
- The piece page renders a client island `<PieceActions piece={{slug,name}} />`, created in Task 6. For this task, leave a placeholder `<div id="piece-actions" />`.

- [ ] **Step 1: Write failing tests**
  - `data.test.ts`: every piece's collection exists, slugs are unique, each collection has 4–6 pieces, every image path has a matching file under `public/` (use `fs.existsSync`), and `getPiece("nope")` is undefined.
  - `PieceCard.test.tsx`: it renders the name, the "Price on request" text and a link to `/pieces/{slug}`. With two images, it renders both (the second gets the hover class `opacity-0 group-hover:opacity-100`).
- [ ] **Step 2:** Run `npm test`. It should FAIL.
- [ ] **Step 3:** Write the data. Collections are Bridal ("Shaadi Ke Rang"), Formal ("Raat ki Rani") and Festive ("Eid Edit"), with 4 pieces each. Names, descriptions, fabric and craft are invented in a restrained luxury voice: e.g. "Gul-e-Rana Lehenga: Raw silk lehenga with hand-worked zardozi and a tissue dupatta"; fabrics like raw silk, organza, chiffon, jamawar; crafts like zardozi, dabka, tilla, resham, gota. Re-run `npm run placeholders` if any slugs change.
- [ ] **Step 4:** Build the pages.
  - **`/collections`:** three tall cover tiles.
  - **`/collections/[slug]`:** a hero band with the name and description, then a grid of PieceCards (2 columns on mobile, 3 on md, 4 on xl, 3:4 aspect).
  - **`/pieces/[slug]`:** Gallery (main image + thumbnails, client) on the left; on the right the name, collection link, "Price on request", description, Fabric/Craft, "Made to order · {site.leadTime}" and the actions placeholder.
  - Every dynamic page has `generateStaticParams` and `generateMetadata`, awaits `params`, and calls `notFound()` for an unknown slug.
- [ ] **Step 5:** Run `npm test && npm run build`. Both should PASS, and the build output should list the static piece routes.
- [ ] **Step 6:** Switch Task 4's home collection slides to read from `collections`. Run `npm test`, then commit with `feat: lookbook data with collection and piece pages`.

### Task 6: Customise form, "Make this mine" and "Add to request bag"

**Files:**
- Create: `src/components/CustomiseForm.tsx`, `src/components/MeasurementsFields.tsx`, `src/components/PieceActions.tsx`
- Modify: `src/app/pieces/[slug]/page.tsx` (replace the placeholder)
- Test: `src/components/CustomiseForm.test.tsx`, `src/components/PieceActions.test.tsx`

**Interfaces:**
- Consumes: `customisationSchema`, `Customisation`, `MEASUREMENT_KEYS`, `STANDARD_SIZES`, `useBag` (Task 2)
- Produces: `<CustomiseForm defaultValues?: Partial<Customisation> submitLabel: string onSubmit(c: Customisation): void />` (react-hook-form + zodResolver). It's reused on `/bespoke` (Task 9) and when editing in `/request` (Task 7). `<MeasurementsFields />` has a cm/in toggle, and its labels come from a `MEASUREMENT_LABELS: Record<MeasurementKey,string>` exported from the same file. `/size-guide` reuses it.
- `PieceActions` shows two buttons. "Add to request bag" adds the piece with `DEFAULT_CUSTOMISATION` (`changes: "As shown"`, `sizeMode: "standard"`, `standardSize: "M"`, `unit: "cm"`, others empty), exported from `CustomiseForm.tsx`. "Make this mine" opens an inline panel with CustomiseForm. On submit either button adds to the bag and shows the confirmation "Added to your request bag" with a link to `/request`.

- [ ] **Step 1: Write failing tests**
  - CustomiseForm: switching to "Custom measurements" shows the measurement inputs. Submitting with chest empty shows an error on chest and does not call `onSubmit`. Filling the four required fields in inches calls `onSubmit` with `unit: "in"` and numeric values.
  - PieceActions (inside the provider): clicking "Add to request bag" makes the bag count 1 and shows the confirmation. Clicking "Make this mine", typing changes "Shorter sleeves", choosing size S and submitting adds an item whose `customisation.changes === "Shorter sleeves"`.
- [ ] **Step 2:** Run `npm test`. It should FAIL.
- [ ] **Step 3:** Implement the components. Measurement inputs use `valueAsNumber`. Fields are underlined (no boxes), with small uppercase sans labels and a gold focus ring.
- [ ] **Step 4:** Run `npm test && npm run build`. Both should PASS.
- [ ] **Step 5:** Commit with `feat: customise form and make-this-mine flow`.

### Task 7: Request page, image handling, WhatsApp link

**Files:**
- Create: `src/lib/images.ts`, `src/lib/whatsapp.ts`, `src/components/ClientDetailsForm.tsx`, `src/components/ImagePicker.tsx`, `src/app/request/page.tsx`, `src/app/request/RequestView.tsx`
- Test: `src/lib/images.test.ts`, `src/lib/whatsapp.test.ts`, `src/app/request/RequestView.test.tsx`

**Interfaces:**
- Consumes: `useBag`, `clientSchema`, `ClientDetails`, `BagItem`, `SCRATCH_NAME`, `CustomiseForm`, `site`
- Produces (`images.ts`): `MAX_TOTAL_BYTES = 4_000_000`; `isImage(file: File): boolean` (`type.startsWith("image/")`); `fitsBudget(sizes: number[]): boolean`; `resizeImage(file: File, maxDim = 1600, quality = 0.82): Promise<File>` (createImageBitmap + canvas → `image/jpeg`; returns the original if decoding fails and it's under 1.5 MB, otherwise throws).
- Produces (`whatsapp.ts`): `WHATSAPP_MAX = 1500`; `buildWhatsAppMessage(items: BagItem[], client: Pick<ClientDetails,"name"|"country">): string`; `buildWhatsAppUrl(number: string, message: string): string` → `https://wa.me/${digitsOnly}?text=${encodeURIComponent(message)}`.
- Message format: `Salaam Hafe Atelier, I'm {name} from {country}. I'd like to request:\n• {pieceName} ({changes})\n…\nFull details have been emailed.` Truncate on code points (`Array.from`) to WHATSAPP_MAX, with a trailing `…` when cut.
- Produces: `<ImagePicker files: File[] onChange(files: File[]): void />`. It rejects non-images with the message "Only photos can be attached", resizes on add, and blocks additions that break the budget with "Photos too large — please attach fewer or smaller images (max 4 MB total)". `RequestView` owns the submit. In this task submit calls `submitRequest` (stubbed as a function prop `onSubmit(payload: RequestPayload, files: File[], via: "email"|"whatsapp"): Promise<void>`). Task 8 wires the real one.

- [ ] **Step 1: Write failing tests**
  - `images.test.ts`: `fitsBudget([3_000_000, 1_000_000]) === true`, `fitsBudget([3_000_000, 1_000_001]) === false`; `isImage` is false for `application/pdf`.
  - `whatsapp.test.ts`: the message for a scratch item contains "Bespoke from scratch". A 5,000-character Urdu+emoji note gives `Array.from(msg).length <= 1500`, ends with "…", and contains no lone surrogates (`/[\uD800-\uDBFF](?![\uDC00-\uDFFF])/` doesn't match). The URL strips non-digits from "+44 7700-900123" to `wa.me/447700900123`, and `decodeURIComponent` of the text param round-trips.
  - `RequestView.test.tsx`: an empty bag shows "Your request bag is empty" with links to `/collections` and `/bespoke` and no form. With 2 seeded items it lists both, and Remove removes one. Submitting invalid client details shows errors. Valid details plus clicking "Send via WhatsApp" calls `onSubmit` with `via: "whatsapp"`.
- [ ] **Step 2:** Run `npm test`. It should FAIL.
- [ ] **Step 3:** Implement the libs, components and page. Each item is a row with a thumbnail (`getPiece(slug)?.images[0]` or the bespoke placeholder), name, a customisation summary, an "Edit" control (opens CustomiseForm with defaultValues → `update`) and "Remove". Below the items come ImagePicker ("Inspiration photos"), ClientDetailsForm and a hidden honeypot input `website` (`tabIndex={-1}`, `autoComplete="off"`, visually hidden). There are two buttons, "Send request" (email) and "Send & continue on WhatsApp", plus the note "We'll reply within 48 hours with a consultation and quote. No payment is taken online."
- [ ] **Step 4:** Run `npm test && npm run build`. Both should PASS.
- [ ] **Step 5:** Commit with `feat: request bag page with photos and WhatsApp message`.

### Task 8: Email, rate limit, API route, submit wiring, thank-you page

**Files:**
- Create: `src/lib/rate-limit.ts`, `src/lib/email.ts`, `src/app/api/request/route.ts`, `src/lib/submit-request.ts`, `src/app/request/sent/page.tsx`
- Modify: `src/app/request/page.tsx` (pass the real `submitRequest`)
- Test: `src/lib/rate-limit.test.ts`, `src/lib/email.test.ts`, `src/app/api/request/route.test.ts`

**Interfaces:**
- Produces: `createRateLimiter(opts: { limit: number; windowMs: number }): (key: string, now?: number) => boolean` (true = allowed). The route uses `{ limit: 5, windowMs: 600_000 }`, keyed by the first `x-forwarded-for` value or `"local"`.
- Produces: `renderRequestEmail(req: RequestPayload): { subject: string; text: string; html: string }`. The subject is `New request — {client.name} ({items.length} piece{s})`. The body lists the client details and each item with every customisation field, measurements with their unit, and "Bespoke from scratch" for null slugs. All user text is HTML-escaped. `sendRequestEmail(req, attachments: { filename: string; content: Buffer }[]): Promise<{ sent: boolean }>` logs and returns `{sent:false}` when `RESEND_API_KEY` is unset, and otherwise sends from `Hafe Atelier <onboarding@resend.dev>` to `ATELIER_EMAIL` with `replyTo: client.email`.
- Route contract: `POST /api/request` takes multipart `FormData` with `payload` (JSON string of RequestPayload) and `files` (0..n images). The responses are:
  - `200 {ok:true}`
  - `400 {error:"invalid", issues}`
  - `413 {error:"too_large"}` when the total file bytes are over `MAX_TOTAL_BYTES` or a file isn't an image
  - `429 {error:"rate_limited"}`
  - `500 {error:"send_failed"}`
  - A honeypot hit gets `200 {ok:true}` without sending.
- Produces: `submitRequest(payload, files, via): Promise<void>`. It POSTs and throws `Error(message)` on a non-OK response. On success it clears the bag, opens `buildWhatsAppUrl` in a new tab if `via === "whatsapp"`, then navigates to `/request/sent`. `RequestView` shows thrown messages above the buttons and disables them while sending.

- [ ] **Step 1: Write failing tests**
  - rate-limit: 5 calls are allowed and the 6th is denied, while a different key is still allowed. After `now + 600_001` it's allowed again.
  - email: the text contains `chest: 36 in` for an inch custom item and "Bespoke from scratch" for a null slug. `<script>` in notes appears escaped in the html.
  - route (`vi.mock("@/lib/email")`): a valid payload gives 200 and `sendRequestEmail` is called once with 1 attachment. An empty items array gives 400. A 4,000,001-byte file gives 413. A `text/plain` file gives 413. A honeypot `"x"` gives 200 and the mock isn't called. A 6th request from the same IP gives 429. A send that throws gives 500.
- [ ] **Step 2:** Run `npm test`. It should FAIL.
- [ ] **Step 3:** Implement the libs and the route (`export const runtime = "nodejs"`). The thank-you page is ivory with the serif "Thank you — your vision is with us" and lead-time copy. Its links are Continue browsing → `/collections` and WhatsApp us.
- [ ] **Step 4:** Run `npm test && npm run build`. Both should PASS.
- [ ] **Step 5:** Manual check. Run `npm run dev` with no key, submit a request, and the server log should print the rendered email text with a redirect to `/request/sent`.
- [ ] **Step 6:** Commit with `feat: request API with email delivery, rate limit and thank-you page`.

### Task 9: Bespoke, Atelier, Size guide, Contact pages

**Files:**
- Create: `src/app/bespoke/page.tsx`, `src/app/bespoke/BespokeBrief.tsx`, `src/app/atelier/page.tsx`, `src/app/size-guide/page.tsx`, `src/app/contact/page.tsx`
- Test: `src/app/bespoke/BespokeBrief.test.tsx`

**Interfaces:**
- Consumes: `CustomiseForm`, `useBag`, `SCRATCH_NAME`, `MEASUREMENT_LABELS`, `STANDARD_SIZES`, `site`
- `BespokeBrief` submits CustomiseForm, adds `{ pieceSlug: null, pieceName: SCRATCH_NAME, customisation }` and then routes to `/request`.

- [ ] **Step 1: Write failing test:** submitting a valid brief adds 1 item with `pieceSlug === null` and calls `router.push("/request")` (mock `next/navigation`).
- [ ] **Step 2:** Run `npm test`. It should FAIL.
- [ ] **Step 3:** Implement the pages.
  - **`/bespoke`:** a hero ("Your Vision, brought to life"), then `#how` with 4 numbered steps: Share your vision, Consultation, Crafted in Pakistan, Delivered worldwide. Each step gets a one-line description with `site.leadTime` in step 3. Then the brief form.
  - **`/atelier`:** an editorial story about the brand, its craft and its global clients, in an alternating image/text layout.
  - **`/size-guide`:** "How to measure" as a list using MEASUREMENT_LABELS with one instruction each, plus a standard size table (XS–XL with chest/waist/hip in cm and in). Values: XS 32/26/35 in, S 34/28/37, M 36/30/39, L 39/33/42, XL 42/36/45. The cm values are inches × 2.54, rounded.
  - **`/contact`:** WhatsApp, email and Instagram from `site`, and response-time copy.
  - Every page exports metadata.
- [ ] **Step 4:** Run `npm test && npm run build`. Both should PASS.
- [ ] **Step 5:** Commit with `feat: bespoke, atelier, size guide and contact pages`.

### Task 10: Responsive, accessibility, metadata and end-to-end verification

**Files:**
- Modify: as needed across `src/`
- Create: `src/app/opengraph-image.tsx` (ImageResponse with the serif wordmark and tagline on umber), `src/app/icon.svg`, `README.md` (setup, env vars, how to swap photos and fonts, how to add a piece)

- [ ] **Step 1:** Run `npm run lint && npm test && npm run build`. They should pass with no warnings.
- [ ] **Step 2:** Run `npm run dev` and drive the site in Chrome at 1440×900:
  - The home page snaps per slide with the wheel, ArrowDown and dot clicks, the active dot and hash update, and the footer slide is reachable.
  - Collections → piece → Make this mine → bag → reload (it persists) → submit via WhatsApp. A wa.me tab opens with the summary, `/request/sent` loads and the server log shows the email.
- [ ] **Step 3:** Repeat at 375×812. Check that there's no horizontal scroll (`document.documentElement.scrollWidth === 375`), the drawer works, the slides fill `100svh` and the forms are usable. Fix any issues found.
- [ ] **Step 4:** Accessibility pass. Every image has alt text, every interactive element is reachable by Tab with a visible focus ring, the dots have labels, and colour contrast of text over the hero gradient is ≥ 4.5:1.
- [ ] **Step 5:** Commit with `chore: responsive and a11y polish, OG image, README`.
