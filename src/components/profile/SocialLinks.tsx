import React from "react";
import { Twitter, Linkedin, Instagram, AtSign } from 'lucide-react';
import { SocialMedia } from "@/components/account/types";

interface SocialLinksProps {
  socialMedia: SocialMedia;
}

export function SocialLinks({ socialMedia }: SocialLinksProps) {
  const socialMediaLinks = [
    { platform: "x", url: socialMedia.x, icon: <Twitter /> },
    { platform: "linkedin", url: socialMedia.linkedin, icon: <Linkedin /> },
    { platform: "instagram", url: socialMedia.instagram, icon: <Instagram /> },
    { platform: "threads", url: socialMedia.threads, icon: <AtSign /> },
  ].filter(link => link.url);

  if (socialMediaLinks.length === 0) return null;

  return (
    <div className="flex justify-center space-x-6">
      {socialMediaLinks.map(({ platform, url, icon }) => (
        <a
          key={platform}
          href={url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-primary-foreground transition-colors"
        >
          {React.cloneElement(icon, { className: "w-6 h-6 sm:w-7 sm:h-7" })}
          <span className="sr-only">{platform}</span>
        </a>
      ))}
    </div>
  );
}