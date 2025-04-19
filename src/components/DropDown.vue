<template>
  <div
    class="relative"
    ref="dropdownCollapsed"
    :class="{
      'border border-white/80 rounded-lg p-0.5': withBorder,
    }"
  >
    <button
      class="flex items-center justify-center h-8 w-8"
      @click="showList = !showList"
      :id="id"
    >
      <i
        class="fi fi-sr-menu-dots-vertical h-full flex items-center justify-center text-white"
      ></i>
    </button>
    <div
      v-if="showList"
      class="flex flex-col border border-gray-300 rounded-lg min-w-[130px] bg-white absolute right-0 z-[20] overflow-hidden"
      :class="{
        'bottom-10': !hasSpace,
        'top-10': hasSpace,
      }"
    >
      <div class="flex flex-col w-full h-full max-h-[200px] overflow-y-auto">
        <button
          class="flex items-center gap-2 w-full px-4 py-2 bg-white hover:brightness-95"
          v-for="item in items"
          @click="handleAction(item)"
          :id="`${id}-${item.value}`"
        >
          <i
            v-if="item.icon"
            :class="[
              item.icon,
              'flex items-center justify-center h-4 text-black',
            ]"
          ></i>
          <span class="text-start whitespace-nowrap text-black">
            {{ item.label }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onClickOutside, useMagicKeys } from "@vueuse/core";

const emits = defineEmits<{
  (
    e: "handleAction",
    val: {
      label: string;
      value: string;
      icon?: string;
    }
  ): void;
}>();

const props = defineProps<{
  items: { label: string; value: string; icon?: string }[];
  id?: string;
  withBorder?: boolean;
}>();

const showList = ref(false);
const dropdownCollapsed = ref<HTMLElement | null>(null);
const { escape } = useMagicKeys();

const hasSpace = computed(() => {
  if (dropdownCollapsed.value) {
    const { top, bottom } = dropdownCollapsed.value.getBoundingClientRect();
    return window.innerHeight - bottom > 200;
  }
  return false;
});

watch(escape, () => (showList.value = false));

onClickOutside(dropdownCollapsed, () => {
  showList.value = false;
});

const handleAction = (item: {
  label: string;
  value: string;
  icon?: string;
}) => {
  emits("handleAction", item);
  showList.value = false;
};
</script>
