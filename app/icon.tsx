import { ImageResponse } from "next/og"

// 브라우저 탭용 파비콘 — public/favicon.ico 없을 때 404 방지
export const size = { width: 32, height: 32 }
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f97316",
          borderRadius: 8,
          color: "white",
          fontSize: 20,
          fontWeight: 800
        }}
      >
        O
      </div>
    ),
    { ...size }
  )
}
