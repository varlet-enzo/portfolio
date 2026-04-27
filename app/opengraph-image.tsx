import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Enzo Varlet — Game Developer Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          padding: "60px 72px",
          background: "#080B10",
          position: "relative",
          fontFamily: "monospace",
        }}
      >
        {/* Grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(0,229,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.05) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 900,
            height: 500,
            background:
              "radial-gradient(ellipse, rgba(232,255,71,0.08) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 24,
            position: "relative",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#E8FF47",
              boxShadow: "0 0 8px #E8FF47",
            }}
          />
          <span
            style={{
              color: "#E8FF47",
              fontSize: 13,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            Alternance 2024–2025
          </span>
        </div>

        {/* Name */}
        <div style={{ position: "relative", marginBottom: 16 }}>
          <span
            style={{
              fontSize: 80,
              fontWeight: 900,
              color: "#F0F6FC",
              lineHeight: 1,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            ENZO{" "}
          </span>
          <span
            style={{
              fontSize: 80,
              fontWeight: 900,
              color: "#E8FF47",
              lineHeight: 1,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              textShadow: "0 0 40px rgba(232,255,71,0.5)",
            }}
          >
            VARLET
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            color: "#8B949E",
            fontSize: 18,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginBottom: 40,
          }}
        >
          Game Developer · Unity · Unreal Engine 5 · C#
        </div>

        {/* Tags */}
        <div style={{ display: "flex", gap: 12 }}>
          {["Unity", "UE5", "C#", "Level Design", "Game Design"].map((tag) => (
            <div
              key={tag}
              style={{
                padding: "6px 14px",
                border: "1px solid rgba(240,246,252,0.15)",
                color: "#8B949E",
                fontSize: 12,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                background: "rgba(240,246,252,0.04)",
                borderRadius: 2,
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
