import { User2 } from "lucide-react";

interface ErrorStateProps {
  username: string;
}

export function ErrorState({ username }: ErrorStateProps) {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <User2 className="mx-auto h-12 w-12 text-gray-400" />
        <h1 className="text-2xl font-bold">Profile not found</h1>
        <p className="text-muted-foreground">
          The user @{username} doesn't exist or hasn't set up their profile yet.
        </p>
      </div>
    </div>
  );
}