import React from "react";
import { Github, Linkedin, Twitter } from "lucide-react";

const HeaderSocialLinks = () => {
  const socialLinks = [
    {
      id: 1,
      icon: <Github size={18} />,
      url: "https://github.com/mahedizaman",
      label: "GitHub",
      color: "hover:bg-gray-800",
    },
    {
      id: 2,
      icon: <Linkedin size={18} />,
      url: "https://www.linkedin.com/in/md-mahedi-zaman/",
      label: "LinkedIn",
      color: "hover:bg-blue-600",
    },
    {
      id: 3,
      icon: <Twitter size={18} />,
      url: "https://twitter.com",
      label: "Twitter",
      color: "hover:bg-sky-500",
    },
  ];

  return (
    <div className="flex items-center gap-3">
      {socialLinks.map((link) => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          className={`
            group relative p-2.5 rounded-full bg-white/10 text-white 
            backdrop-blur-sm border border-white/5
            transition-all duration-300 ease-out
            hover:scale-110 hover:-translate-y-1 active:scale-95
            ${link.color}
          `}
        >
          {/* Icon */}
          <span className="relative z-10">{link.icon}</span>

          {/* Tooltip (Only shows on hover) */}
          <span
            className="absolute -bottom-10 left-1/2 -translate-x-1/2 
            scale-0 group-hover:scale-100 transition-transform duration-200
            bg-white text-black text-[10px] font-bold py-1 px-2 rounded 
            pointer-events-none shadow-xl border border-gray-200"
          >
            {link.label}
          </span>
        </a>
      ))}
    </div>
  );
};

export default HeaderSocialLinks;
