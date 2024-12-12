import { MessageCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface Update {
  date: string;
  title: string;
  message: string;
}

interface EventUpdatesProps {
  updates: Update[];
}

export const EventUpdates = ({ updates }: EventUpdatesProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Updates</CardTitle>
        <CardDescription>Latest updates from the organizer</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {updates.map((update, index) => (
            <Dialog key={index}>
              <DialogTrigger asChild>
                <div className="flex cursor-pointer items-start space-x-2 rounded-md p-2 hover:bg-accent">
                  <MessageCircle className="mt-1 h-5 w-5" />
                  <div>
                    <p className="text-sm text-muted-foreground">{update.date}</p>
                    <p className="text-sm font-medium">{update.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{update.message}</p>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{update.title}</DialogTitle>
                  <DialogDescription>{update.date}</DialogDescription>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">{update.message}</p>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};