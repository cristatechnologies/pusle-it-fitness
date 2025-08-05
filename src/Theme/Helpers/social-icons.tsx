import { Facebook, Instagram, PhoneIcon, Youtube, Twitter } from "lucide-react";
import Link from "next/link";

interface SocialIcon {
  id: number;
  link: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

interface SocialIconsProps {
  socialIcons?: SocialIcon[];
  iconSize?: number;
  className?: string;
}

const SocialIcons = ({
  socialIcons,
  iconSize = 24,
  className = "text-gray-600 hover:text-gray-900",
}: SocialIconsProps) => {
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Facebook":
        return Facebook;
      case "Instagram":
        return Instagram;
      case "WhatsApp":
        return PhoneIcon;
      case "YouTube":
        return Youtube;
      case "Twitter":
        return Twitter;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center space-x-4">
      {socialIcons?.map((social) => {
        const IconComponent = getIconComponent(social.icon);
        if (!IconComponent) return null;

        return (
          <Link
            key={social.id}
            href={social.link}
            className={className}
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconComponent size={iconSize} /> {/* Fixed: Using iconSize prop */}
            <span className="sr-only">{social.icon}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default SocialIcons;
