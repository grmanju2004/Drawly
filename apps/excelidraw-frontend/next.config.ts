import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactCompiler: false,
    // Simply set it to false to completely disable the indicator
    devIndicators: false, 
};

export default nextConfig;