<template>
  <div class="flex flex-col gap-1">
    <div class="flex flex-col gap-1">
      <div class="flex items-center gap-2" v-if="label || required">
        <label for="" class="text-white text-sm">
          {{ label }}
        </label>
        <span v-if="required" class="text-red-600 text-xs font-semibold">
          *
        </span>
      </div>
      <div class="flex items-center gap-2">
        <input
          type="number"
          :placeholder="placeholder"
          :class="{
            isDisabled: disabled,
            isReadonly: readonly,
            isError: errors?.length,
          }"
          :value="modelValue"
          @input="handleInputValue"
        />
        <button
          class="text-white text-sm"
          @click="() => emits('update:modelValue', '')"
          v-if="modelValue && withCleanBtn && !disabled"
        >
          <i class="fi fi-br-cross flex items-center justify-center"></i>
        </button>
      </div>
    </div>
    <span class="text-red-600 text-xs font-semibold" v-if="errors?.length">
      {{ errors[0] }}
    </span>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  modelValue: number;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  withCleanBtn?: boolean;
  errors?: string[];
}>();

const emits = defineEmits<{
  (e: "update:modelValue", val: number | null): void;
}>();

const handleInputValue = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const value = target.value ? parseFloat(target.value) : null;
  emits("update:modelValue", value);
};
</script>

<style lang="scss" scoped>
input {
  @apply h-11 px-3 py-1.5 rounded-lg bg-[#1C1A20] border border-transparent text-white text-sm w-full;
  @apply placeholder:text-white/50;
  @apply focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent;
  @apply disabled:bg-[#1C1A20] disabled:cursor-not-allowed opacity-75;
}
</style>
