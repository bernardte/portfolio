"use client";

import { useEffect, useState } from "react";

const codeLines = [
  { text: "// Hello, World! I'm Tee Yu Hang" },
  { text: "const developer = {" },
  { text: "  name: 'Tee Yu Hang'," },
  { text: "  applyRole: 'Software Developer'," },
  { text: "  focus: ['AI', 'Full-Stack Development']," },
  { text: "  passion: 'Solving real-world problems'," },
  { text: "};" }
];

export default function CodeWindow() {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);

  useEffect(() => {
    if (lineIndex >= codeLines.length) {
      const resetTimeout = setTimeout(() => {
        setDisplayedLines([]);
        setLineIndex(0);
        setCharIndex(0);
      }, 2000);

      return () => clearTimeout(resetTimeout);
    }

    const currentLine = codeLines[lineIndex].text;

    if (charIndex < currentLine.length) {
      const timeout = setTimeout(() => {
        setCharIndex((c) => c + 1);
      }, 35);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setDisplayedLines((lines) => [...lines, currentLine]);
        setLineIndex((l) => l + 1);
        setCharIndex(0);
      }, 150);
      return () => clearTimeout(timeout);
    }
  }, [charIndex, lineIndex]);

  const currentTyping =
    lineIndex < codeLines.length
      ? codeLines[lineIndex].text.slice(0, charIndex)
      : "";

  return (
    <div className="relative w-full max-w-6xl">
      
      {/* 环境光晕层 —— 放在窗口后面，做柔和的呼吸发光 */}
      <div className="pointer-events-none absolute -inset-6 z-10">
        <div className="absolute top-1/4 left-1/4 size-40 animate-pulse rounded-full bg-purple-500/20 blur-3xl [animation-duration:4s]" />
        <div className="absolute right-1/4 bottom-1/4 size-40 animate-pulse rounded-full bg-sky-400/20 blur-3xl [animation-delay:1s] [animation-duration:5s]" />
        <div className="absolute top-1/2 left-1/2 size-32 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-amber-400/10 blur-3xl [animation-delay:0.5s] [animation-duration:6s]" />
      </div>

      {/* 代码窗口本体 */}
      <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-[#0F1330] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]">
        {/* 标题栏 */}
        <div className="flex items-center gap-2 border-b border-white/5 bg-[#151A3A] px-4 py-3">
          <div className="flex gap-1.5">
            <span className="size-3 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.6)]" />
            <span className="size-3 rounded-full bg-yellow-500 shadow-[0_0_6px_rgba(234,179,8,0.6)]" />
            <span className="size-3 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]" />
          </div>
          <span className="ml-2 font-mono text-xs text-neutral-500">
            developer.ts
          </span>
        </div>

        {/* 代码区域 */}
        <div className="min-h-[300px] px-6 py-6 font-mono text-sm leading-7 whitespace-pre">
          {displayedLines.map((line, i) => (
            <CodeLine key={i} text={line} />
          ))}
          {lineIndex < codeLines.length && (
            <div className="inline-flex items-center">
              <CodeLine text={currentTyping} />
              <span
                className="ml-0.5 animate-pulse font-bold text-amber-400"
                style={{
                  textShadow:
                    "0 0 8px rgba(251,191,36,0.9), 0 0 16px rgba(251,191,36,0.5)"
                }}
              >
              |
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CodeLine({ text }: { text: string }) {
  if (text.trim().startsWith("//")) {
    return <div className="text-neutral-500 italic">{text}</div>;
  }

  const tokens = parseCodeTokens(text);

  return (
    <div>
      {tokens.map((token, index) => {
        switch (token.type) {
          case "keyword":
            return (
              <span key={index} className="font-semibold text-purple-400">
                {token.value}
              </span>
            );
          case "key":
            return (
              <span key={index} className="text-sky-300">
                {token.value}
              </span>
            );
          case "string":
            return (
              <span key={index} className="text-emerald-400">
                {token.value}
              </span>
            );
          case "punctuation":
            return (
              <span key={index} className="text-neutral-400">
                {token.value}
              </span>
            );
          default:
            return (
              <span key={index} className="text-neutral-200">
                {token.value}
              </span>
            );
        }
      })}
    </div>
  );
}

function parseCodeTokens(text: string) {
  const regex =
    /(const)|([a-zA-Z_$][a-zA-Z0-9_$]*)(?=\s*:)|('(?:[^'\\]|\\.)*')|([{}[\],:])|([^'a-zA-Z0-9_{}[\]:,]+|[a-zA-Z0-9_$]+)/g;
  const tokens = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match[1]) tokens.push({ type: "keyword", value: match[1] });
    else if (match[2]) tokens.push({ type: "key", value: match[2] });
    else if (match[3]) tokens.push({ type: "string", value: match[3] });
    else if (match[4]) tokens.push({ type: "punctuation", value: match[4] });
    else if (match[5]) tokens.push({ type: "text", value: match[5] });
  }

  return tokens;
}
