<template>
  <div class="flex items-center justify-center">
    <div class="flex flex-col gap-6 items-center justify-center">
      <span class="loader"></span>
      <span
        class="font-medium text-white"
        :class="{
          typeWriter: !props.hideTypeAnimation,
        }"
        v-if="props.message?.length"
      >
        {{ props.message }}
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  message?: string;
  hideTypeAnimation?: boolean;
}>();
</script>

<style scoped>
.loader {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: inline-block;
  border-top: 4px solid #0f1923;
  border-right: 4px solid transparent;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}
.loader::after {
  content: "";
  box-sizing: border-box;
  position: absolute;
  left: 0;
  top: 0;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border-left: 4px solid #ff7700;
  border-bottom: 4px solid transparent;
  animation: rotation 0.5s linear infinite reverse;
}
@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.typeWriter {
  overflow: hidden; /* Ensures the content is not revealed until the animation */
  border-right: 0.15em solid #ff7700; /* The typwriter cursor */
  white-space: nowrap; /* Keeps the content on a single line */
  margin: 0 auto; /* Gives that scrolling effect as the typing happens */
  letter-spacing: 0.15em; /* Adjust as needed */
  animation: typing 2.5s steps(40, end) infinite alternate-reverse,
    blink-caret 0.75s step-end infinite;
}

@keyframes typing {
  from {
    width: 0;
  }
  to {
    width: 105%;
  }
}

/* The typewriter cursor effect */
@keyframes blink-caret {
  from,
  to {
    border-color: transparent;
  }
  50% {
    border-color: #ff7700;
  }
}
</style>
