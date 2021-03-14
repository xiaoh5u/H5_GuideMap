<template>
  <!-- 景点详情 -->
  <van-popup v-model:show="show" round position="bottom" :style="{ height: '50%' }" @close="closePopup" safe-area-inset-bottom>
    <div class="container">
      <div class="info">
        <div class="left">
          <img class="cover" :src="currentSpot.ImageUrl" alt="" />
        </div>
        <div class="right">
          <h2>{{ currentSpot.ChineseName }}</h2>
          <div class="playerBox">
            <AudioPlayer v-if="show" :audioSrc="currentSpot.AudioAddress" ref="player" />
          </div>
        </div>
      </div>

      <div class="content">
        <div :class="{ intro: true, exceed: contentLength > 160 && !showAllText }">
          {{ currentSpot.Introduction }}
          <div class="notice-btns" v-if="contentLength > 160 && !showAllText">
            <span @click="showAllText = true">全部</span>
          </div>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script>
import { ref, getCurrentInstance, computed } from 'vue';
import AudioPlayer from './AudioPlayer';
export default {
  components: { AudioPlayer },
  props: {
    currentSpot: {
      type: Object,
    },
  },
  setup(props) {
    const { proxy } = getCurrentInstance();
    const show = ref(false);
    const showAllText = ref(false);
    const player = ref(null);
    //监听兄弟组件的传值
    proxy.$bus.on('isPop', isShow => {
      console.log(isShow);
      show.value = isShow;
    });

    //popup关闭事件
    const closePopup = () => {
      player.value.handlePause(); //关闭音频
      showAllText.value = false;
    };
    //计算内容长度
    const contentLength = computed(() => {
      if (!props.currentSpot.Introduction) return 0;
      return props.currentSpot.Introduction.length;
    });

    return { show, showAllText, closePopup, contentLength, player };
  },
};
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  height: 100%;
  padding: 18px;
  padding-bottom: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  color: #333;
  .info {
    display: flex;
    justify-content: space-between;
    width: 100%;
    .left {
      width: 175px;
      .cover {
        height: 110px;
        width: 175px;
        border-radius: 10px;
        object-fit: cover;
      }
    }

    .right {
      width: calc(100% - 175px);
      padding-left: 10px;
      h2 {
        font-size: 18px;
        font-weight: 600;
      }
      .playerBox {
        margin-top: 5px;
      }
    }
  }
  .content {
    margin-top: 10px;
    font-size: 16px;
    line-height: 24px;
    flex: 1;
    overflow: auto;
    .intro {
      color: #626262;
      overflow: hidden;
      position: relative;
      text-indent: 24px;
      text-align: left;

      &.exceed {
        word-break: break-all;
        text-overflow: ellipsis;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 5;
        -webkit-box-orient: vertical;
      }
    }
    .notice-btns {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 30%;
      color: #ff2442;
      background-image: linear-gradient(to right, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 1) 10%);
      cursor: pointer;
      text-align: left;
      text-indent: 32px;
      &::before {
        content: '...';
        color: black;
        width: 10px;
        position: absolute;
        bottom: 0;
        left: 19px;
        text-indent: 0;
      }
    }
  }
}
</style>
