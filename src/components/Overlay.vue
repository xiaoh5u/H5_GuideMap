<template>
  <!-- 弹出框 -->
  <div class="popup-content-wrapper" id="wrapper">
    <div class="popup-content">
      <img class="coverImg" :src="currentSpot.ImageUrl" alt="" />
      <p>{{ currentSpot.ScenicSpotName }}</p>
      <ul class="infoWindowBtns">
        <li v-show="currentSpot.ScenicSpotId" @click="open">
          <img :src="require(`@/assets/h5/play.png`)" alt="" />
          <p>解说</p>
        </li>
        <li @click="location">
          <img :src="require(`@/assets/h5/location.png`)" alt="" />
          <p>导航</p>
        </li>
      </ul>
    </div>
    <div class="arrow"></div>
    <a class="popup-close-button" href="javascript:void(0)">×</a>
  </div>
</template>

<script>
import axios from 'axios';
import { Toast } from 'vant';
import wx from 'weixin-jsapi';
import { getCurrentInstance } from 'vue';
export default {
  props: {
    currentSpot: {
      type: Object,
    },
  },
  setup(props) {
    const { proxy } = getCurrentInstance();
    //小程序导航
    const location = () => {
      let toast = Toast.loading({
        message: '导航加载中...',
        forbidClick: true,
        loadingType: 'spinner',
      });

      axios.get(`https://www.cjssy.cn:20013/api/Wechat/GetWxConfigInfo?url=${location.href}`).then(res => {
        const data = JSON.parse(res.data.Data);
        wx.config({
          debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: data.appid, // 必填，公众号的唯一标识
          timestamp: data.timestamp, // 必填，生成签名的时间戳
          nonceStr: data.noncestr, // 必填，生成签名的随机串
          signature: data.signature, // 必填，签名
          jsApiList: ['openLocation', 'getLocation'], // 必填，需要使用的JS接口列表 这里填写需要用到的微信api openlocation为使用微信内置地图查看位置接口
        });
        wx.ready(function(e) {
          wx.openLocation({
            longitude: props.currentSpot.Longitude, // 经度，浮点数，范围为180 ~ -180。
            latitude: props.currentSpot.Latitude, // 纬度，浮点数，范围为90 ~ -90
            scale: 20,
            name: '目标位置', // 位置名
            success: function(res) {
              toast.clear();
            },
          });
        });
      });
    };

    const open = () => {
      proxy.$bus.emit('isPop', true);
    };

    return { location, open };
  },
};
</script>

<style lang="scss" scoped>
.popup-content-wrapper {
  padding: 15px;
  background: white;
  color: #333;
  box-shadow: 0 3px 14px rgba(0, 0, 0, 0.4);
  position: absolute; 

  .popup-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 6px;
    width: 160px;
    .coverImg {
      display: inline;
      text-align: center;
      object-fit: cover;
      width: 100%;
    }
    & > p {
      margin-top: 3px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .infoWindowBtns {
      display: flex;
      justify-content: space-around;
      li {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-right: 10px;
        img {
          width: 40px;
          height: 40px;
        }
      }
    }
  }
  .arrow {
    position: absolute;
    bottom: -20px;
    width: 0;
    height: 0;
    border: 10px solid transparent;
    border-top-color: #fff;
    left: 50%;
    transform: translateX(-50%);
  }
  .popup-close-button {
    position: absolute;
    top: 0;
    right: 0;
    padding: 4px 4px 0 0;
    border: none;
    text-align: center;
    width: 18px;
    height: 14px;
    font: 16px/14px Tahoma, Verdana, sans-serif;
    color: #2d8cf0;
    text-decoration: none;
    font-weight: bold;
    background: transparent;
    cursor: pointer;
  }
}
</style>
