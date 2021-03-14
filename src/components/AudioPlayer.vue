<template>
  <div>
    <div class="audio">
      <div class="audio_btn">
        <!-- 播放按钮-->
        <img src="https://s3.ax1x.com/2021/01/26/sX7kPe.png" v-if="!isPlay" @click="handlePlay" />
        <!-- 加载中-->
        <img src="https://ae01.alicdn.com/kf/Ubbb6dbe2c11a491b9f62bb96e30a64b8X.jpg" v-if="isPlay && loading" class="loading" />
        <!-- 暂停按钮-->
        <img src="https://s3.ax1x.com/2021/01/26/sX7A8H.png" v-if="isPlay && !loading" @click="handlePause" />
      </div>
      <div class="audio_pro">
        <van-slider
          class="drag"
          :step="1"
          v-model="curTimeVal"
          :max="duration"
          buttonSize="15px"
          inactiveColor="#efefef"
          activeColor="#90BED5"
          @change="hanle_slider_change"
          @drag-start="dragStart"
        />
      </div>
      <span class="audio_text">{{ formatedPlayTime }}</span>
    </div>
  </div>
</template>

<script>
import { ref, toRefs, reactive } from 'vue';
import { onMounted } from 'vue';
export default {
  props: {
    audioSrc: {
      type: String,
      require: true,
    },
  },
  setup(props) {
    const data = reactive({
      formatedPlayTime: '00:00',
      isPlay: false,
      curTimeVal: 0,
      duration: 100,
      loading: true,
      Audio: new Audio(),
    });
    const isDrag = ref(false);

    //播放音频
    const handlePlay = () => {
      data.Audio.play();
      data.isPlay = true;
      data.loading = true;
    };
    //暂停播放
    const handlePause = () => {
      data.Audio.pause();
      data.isPlay = false;
      data.loading = true;
    };
    //加载并播放
    const loadAudio = () => {
      data.Audio.load();
      const musicUrl = encodeURI(props.audioSrc); //音频url
      data.Audio.src = musicUrl;
      data.Audio.loop = false;

      handlePlay();
      setTimeout(() => {
        data.Audio.addEventListener(
          'timeupdate',
          function() {
            //监听音频播放的实时时间事件
            if (data.isPlay) {
              data.loading = false;
            }
            data.duration = data.Audio.duration.toFixed(2) * 100;

            if (!isDrag.value) {
              //防止拖动时抢鼠标
              data.curTimeVal = data.Audio.currentTime.toFixed(2) * 100;
            }

            data.formatedPlayTime = formatTime(data.Audio.currentTime);
          },
          false
        );

        data.Audio.addEventListener(
          'ended',
          function() {
            data.isPlay = false;
            data.loading = true;
            data.formatedPlayTime = '00:00';
            data.currentTime = 0;
          },
          false
        );
      }, 500);
    };
    // 拖动进度条，到指定位置
    const hanle_slider_change = value => {
      console.log(value);
      data.curTimeVal = value;
      data.formatedPlayTime = formatTime(value / 100);
      data.Audio.currentTime = value / 100;
      isDrag.value = false;
    };
    //在拖动状态
    const dragStart = () => {
      isDrag.value = true;
    };

    const formatTime = time => {
      time = Math.floor(time);
      var m = Math.floor(time / 60).toString();
      m = m.length < 2 ? '0' + m : m;
      var s = (time - parseInt(m) * 60).toString();
      s = s.length < 2 ? '0' + s : s;
      return m + ':' + s;
    };

    onMounted(() => {
      loadAudio();
    });
    return {
      ...toRefs(data),
      handlePlay,
      handlePause,
      hanle_slider_change,
      dragStart,
    };
  },
};
</script>

<style lang="scss" scoped>
/* 传语音 */
.audio {
  display: flex;
  align-items: center;
  position: relative;
  height: 40px;
  line-height: 40px;
  background: #f7f7f7;
  width: 100%;
  background: rgba(255, 255, 255, 0.8);
}
.audio_img {
  position: absolute;
  top: -15px;
  right: -15px;
  width: 30px;
  height: 30px;
}
.audio_btn {
  width: 44px;
  height: 22px;
  display: flex;
  img {
    width: 100%;
    height: 100%;
  }
}
.audio_pro {
  width: 205px;
  margin: 0 10px;
}
.audio_text {
  font-weight: bold;
  color: #000;
  font-size: 10pt;
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.loading {
  animation: spin 1s linear infinite;
}
</style>
