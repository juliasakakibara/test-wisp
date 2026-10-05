import localFont from "next/font/local";

/** Hero-only pixel display — apply .className on hero text nodes */
export const heroPixelFont = localFont({
  src: "./DefaultLingoPixel.otf",
  display: "swap",
  weight: "400",
});
