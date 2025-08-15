"use client";
import Image from "next/image";
import { useState, useMemo } from "react";

export default function SmartImage({
  src,
  alt,
  className = "",
  fill = true,
  width,
  height,
  sizes = "100vw",
  priority = false,
  loading = "lazy",
  unoptimized = false,
  style,
  ...rest
}) {
  const [errored, setErrored] = useState(false);
  let finalUnoptimized = unoptimized;

  try {
    // For any remote image, avoid Next.js proxying to prevent server 500s
    if (typeof src === "string" && /^https?:\/\//.test(src)) {
      finalUnoptimized = true;
    }
  } catch (_) {
    // ignore URL parse errors, keep provided unoptimized value
  }
  // If explicit width/height is provided, don't use fill
  const useFill = fill && !(width && height);
  
  // Determine loading behavior: Next.js forbids combining priority with loading="lazy"
  // If priority is true, omit loading prop (let it be eager by default)
  const finalLoadingProp = priority ? undefined : loading;

  // Simple deterministic gradient based on alt text to avoid blank areas
  const gradientClass = useMemo(() => {
    const palettes = [
      "from-gray-200 to-gray-300",
      "from-gray-300 to-gray-200",
      "from-gray-200 to-gray-400",
      "from-gray-300 to-gray-400",
    ];
    const key = (alt || "").split("").reduce((a, c) => (a + c.charCodeAt(0)) % palettes.length, 0);
    return palettes[key] || palettes[0];
  }, [alt]);

  const commonProps = {
    src,
    alt,
    sizes,
    priority,
    unoptimized: finalUnoptimized,
    className,
    style,
    ...rest,
  };

  // If there's an error or missing src, render a graceful fallback to avoid blanks
  if (errored || !src) {
    if (useFill) {
      return (
        <div className={`absolute inset-0 ${className}`} style={{ position: "absolute", inset: 0 }}>
          <div className={`w-full h-full bg-gradient-to-br ${gradientClass}`} />
        </div>
      );
    }
    return (
      <div className={className} style={{ width, height }}>
        <div className={`w-full h-full bg-gradient-to-br ${gradientClass}`} />
      </div>
    );
  }

  if (useFill) {
    return <Image fill loading={finalLoadingProp} onError={() => setErrored(true)} {...commonProps} />;
  }

  // fallback to intrinsic if dimensions provided
  return <Image width={width} height={height} loading={finalLoadingProp} onError={() => setErrored(true)} {...commonProps} />;
}
