<template>
  <div id="map">
    <!-- 侧边栏菜单 -->
    <AsideMenu @handleMenuClick="handleMenuClick" />
    <!-- 地图覆盖层 -->
    <OverlayComponent :currentSpot="currentSpot" />
    <!-- 景点详情popup -->
    <PopUpComponent :currentSpot="currentSpot" />
  </div>
</template>

<script>
import MapInit from '@/components/MapInit'; 
export default  MapInit
</script>

<style lang="scss" scoped>
#map {
  height: 100vh;
  width: 100vw;
  position: relative;
  background: #80a558;
  /*隐藏ol的一些自带元素*/
  /deep/.ol-control {
    display: none;
  }
}
</style>
