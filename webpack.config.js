const path = require("path");
const fs = require("fs");

module.exports = (env, argv) => {
    const isProd = argv.mode === "production";

    return {
        entry: "./src/app.js",

        output: {
            path: path.resolve(__dirname, "dist"),
            filename: "bundle.js",
            clean: true,
        },

        mode: isProd ? "production" : "development",

        optimization: {
            splitChunks: false,
            runtimeChunk: false,
            minimize: isProd,
        },


        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: ["style-loader", "css-loader"],
                },
            ],
        },

        plugins: [
            {
                apply: (compiler) => {
                    compiler.hooks.afterEmit.tap("CopyHTMLPlugin", () => {
                        const src = path.resolve(__dirname, "public", "index.html");
                        const dest = path.resolve(__dirname, "dist", "index.html");
                        fs.copyFileSync(src, dest);
                    });
                },
            },
        ],

        devtool: isProd ? false : "eval-source-map",
        performance: { hints: false },
    };
};