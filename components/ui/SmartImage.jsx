import Image from "next/image";

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
  const allowedDomains = ["images.unsplash.com"]; // keep in sync with next.config.js
  let finalUnoptimized = unoptimized;

  try {
    if (typeof src === "string" && src.startsWith("http")) {
      const { hostname } = new URL(src);
      if (!allowedDomains.includes(hostname)) {
        finalUnoptimized = true;
      }
    }
  } catch (_) {
    // ignore URL parse errors, keep provided unoptimized value
  }
  // If explicit width/height is provided, don't use fill
  const useFill = fill && !(width && height);

  const commonProps = {
    src,
    alt,
    sizes,
    priority,
    loading,
    unoptimized: finalUnoptimized,
    className,
    style,
    ...rest,
  };

  if (useFill) {
    return <Image fill {...commonProps} />;
  }

  // fallback to intrinsic if dimensions provided
  return <Image width={width} height={height} {...commonProps} />;
}
