import Header from "../components/Header";

export default function DashboardLayout({
  children,
  nickname,
}) {
  return (
    <div
      className="
      min-h-screen
      bg-zinc-950
      "
    >
      <Header nickname={nickname} />

      <main
        className="
        max-w-7xl
        mx-auto
        px-6
        py-6
        "
      >
        {children}
      </main>
    </div>
  );
}