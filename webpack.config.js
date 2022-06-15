module.exports = {
  module: {
    rules: [
      {
        test: /\.less$/i,
        use: [
          // compiles Less to CSS
          "style-loader",
          "css-loader",
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                modifyVars: { '@primary-color': '#D5001C' },
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
    ],
  },
};