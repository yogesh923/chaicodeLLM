import { Button } from "@/components/ui/button";

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Vite + React + Tailwind + shadcn
          </h1>
          <p className="text-muted-foreground">
            Scaffold ready. Start building in <code className="bg-muted px-1.5 py-0.5 rounded text-sm">src/App.jsx</code>
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <Button>Get Started</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </div>

        <p className="text-sm text-muted-foreground">
          API URL: {import.meta.env.VITE_API_URL || "http://localhost:5000"}
        </p>
      </div>
    </div>
  );
}

export default App;
