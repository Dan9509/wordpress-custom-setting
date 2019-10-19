const scriptType = process.env.STACK_SCRIPT_TYPE;

const project = process.env.PROJECT;
module.exports = {
  devtool: 'source-map',
  // entry 입력파일 경로
  entry: {
    main: ['@babel/polyfill',`../${project}-code/${scriptType === 'javascript' ? 'Javascript/index.js' : 'Typescript/index.ts'}`]
  },
  // output 출력 디렉토리와 파일이름
  output: {
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: [
            '@babel/preset-env'
          ],
        },
      },
    ],
  },
  // plugins: [
  //
  // ]
};