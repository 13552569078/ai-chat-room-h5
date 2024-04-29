module.exports = {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 37.5, // 基准比例，这里表示1rem=37.5px
      propList: ['*'] // 需要转换的属性，这里选择全部都进行转换
    }
  }
}
