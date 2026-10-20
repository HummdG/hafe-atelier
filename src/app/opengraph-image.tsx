import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#3b2a20",
          color: "#f7f3ee",
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        <div style={{ fontSize: 104, letterSpacing: 18, fontWeight: 300 }}>HAFE ATELIER</div>
        <div style={{ width: 120, height: 2, background: "#b08d57", margin: "40px 0" }} />
        <div style={{ fontSize: 30, letterSpacing: 2, color: "#d9c7a5", maxWidth: 900, textAlign: "center" }}>
          {site.tagline}
        </div>
      </div>
    ),
    size,
  );
}
