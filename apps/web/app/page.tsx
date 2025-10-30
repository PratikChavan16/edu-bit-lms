export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Bitflow Owner Portal</h1>
        <p className="text-muted-foreground mb-8">
          Platform administration portal for Bitflow LMS
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm">Backend API running at http://localhost:3000</span>
        </div>
      </div>
    </main>
  );
}
