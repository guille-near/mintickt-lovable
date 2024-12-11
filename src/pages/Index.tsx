import { WalletButton } from "@/components/WalletButton";
import { EventCard } from "@/components/EventCard";

const mockEvents = [
  {
    id: "1",  // Changed from number to string
    title: "Solana Summer Fest",
    date: "Aug 15, 2024",
    price: 2.5,
    image: "https://picsum.photos/seed/1/400",
  },
  {
    id: "2",  // Changed from number to string
    title: "NFT Conference 2024",
    date: "Sep 20, 2024",
    price: 1.8,
    image: "https://picsum.photos/seed/2/400",
  },
  {
    id: "3",  // Changed from number to string
    title: "Blockchain Summit",
    date: "Oct 5, 2024",
    price: 3.0,
    image: "https://picsum.photos/seed/3/400",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary to-primary">
      <header className="container mx-auto flex items-center justify-between p-6">
        <h1 className="text-2xl font-bold text-white">NFT Tickets</h1>
        <WalletButton />
      </header>

      <main className="container mx-auto px-6 py-12">
        <section className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-white">
            Experience Web3 Events
          </h2>
          <p className="mx-auto max-w-2xl text-gray-300">
            Purchase and collect event tickets as NFTs on Solana. Secure,
            transferable, and authentically yours.
          </p>
        </section>

        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockEvents.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </section>
      </main>
    </div>
  );
};

export default Index;