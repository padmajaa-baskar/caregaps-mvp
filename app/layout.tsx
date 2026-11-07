export const metadata = {
  title: "CareGaps CCM — live check-in",
  description: "Talk to the CareGaps voice agent",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          background: "#f4f1ec",
          color: "#1f2a26",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
