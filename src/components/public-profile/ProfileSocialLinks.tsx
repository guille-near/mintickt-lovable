import { Link2 } from "lucide-react";
import { SocialMediaLinks } from "@/components/account/types";

interface ProfileSocialLinksProps {
  socialMedia: SocialMediaLinks;
}

export function ProfileSocialLinks({ socialMedia }: ProfileSocialLinksProps) {
  if (!socialMedia || !Object.values(socialMedia).some(link => link)) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Connect</h2>
      <div className="flex flex-wrap gap-4">
        {Object.entries(socialMedia).map(([platform, url]) => {
          if (!url) return null;
          return (
            <a
              key={platform}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Link2 className="h-4 w-4" />
              {platform.charAt(0).toUpperCase() + platform.slice(1)}
            </a>
          );
        })}
      </div>
    </div>
  );
}