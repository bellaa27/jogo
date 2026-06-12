/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  Layout,
  FileCode,
  Terminal,
  Database,
  Globe,
  Codepen,
  Network,
  Compass,
  Flame,
  Cpu,
  Sparkles,
  Award,
  BookOpen,
  Users,
  Trophy,
  Zap,
  HelpCircle,
  Gem,
  Lock,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Code2,
  ChevronRight,
  School,
  ArrowRight,
  User,
  Activity,
  Heart,
  MessageSquare
} from "lucide-react";

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className = "", size = 20 }) => {
  const iconMap: Record<string, React.ComponentType<any>> = {
    Layout,
    FileCode,
    Terminal,
    Database,
    Globe,
    Codepen,
    Network,
    Compass,
    Flame,
    Cpu,
    Sparkles,
    Award,
    BookOpen,
    Users,
    Trophy,
    Zap,
    HelpCircle,
    Gem,
    Lock,
    CheckCircle2,
    AlertCircle,
    Play,
    RotateCcw,
    Code2,
    ChevronRight,
    School,
    ArrowRight,
    User,
    Activity,
    Heart,
    MessageSquare
  };

  const IconComponent = iconMap[name] || HelpCircle;
  return <IconComponent className={className} size={size} />;
};
