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
    <Card className="bg-card backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">Updates</CardTitle>
        <CardDescription className="text-gray-300">Latest updates from the organizer</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {updates.map((update, index) => (
            <Dialog key={index}>
              <DialogTrigger asChild>
                <div className="border-b border-gray-700 pb-4 last:border-b-0 last:pb-0 cursor-pointer hover:bg-gray-800/50 rounded-md p-2 transition-colors">
                  <p className="text-sm text-gray-400 mb-2">{update.date}</p>
                  <div className="flex items-start space-x-2">
                    <MessageCircle className="w-5 h-5 mt-1 flex-shrink-0 text-gray-300" />
                    <div>
                      <p className="text-sm font-medium text-white">{update.title}</p>
                      <p className="text-sm text-gray-400 mt-1 line-clamp-2">{update.message}</p>
                    </div>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="bg-card backdrop-blur-sm">
                <DialogHeader>
                  <DialogTitle className="text-white">{update.title}</DialogTitle>
                  <DialogDescription className="text-gray-300">{update.date}</DialogDescription>
                </DialogHeader>
                <p className="mt-4 text-gray-300">{update.message}</p>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};