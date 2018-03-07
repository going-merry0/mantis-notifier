import * as path from "path";
import * as webpack from "webpack";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import * as CleanWebpackPlugin from "clean-webpack-plugin";
import * as ExtractTextPlugin from "extract-text-webpack-plugin";

module.exports = {
  entry: ["./src/background/index.ts"],
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "../dist/background")
  },

  devtool: "source-map",

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },

  module: {
    rules: [
      {
        test: /\.scss$/,
        loaders: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      },
      {
        test: [/\.html/, /\.png$/],
        loader: "file-loader?name=[name].[ext]"
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loaders: [
          {
            loader: "babel-loader",
            options: {
              babelrc: false,
              plugins: [
                [
                  "import",
                  {
                    libraryName: "antd",
                    style: "css"
                  }
                ]
              ]
            }
          },
          "awesome-typescript-loader"
        ]
      },
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(["dist/background"], {
      root: path.resolve(__dirname, ".."),
      verbose: true
    }),
    // new HtmlWebpackPlugin({
    //   chunksSortMode: "dependency",
    //   template: "index.html"
    // }),
    new ExtractTextPlugin("styles.css")
  ]
};
