import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { UpdateButton } from "./update-components/UpdateButton";
import { UpdateContent } from "./update-components/UpdateContent";
import type { Update } from "./types";

interface EventUpdatesProps {
  eventId: string;
}

export const EventUpdates = ({ eventId }: EventUpdatesProps) => {
  const isMobile = useIsMobile();

  const { data: updates, isLoading } = useQuery({
    queryKey: ['event-updates', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('event_updates')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(update => ({
        ...update,
        date: update.created_at
      }));
    }
  });

  if (isLoading) {
    return (
      <Card className="w-full overflow-hidden">
        <CardHeader>
          <CardTitle className="font-yrsa">Updates</CardTitle>
          <CardDescription>Loading updates...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!updates?.length) {
    return (
      <Card className="w-full overflow-hidden">
        <CardHeader>
          <CardTitle className="font-yrsa">Updates</CardTitle>
          <CardDescription>No updates available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader>
        <CardTitle className="font-yrsa">Updates</CardTitle>
        <CardDescription>Latest updates from the organizer</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {updates.map((update) => (
            isMobile ? (
              <Drawer key={update.id}>
                <DrawerTrigger asChild>
                  <div className="w-full">
                    <UpdateButton update={update} />
                  </div>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <UpdateContent update={update} />
                  </DrawerHeader>
                </DrawerContent>
              </Drawer>
            ) : (
              <Dialog key={update.id}>
                <DialogTrigger asChild>
                  <div className="w-full">
                    <UpdateButton update={update} />
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="sr-only">
                      {update.title}
                    </DialogTitle>
                    <UpdateContent update={update} />
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