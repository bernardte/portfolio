// 建议放在项目里的路径: lib/icons/icon-library.ts
// 引用方式: import { ICON_LIBRARY, getIconLibraryItem } from "@/lib/icons/icon-library";
//
// 需要先安装依赖:
//   npm install react-icons

import type { IconType } from "react-icons";
import {
  FaCode,
  FaServer,
  FaDatabase,
  FaWrench,
  FaLayerGroup,
  FaGlobe,
  FaTerminal,
  FaMicrochip,
  FaPalette,
  FaFolder,
  FaReact,
  FaNodeJs,
  FaPython,
  FaDocker,
  FaGithub,
  FaGitAlt,
  FaAws,
  FaLinux,
  FaWindows,
  FaApple,
  FaAndroid,
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaPhp,
  FaVuejs,
  FaAngular,
  FaFigma,
  FaSlack,
  FaCloud,
  FaShieldAlt,
  FaCogs,
  FaCube,
  FaDesktop,
  FaMobileAlt,
  FaChartBar,
  FaBug,
  FaRocket,
  FaLock,
  FaKey,
  FaNetworkWired,
  FaChrome,
  FaSass,
  FaNpm,
  FaYarn
} from "react-icons/fa";

export interface IconLibraryItem {
  id: string;
  label: string;
  Icon: IconType;
}

/**
 * 统一图标库。id 直接用 react-icons 的组件名，天然唯一，
 * 也方便以后按 id 反查到底是哪个包的哪个图标。
 *
 * 需要更多图标时，从 react-icons 的其它子包
 * (react-icons/md、react-icons/io5、react-icons/tb ...) 里
 * import 进来，往数组里追加一条即可，其它代码不用改。
 */
export const ICON_LIBRARY: IconLibraryItem[] = [
  { id: "FaCode", label: "Code", Icon: FaCode },
  { id: "FaServer", label: "Server", Icon: FaServer },
  { id: "FaDatabase", label: "Database", Icon: FaDatabase },
  { id: "FaWrench", label: "Tools", Icon: FaWrench },
  { id: "FaLayerGroup", label: "Layers", Icon: FaLayerGroup },
  { id: "FaGlobe", label: "Web", Icon: FaGlobe },
  { id: "FaTerminal", label: "CLI", Icon: FaTerminal },
  { id: "FaMicrochip", label: "System", Icon: FaMicrochip },
  { id: "FaPalette", label: "Design", Icon: FaPalette },
  { id: "FaFolder", label: "General", Icon: FaFolder },
  { id: "FaReact", label: "React", Icon: FaReact },
  { id: "FaNodeJs", label: "Node.js", Icon: FaNodeJs },
  { id: "FaPython", label: "Python", Icon: FaPython },
  { id: "FaDocker", label: "Docker", Icon: FaDocker },
  { id: "FaGithub", label: "GitHub", Icon: FaGithub },
  { id: "FaGitAlt", label: "Git", Icon: FaGitAlt },
  { id: "FaAws", label: "AWS", Icon: FaAws },
  { id: "FaLinux", label: "Linux", Icon: FaLinux },
  { id: "FaWindows", label: "Windows", Icon: FaWindows },
  { id: "FaApple", label: "macOS", Icon: FaApple },
  { id: "FaAndroid", label: "Android", Icon: FaAndroid },
  { id: "FaHtml5", label: "HTML5", Icon: FaHtml5 },
  { id: "FaCss3Alt", label: "CSS3", Icon: FaCss3Alt },
  { id: "FaJs", label: "JavaScript", Icon: FaJs },
  { id: "FaPhp", label: "PHP", Icon: FaPhp },
  { id: "FaVuejs", label: "Vue", Icon: FaVuejs },
  { id: "FaAngular", label: "Angular", Icon: FaAngular },
  { id: "FaFigma", label: "Figma", Icon: FaFigma },
  { id: "FaSlack", label: "Slack", Icon: FaSlack },
  { id: "FaCloud", label: "Cloud", Icon: FaCloud },
  { id: "FaShieldAlt", label: "Security", Icon: FaShieldAlt },
  { id: "FaCogs", label: "Settings", Icon: FaCogs },
  { id: "FaCube", label: "Package", Icon: FaCube },
  { id: "FaDesktop", label: "Desktop", Icon: FaDesktop },
  { id: "FaMobileAlt", label: "Mobile", Icon: FaMobileAlt },
  { id: "FaChartBar", label: "Analytics", Icon: FaChartBar },
  { id: "FaBug", label: "Testing", Icon: FaBug },
  { id: "FaRocket", label: "Deploy", Icon: FaRocket },
  { id: "FaLock", label: "Auth", Icon: FaLock },
  { id: "FaKey", label: "API Key", Icon: FaKey },
  { id: "FaNetworkWired", label: "Network", Icon: FaNetworkWired },
  { id: "FaChrome", label: "Browser", Icon: FaChrome },
  { id: "FaSass", label: "Sass", Icon: FaSass },
  { id: "FaNpm", label: "npm", Icon: FaNpm },
  { id: "FaYarn", label: "Yarn", Icon: FaYarn }
];

/**
 * 旧版本(只有 10 个 lucide-react 图标)遗留下来的 id -> 新图标库 id 映射。
 * 保证数据库里历史存的 "icon:code" / "icon:server" 这类旧值升级后依旧能正常渲染，
 * 不会因为改了图标库就集体变成默认的 Folder 图标。
 */
const LEGACY_ICON_ID_MAP: Record<string, string> = {
  code: "FaCode",
  server: "FaServer",
  database: "FaDatabase",
  wrench: "FaWrench",
  layers: "FaLayerGroup",
  globe: "FaGlobe",
  terminal: "FaTerminal",
  cpu: "FaMicrochip",
  palette: "FaPalette",
  folder: "FaFolder"
};

export const getIconLibraryItem = (
  rawId: string
): IconLibraryItem | undefined => {
  const id = LEGACY_ICON_ID_MAP[rawId] ?? rawId;
  return ICON_LIBRARY.find((item) => item.id === id);
};

export const DEFAULT_ICON_ID = "FaCode";
