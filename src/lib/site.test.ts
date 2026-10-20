import { site } from "./site";
test("site constants", () => {
  expect(site.name).toBe("Hafe Atelier");
  expect(site.tagline).toBe("Bespoke Pakistani occasionwear for women around the world");
  expect(site.leadTime).toBe("6–8 weeks");
  expect(site.heroImage).toMatch(/^\/images\//);
});
