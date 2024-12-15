import { MessageCircle } from 'lucide-react';
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
  id: string;
  date: string;
  title: string;
  message: string;
}

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const UpdateButton = ({ update, onClick }: { update: Update; onClick?: () => void }) => (
    <Button 
      variant="ghost" 
      className="w-full justify-start h-auto p-4 hover:bg-accent space-y-2"
      onClick={onClick}
    >
      <div className="flex items-start space-x-3 w-full">
        <MessageCircle className="h-5 w-5 mt-1 flex-shrink-0 text-custom-pink" />
        <div className="flex-1 text-left overflow-hidden">
          <p className="text-sm text-muted-foreground">{formatDate(update.date)}</p>
          <p className="text-base font-semibold truncate">{update.title}</p>
          <p className="text-sm text-muted-foreground line-clamp-2">{update.message}</p>
        </div>
      </div>
    </Button>
  );

  const UpdateContent = ({ update }: { update: Update }) => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{formatDate(update.date)}</p>
      <h2 className="text-2xl font-semibold">{update.title}</h2>
      <p className="text-base text-muted-foreground whitespace-pre-wrap">{update.message}</p>
    </div>
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Actualizaciones</CardTitle>
          <CardDescription>Cargando actualizaciones...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!updates?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Actualizaciones</CardTitle>
          <CardDescription>No hay actualizaciones disponibles</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actualizaciones</CardTitle>
        <CardDescription>Últimas actualizaciones del organizador</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {updates.map((update) => (
            isMobile ? (
              <Drawer key={update.id}>
                <DrawerTrigger asChild>
                  <div>
                    <UpdateButton update={update} />
                  </div>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader className="px-4">
                    <UpdateContent update={update} />
                  </DrawerHeader>
                </DrawerContent>
              </Drawer>
            ) : (
              <Dialog key={update.id}>
                <DialogTrigger asChild>
                  <div>
                    <UpdateButton update={update} />
                  </div>
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
