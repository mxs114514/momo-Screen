<script setup lang="ts">
import BorderBox13 from "@/components/datav/border-box-13";
const props = withDefaults(
  defineProps<{
    // 标题
    title: number | string;
    // 是否允许点击放大
    enableZoom?: boolean;
  }>(),
  {
    title: "",
    enableZoom: true,
  }
);

const emit = defineEmits<{
  (e: 'zoom'): void;
}>()

const handleTitleClick = () => {
  if (props.enableZoom && props.title !== '') {
    emit('zoom');
  }
};
</script>

<template>
  <BorderBox13 backgroundColor="rgba(13, 40, 80, 0.5)">
    <div class="item_title" v-if="title !== ''" :class="{ 'clickable': enableZoom }" @click="handleTitleClick">
      <div class="zuo"></div>
      <span class="title-inner"> &nbsp;&nbsp;{{ title }}&nbsp;&nbsp; </span>
      <div class="you"></div>
    </div>
    <div
      :class="title !== '' ? 'item_title_content' : 'item_title_content_def'"
    >
      <slot></slot></div
  ></BorderBox13>
</template>

<style scoped lang="scss">
$item-title-height: 38px;
$item_title_content-height: calc(100% - 38px);

.item_title {
  height: $item-title-height;
  line-height: $item-title-height;
  width: 100%;
  color: #ff9a44;
  text-align: center;
  background: linear-gradient(to right, transparent, rgba(255, 107, 0, 0.15), transparent);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 8px;
  transition: all 0.3s ease;

  &.clickable {
    cursor: pointer;
    
    &:hover {
      transform: translateY(-2px);
      
      .title-inner {
        background: linear-gradient(
          92deg,
          #ff8c00 0%,
          #ffd700 100%
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
  }

  .zuo,
  .you {
    width: 58px;
    height: 14px;
    background-image: url("@/assets/img/titles/zuo.png");
    filter: hue-rotate(160deg) brightness(1.6) saturate(1.5);
  }

  .you {
    transform: rotate(180deg);
  }
  .title-inner {
    font-weight: 900;
    letter-spacing: 2px;
    font-size: 18px;
    background: linear-gradient(
      92deg,
      #ff6b00 0%,
      #ffb000 100%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    transition: all 0.3s ease;
  }
}

:deep(.dv-border-box-content)  {
    box-sizing: border-box;
    padding: 6px 16px 0px;
  }

.item_title_content {
  height: $item_title_content-height;
}

.item_title_content_def {
  width: 100%;
  height: 100%;
}
</style>
