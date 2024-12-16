import { Badge } from "@/components/ui/badge";

interface ProfileInterestsProps {
  interests: string[];
}

export function ProfileInterests({ interests }: ProfileInterestsProps) {
  if (!interests?.length) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Interests</h2>
      <div className="flex flex-wrap gap-2">
        {interests.map((interest) => (
          <Badge key={interest} variant="secondary">
            {interest}
          </Badge>
        ))}
      </div>
    </div>
  );
}