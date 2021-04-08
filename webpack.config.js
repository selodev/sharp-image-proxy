const path = require("path");
module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  target: "node",
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [{ test: /\.ts?$/, loader: "ts-loader" }],
  },
  externals: {
    sharp: "commonjs sharp",
  },
};
