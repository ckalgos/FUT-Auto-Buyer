import path from "path";
import { Configuration, BannerPlugin } from "webpack";
import TerserPlugin from "terser-webpack-plugin";
import { generateHeader } from "./plugins/userscript.plugin";
import "webpack-dev-server";

const config: Configuration = {
  mode: "none",
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "userscript"),
    filename: "index.user.js",
  },
  devServer: { static: "./userscript/" },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  externals: {
    axios: "axios",
  },
  optimization: {
    minimize: false,
    minimizer: [new TerserPlugin()],
  },
  plugins: [
    new BannerPlugin({
      banner: generateHeader,
      raw: true,
    }),
  ],
};

export default config;
