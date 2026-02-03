import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExternalLink, GitBranch, Rocket } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 font-body">
      <div className="animate-in fade-in-50 slide-in-from-bottom-16 duration-700">
        <Card className="w-full max-w-2xl rounded-2xl shadow-xl">
          <CardHeader className="items-center p-8 text-center">
            <div className="mb-4 rounded-full bg-primary/10 p-5 text-primary">
              <Rocket className="h-10 w-10" />
            </div>
            <CardTitle className="font-headline text-4xl font-bold">
              Firebase App Hosting
            </CardTitle>
            <CardDescription className="pt-2 text-lg text-muted-foreground">
              Your Next.js application is configured and ready to be deployed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 p-8 pt-0">
            <div className="space-y-4 rounded-lg border bg-card p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10">
                  <GitBranch className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    Continuous Deployment
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Connect your GitHub repository to enable automatic
                    deployments on every push to your main branch.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="mb-4 text-muted-foreground">
                You can start by editing{" "}
                <code className="rounded bg-muted px-2 py-1 font-mono text-sm font-code">
                  src/app/page.tsx
                </code>
              </p>

              <Button
                asChild
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <a
                  href="https://firebase.google.com/docs/app-hosting"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  Read the Docs
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
