<template>
  <ul class="btns">
    <li v-for="item in menuList" :key="item.id" :class="{ active: activeDevice == item.id }" @click="handleBtnClick(item.id)">
      <img :src="require(`@/assets/menu/${item.name}.png`)" alt="" />
      <span>{{ item.name }}</span>
    </li>
  </ul>
</template>

<script>
import { reactive, toRefs, ref, onMounted } from 'vue';
export default {
  setup(props, context) {
    const data = reactive({
      menuList: [
        {
          id: 1,
          name: '景点',
        },
        {
          id: 2,
          name: '游客中心',
        },
        {
          id: 3,
          name: '厕所',
        },
        {
          id: 4,
          name: '停车场',
        },
        {
          id: 5,
          name: '出入口',
        },
      ],
    });
    const activeDevice = ref(1);

    //菜单点击事件
    const handleBtnClick = id => {
      activeDevice.value = id;
      context.emit('handleMenuClick', id);
    };

    return { ...toRefs(data), handleBtnClick, activeDevice };
  },
};
</script>

<style lang="scss" scoped>
.btns {
  position: absolute;
  right: 2%;
  z-index: 999;
  top: 50%;
  transform: translateY(-50%);
  margin: auto;
  overflow: auto;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 25px;
  padding: 6px 0;
  li {
    width: 50px;
    height: 50px;
    margin-bottom: 8px;
    background: url('../assets/menu/非选中.png') no-repeat;
    background-size: 40px;
    background-position: top;
    position: relative;
    cursor: pointer;
    user-select: none;
    display: flex;
    justify-content: flex-end;
    flex-direction: column;
    align-items: center;
    color: #333;
    font-size: 12px;
    &:last-child {
      margin-bottom: 0px;
    }
    img {
      position: absolute;
      left: 0;
      right: 0;
      top: -10px;
      bottom: 0;
      margin: auto;
      width: 30%;
    }
  }
  .active {
    background: url('../assets/menu/选中.png') no-repeat;
    background-size: 40px;
    background-position: top;
  }
}
</style>
