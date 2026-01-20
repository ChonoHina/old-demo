const withMDX = require("@next/mdx")({
    extension: /\.mdx?$/,
    options: {
        jsx: true,
    },
});

const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true",
});

const basePath = process.env.BASE_PATH ?? "";

const withPwa = require("@yume-chan/next-pwa")({
    dest: "public",
});

function pipe(value, ...callbacks) {
    for (const callback of callbacks) {
        value = callback(value);
    }
    return value;
}

module.exports = pipe(
    /** @type {import('next').NextConfig} */ ({
        // 👇 1. 之前加的忽略规则（保持不变）
        eslint: {
            ignoreDuringBuilds: true,
        },
        typescript: {
            ignoreBuildErrors: true,
        },

        // 👇 2. ⚠️ 这次新增的关键配置：告诉 Vercel 编译这些关联包 ⚠️
        transpilePackages: [
            "@yume-chan/adb",
            "@yume-chan/adb-credential-web",
            "@yume-chan/adb-daemon-direct-sockets",
            "@yume-chan/adb-daemon-webusb",
            "@yume-chan/adb-daemon-ws",
            "@yume-chan/adb-scrcpy",
            "@yume-chan/android-bin",
            "@yume-chan/aoa",
            "@yume-chan/b-tree",
            "@yume-chan/event",
            "@yume-chan/fetch-scrcpy-server",
            "@yume-chan/pcm-player",
            "@yume-chan/scrcpy",
            "@yume-chan/scrcpy-decoder-tinyh264",
            "@yume-chan/scrcpy-decoder-webcodecs",
            "@yume-chan/stream-extra",
            "@yume-chan/struct",
            "@yume-chan/tabby-launcher",
            "@yume-chan/undici-browser",
        ],

        basePath,
        pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
        reactStrictMode: false,
        productionBrowserSourceMaps: true,
        experimental: {
            esmExternals: "loose",
        },
        publicRuntimeConfig: {
            basePath,
        },
        webpack(config) {
            config.module.rules.push({
                test: /.*\.m?js$/,
                exclude: [/next/],
                use: ["source-map-loader"],
                enforce: "pre",
            });
            return config;
        },
        async headers() {
            return [
                {
                    source: "/:path*",
                    headers: [
                        {
                            key: "Cross-Origin-Opener-Policy",
                            value: "same-origin",
                        },
                        {
                            key: "Cross-Origin-Embedder-Policy",
                            value: "credentialless",
                        },
                    ],
                },
            ];
        },
        poweredByHeader: false,
    }),
    withBundleAnalyzer,
    withPwa,
    withMDX
);
