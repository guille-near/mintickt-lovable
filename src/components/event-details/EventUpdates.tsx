import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Actualizaciones</CardTitle>
          <CardDescription>Cargando actualizaciones...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!updates?.length) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Actualizaciones</CardTitle>
          <CardDescription>No hay actualizaciones disponibles</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Actualizaciones</CardTitle>
        <CardDescription>Últimas actualizaciones del organizador</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-w-full">
          {updates.map((update) => (
            isMobile ? (
              <Drawer key={update.id}>
                <DrawerTrigger className="w-full">
                  <UpdateButton update={update} />
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader className="px-4">
                    <UpdateContent update={update} />
                  </DrawerHeader>
                </DrawerContent>
              </Drawer>
            ) : (
              <Dialog key={update.id}>
                <DialogTrigger className="w-full">
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