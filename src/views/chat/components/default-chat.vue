<template>
  <div class="default-chat-wrap">
    <div class="logo"></div>
    <div class="top-con">您好，数智网格员为您服务！</div>
  </div>
</template>

<script setup lang="ts">
</script>
<style lang="scss" scoped>
.default-chat-wrap {
  margin-top: 30px;
  margin-bottom: 20px;
  width: 283px;
  position: relative;
  height: 40px;
  background-color: #ffffff;
  border-radius: 8px;
  font-size: 14px;
  color: #404040;
  font-weight: bold;
  display: flex;
  align-items: center;
  text-align: right;

  .logo {
    position: absolute;
    width: 54px;
    height: 66px;
    background: url("@/assets/images/ai/logo.png") no-repeat;
    background-size: contain;
    top: -30px;
  }

  .top-con {
    width: 100%;
    text-align: right;
    padding-right: 28px;
  }
}
</style>
