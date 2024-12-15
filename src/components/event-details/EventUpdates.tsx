import { MessageCircle } from 'lucide-react';
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
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
  const isMobile = useIsMobile();

  const UpdateContent = ({ update }: { update: Update }) => (
    <>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{update.date}</p>
        <p className="text-sm font-medium">{update.title}</p>
        <p className="text-sm text-muted-foreground">{update.message}</p>
      </div>
    </>
  );

  const UpdateTrigger = ({ update }: { update: Update }) => (
    <div className="flex cursor-pointer items-start space-x-2 rounded-md p-2 hover:bg-accent">
      <MessageCircle className="mt-1 h-5 w-5" />
      <div>
        <p className="text-sm text-muted-foreground">{update.date}</p>
        <p className="text-sm font-medium">{update.title}</p>
        <p className="text-sm text-muted-foreground line-clamp-2">{update.message}</p>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Updates</CardTitle>
        <CardDescription>Latest updates from the organizer</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {updates.map((update, index) => (
            isMobile ? (
              <Drawer key={index}>
                <DrawerTrigger asChild>
                  <UpdateTrigger update={update} />
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>{update.title}</DrawerTitle>
                    <DrawerDescription>{update.date}</DrawerDescription>
                  </DrawerHeader>
                  <div className="p-4">
                    <UpdateContent update={update} />
                  </div>
                </DrawerContent>
              </Drawer>
            ) : (
              <Dialog key={index}>
                <DialogTrigger asChild>
                  <UpdateTrigger update={update} />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{update.title}</DialogTitle>
                    <DialogDescription>{update.date}</DialogDescription>
                  </DialogHeader>
                  <UpdateContent update={update} />
                </DialogContent>
              </Dialog>
            )
          ))}
        </div>
      </CardContent>
    </Card>
  );
};