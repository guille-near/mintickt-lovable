import { SimpleHeader } from "@/components/SimpleHeader";

interface ProfileContainerProps {
  children: React.ReactNode;
}

export function ProfileContainer({ children }: ProfileContainerProps) {
  return (
    <div className="min-h-screen flex flex-col dark:bg-[linear-gradient(135deg,#FF00E5_1%,transparent_8%),_linear-gradient(315deg,rgba(94,255,69,0.25)_0.5%,transparent_8%)] dark:bg-black">
      <SimpleHeader />
      <div className="container mx-auto px-4 py-7">
        <div className="max-w-4xl mx-auto space-y-8">
          {children}
        </div>
      </div>
    </div>
  );
}