import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "linear-gradient(135deg, #fef3c7, #d1fae5)",
          padding: 60
        }}
      >
        <h1 style={{ fontSize: 72, margin: 0 }}>Developer Portfolio</h1>
        <p style={{ fontSize: 30 }}>Projects, Research, and Production Engineering</p>
      </div>
    ),
    size
  );
}
