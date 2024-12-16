import { EventLocation } from "./EventLocation";
import { EventUpdates } from "./EventUpdates";
import { useIsMobile } from "@/hooks/use-mobile";

interface EventContentProps {
  description: string | null;
  location: string | null;
  id: string;
  price: number;
  title: string;
}

export const EventContent = ({ description, location, id, price, title }: EventContentProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-4 text-primary font-yrsa">Event Details</h2>
          <div className="space-y-4 text-muted-foreground font-yrsa font-light text-xl">
            <p>{description || 'No description available.'}</p>
            <p>
              Join us for an unforgettable experience at this amazing event. We've carefully curated every detail to ensure you have the best time possible. From the moment you arrive, you'll be immersed in an atmosphere of excitement and wonder.
            </p>
            <p>
              This event brings together the best of entertainment, networking, and learning opportunities. Whether you're a seasoned professional or just starting out, you'll find valuable connections and insights here.
            </p>
            <p>What to expect:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Interactive sessions with industry experts</li>
              <li>Networking opportunities with like-minded individuals</li>
              <li>Exclusive content and presentations</li>
              <li>Complimentary refreshments throughout the event</li>
              <li>Special surprise announcements and giveaways</li>
            </ul>
            <p>
              Don't miss out on this extraordinary opportunity to be part of something special. Secure your tickets now and prepare for an event that will exceed your expectations.
            </p>
          </div>
        </div>

        <EventLocation 
          location={location || 'Location TBA'} 
          mapUrl="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.982939764862!2d-73.98823908459384!3d40.74844097932847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1629794729765!5m2!1sen!2sus"
        />

        <EventUpdates eventId={id} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-primary font-yrsa">Event Details</h2>
        <div className="space-y-4 text-muted-foreground font-yrsa font-light text-xl">
          <p>{description || 'No description available.'}</p>
          <p>
            Join us for an unforgettable experience at this amazing event. We've carefully curated every detail to ensure you have the best time possible. From the moment you arrive, you'll be immersed in an atmosphere of excitement and wonder.
          </p>
          <p>
            This event brings together the best of entertainment, networking, and learning opportunities. Whether you're a seasoned professional or just starting out, you'll find valuable connections and insights here.
          </p>
          <p>What to expect:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Interactive sessions with industry experts</li>
            <li>Networking opportunities with like-minded individuals</li>
            <li>Exclusive content and presentations</li>
            <li>Complimentary refreshments throughout the event</li>
            <li>Special surprise announcements and giveaways</li>
          </ul>
          <p>
            Don't miss out on this extraordinary opportunity to be part of something special. Secure your tickets now and prepare for an event that will exceed your expectations.
          </p>
        </div>
      </div>

      <div className="space-y-4 text-muted-foreground">
        <EventLocation 
          location={location || 'Location TBA'} 
          mapUrl="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.982939764862!2d-73.98823908459384!3d40.74844097932847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1629794729765!5m2!1sen!2sus"
        />
      </div>

      <EventUpdates eventId={id} />
    </div>
  );
};