import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface Event {
  id: string;
  title: string;
  date: string;
}

interface ProfileEventsProps {
  title: string;
  events: Event[];
}

export function ProfileEvents({ title, events }: ProfileEventsProps) {
  if (!events || events.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {events.map((event) => (
          <Card key={event.id} className="bg-[#080808] text-white">
            <CardContent className="p-4">
              <h4 className="font-semibold text-sm sm:text-base">{event.title}</h4>
              <p className="text-xs sm:text-sm text-gray-300">
                {new Date(event.date).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}