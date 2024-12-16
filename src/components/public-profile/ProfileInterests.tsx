import { Badge } from "@/components/ui/badge";

interface ProfileInterestsProps {
  interests: string[];
}

export function ProfileInterests({ interests }: ProfileInterestsProps) {
  if (!interests?.length) return null;

  return (
    <div className="flex justify-center mt-4">
      <div className="flex flex-wrap gap-2 justify-center">
        {interests.map((interest) => (
          <Badge key={interest} variant="secondary">
            {interest}
          </Badge>
        ))}
      </div>
    </div>
  );
}