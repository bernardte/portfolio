import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { SiGmail } from "react-icons/si";
import { ProfileResponse } from "../interface/portfolio.interface";
import { IconType } from "react-icons";

export interface SocialMediaLinkItem {
  label: string;
  href: string;
  icon: IconType;
}

export const getSocialMediaLink = (
  profile: ProfileResponse
): SocialMediaLinkItem[] => {
  return [
    { label: "Github", href: profile.githubLink ?? "", icon: FaGithub },
    { label: "LinkedIn", href: profile.linkedinLink ?? "", icon: FaLinkedin },
    { label: "Email", href: `mailto:${profile.email}`, icon: SiGmail }
  ];
};
