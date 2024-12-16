import React from "react";
import { Badge } from "@/components/ui/badge";

interface ProfileInterestsProps {
  interests: string[];
}

export function ProfileInterests({ interests }: ProfileInterestsProps) {
  if (!interests || interests.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Interests</h3>
      <div className="flex flex-wrap gap-2">
        {interests.map((interest) => (
          <Badge key={interest} variant="secondary" className="text-xs sm:text-sm">
            {interest}
          </Badge>
        ))}
      </div>
    </div>
  );
}