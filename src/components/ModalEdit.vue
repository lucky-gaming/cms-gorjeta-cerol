<template>
  <div
    class="fixed bg-black/50 inset-0 flex items-center justify-center z-[999]"
  >
    <div class="flex flex-col bg-gray-600 rounded-lg w-full max-w-[600px]">
      <div class="flex items-center justify-between px-4 py-4">
        <span class="text-white text-lg font-bold"> Editar Item </span>
        <button class="text-white text-sm" @click="handleClose">
          <i class="fi fi-br-cross flex items-center justify-center"></i>
        </button>
      </div>
      <div class="flex flex-col p-4 py-6 w-full">
        <InputsNumber
          v-model:model-value="form.tipValue"
          :label="'Valor'"
          :placeholder="'Valor'"
          required
          :disabled="editing"
          class="w-full"
        />
      </div>
      <div class="flex items-center justify-end px-4 py-4 gap-4">
        <button
          class="text-white text-sm h-11 rounded-lg px-4 text-center border border-white font-semibold"
          @click="handleClose"
        >
          Fechar
        </button>
        <button
          class="text-secondary text-sm h-11 rounded-lg px-4 text-center border border-primary bg-primary font-semibold"
          @click="handleSubmit"
        >
          {{ editing ? "Atualizando..." : "Atualizar" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { doc, updateDoc } from "firebase/firestore";
import lodash from "lodash";
const { cloneDeep } = lodash;

const props = defineProps<{
  item: any;
}>();
const emits = defineEmits<{
  (e: "close"): void;
  (e: "refresh"): void;
}>();

const form = ref();
const editing = ref(false);
const { $firebase } = useNuxtApp();

const handleClose = () => {
  if (editing.value) {
    editing.value = false;
  }
  emits("close");
};

const handleSubmit = async () => {
  try {
    editing.value = true;
    await updateDoc(doc($firebase.db, "tips", form.value.id), {
      tipValue: form.value.tipValue,
    });
    emits("refresh");
  } catch (error) {
    console.error("Error updating item:", error);
  } finally {
    editing.value = false;
  }
};

onBeforeMount(() => {
  form.value = cloneDeep(props.item);
  console.log("Form data:", form.value);
});
</script>
