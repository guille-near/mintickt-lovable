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
import { Button } from "@/components/ui/button";

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

  const UpdateButton = ({ update, onClick }: { update: Update; onClick?: () => void }) => (
    <Button 
      variant="ghost" 
      className="w-full justify-start h-auto p-2 hover:bg-accent"
      onClick={onClick}
    >
      <div className="flex items-start space-x-2">
        <MessageCircle className="mt-1 h-5 w-5" />
        <div>
          <p className="text-sm text-muted-foreground">{update.date}</p>
          <p className="text-sm font-medium text-left">{update.title}</p>
          <p className="text-sm text-muted-foreground line-clamp-2 text-left">{update.message}</p>
        </div>
      </div>
    </Button>
  );

  const UpdateContent = ({ update }: { update: Update }) => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{update.date}</p>
      <p className="text-lg font-medium">{update.title}</p>
      <p className="text-sm text-muted-foreground">{update.message}</p>
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
                <DrawerTrigger>
                  <UpdateButton update={update} />
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
                <DialogTrigger>
                  <UpdateButton update={update} />
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