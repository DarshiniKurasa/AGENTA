import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
};

const exported = {
  ...nextConfig,
  turbopack: {
    // Ensure Turbopack uses this project directory as the workspace root
    root: path.resolve(__dirname),
  },
};

export default exported;
