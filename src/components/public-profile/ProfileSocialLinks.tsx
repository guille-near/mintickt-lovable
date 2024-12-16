import { Link2, Twitter, Instagram, Linkedin } from "lucide-react";
import { SocialMediaLinks } from "@/components/account/types";

interface ProfileSocialLinksProps {
  socialMedia: SocialMediaLinks;
}

export function ProfileSocialLinks({ socialMedia }: ProfileSocialLinksProps) {
  if (!socialMedia || !Object.values(socialMedia).some(link => link)) return null;

  const getIconForPlatform = (platform: string) => {
    switch (platform) {
      case 'x':
        return <Twitter className="h-5 w-5" />;
      case 'instagram':
        return <Instagram className="h-5 w-5" />;
      case 'linkedin':
        return <Linkedin className="h-5 w-5" />;
      default:
        return <Link2 className="h-5 w-5" />;
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex gap-6">
        {Object.entries(socialMedia).map(([platform, url]) => {
          if (!url) return null;
          return (
            <a
              key={platform}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              title={platform.charAt(0).toUpperCase() + platform.slice(1)}
            >
              {getIconForPlatform(platform)}
            </a>
          );
        })}
      </div>
    </div>
  );
}