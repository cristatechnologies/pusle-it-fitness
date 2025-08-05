import React, { useState } from "react";
import {
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle,
  Mail,
  Copy,
  Check,
} from "lucide-react";

const SocialShareComponent = ({
  socialUrl,
  title,
}: {
  socialUrl: string;
  title: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareOptions = [
    {
      name: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        socialUrl
      )}`,
    },
    {
      name: "Twitter",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        socialUrl
      )}&text=${encodeURIComponent(title)}`,
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        socialUrl
      )}`,
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      url: `https://wa.me/?text=${encodeURIComponent(title + " " + socialUrl)}`,
    },
    {
      name: "Email",
      icon: Mail,
      url: `mailto:?subject=${encodeURIComponent(
        title
      )}&body=${encodeURIComponent(socialUrl)}`,
    },
  ];

  const handleShare = (shareUrl: string) => {
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(socialUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.log("Failed to copy: ", err);
    }
  };

  return (
    <div className="relative">
      {/* Share Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded transition-colors"
      >
        <Share2 size={18} className="text-gray-700" />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded p-1 z-20 w-40">
            {/* Social Options */}
            {shareOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <button
                  key={option.name}
                  onClick={() => {
                    handleShare(option.url);
                    setIsOpen(false);
                  }}
                  className="w-full flex cursor-pointer items-center gap-2 px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded"
                >
                  <IconComponent size={14} />
                  <span>{option.name}</span>
                </button>
              );
            })}

            {/* Copy Link */}
            <button
              onClick={() => {
                copyToClipboard();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded border-t border-gray-100 mt-1 pt-2"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SocialShareComponent;
