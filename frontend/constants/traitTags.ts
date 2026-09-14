import { Layers, Rocket, Brain, Users } from 'lucide-react';

import { ComponentType } from "react";
import { LucideProps } from "lucide-react";

export interface TraitItem {
  id: string;
  title: string;
  description: string;
  icon: ComponentType<LucideProps>;
}



export const TRAIT_ITEMS: TraitItem[] = [
  {
    id: 'full-stack',
    title: 'Full-Stack Development',
    description: 'Experience in building end-to-end web applications.',
    icon: Layers,
  },
  {
    id: 'problem-solver',
    title: 'Problem Solver',
    description: 'Strong analytical skills and passion for solving real-world problems.',
    icon: Rocket,
  },
  {
    id: 'quick-learner',
    title: 'Quick Learner',
    description: 'Eager to learn new technologies and adapt to new challenges.',
    icon: Brain,
  },
  {
    id: 'team-player',
    title: 'Team Player',
    description: 'Good communication and collaboration skills.',
    icon: Users,
  },
];