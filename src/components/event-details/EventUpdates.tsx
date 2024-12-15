import { MessageCircle } from 'lucide-react';
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
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
      <h2 className="text-2xl font-semibold">{update.title}</h2>
      <p className="text-base text-muted-foreground">{update.message}</p>
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
                    <div className="p-4">
                      <UpdateContent update={update} />
                    </div>
                  </DrawerHeader>
                </DrawerContent>
              </Drawer>
            ) : (
              <Dialog key={index}>
                <DialogTrigger>
                  <UpdateButton update={update} />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <div className="p-4">
                      <UpdateContent update={update} />
                    </div>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            )
          ))}
        </div>
      </CardContent>
    </Card>
  );
};