<template>
  <div class="chating-wrap">
    <div class="chating-loading"></div>
  </div>
</template>
<style lang="scss" scoped>
.chating-wrap {
  height: 50px;
  background-color: #ffffff;
  background: #ffffff;
  border-radius: 0px 6px 6px 6px;
  width: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;

  .chating-loading {
    margin-left: 10px;
    background: url("@/assets/images/ai/load.png") no-repeat;
    background-size: contain;
    height: 40px;
    width: 100%;
  }
}
</style>
