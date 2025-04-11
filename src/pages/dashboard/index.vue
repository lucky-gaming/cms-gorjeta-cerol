<template>
  <div
    class="flex flex-col items-center justify-center w-full h-screen relative"
  >
    <div
      class="fixed inset-0 w-[180%] h-[180%] customBg z-[0] -rotate-12 -translate-y-[25%] -translate-x-[25%]"
    ></div>
    <div
      class="relative z-10 w-full max-w-[1280px] bg-[#883e2a] rounded-lg h-full max-h-[600px] shadow-xl shadow-secondary flex flex-col gap-4"
    >
      <div
        class="w-full px-8 py-4 flex items-center justify-between border-b border-secondary"
      >
        <span class="text-white text-2xl font-bold"> Gorjetas </span>
        <button
          class="bg-primary text-secondary px-2 py-1 rounded flex items-center justify-center gap-2 font-semibold h-[36px]"
          @click="loadData"
          :disabled="loading"
          :class="{
            'cursor-not-allowed opacity-80': loading,
          }"
        >
          <i class="fi fi-rr-refresh flex items-center justify-center"></i>
          Atualizar
        </button>
      </div>
      <div class="py-20" v-if="loading">
        <Loader message="Carregando..." :hideTypeAnimation="true" />
      </div>
      <div class="flex flex-col w-full h-full overflow-y-scroll" v-else>
        <div
          class="grid grid-cols-4 py-3 px-4 text-white hover:bg-secondary transition-all duration-200 ease-in-out"
          v-for="(item, index) in data"
          :key="index"
        >
          <div class="col-span h-full flex items-center justify-center">
            {{ item.email }}
          </div>
          <div class="col-span h-full flex items-center justify-center">
            {{ item.tipValue }}
          </div>
          <div class="col-span h-full flex items-center justify-center">
            {{ formatISODate(item.created_at) }}
          </div>
          <div class="col-span h-full flex items-center justify-center">
            <span v-if="item.done" class="flex items-center gap-2"
              ><i
                class="fi fi-ss-check-circle flex items-center justify-center text-white"
              ></i>
              Feito
            </span>
            <button
              v-else
              @click="markItemAsDone(item)"
              class="bg-primary text-secondary px-2 py-1 rounded"
            >
              Marcar como feito
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { formatDate } from "date-fns";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
const loading = ref(true);
const data = ref([]);
const error = ref(false);
const { $firebase } = useNuxtApp();

const formatISODate = (date: string) => {
  //2025-04-11T11:42:12.277Z
  const dateObj = new Date(date);
  return formatDate(dateObj, "dd/MM/yyyy HH:mm:ss", {});
};

const loadData = async () => {
  loading.value = true;
  try {
    const res = await getDocs(collection($firebase.db, "tips"));
    data.value = res.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .sort((a, b) => {
        if (a.done && !b.done) return 1;
        if (!a.done && b.done) return -1;
        return 0;
      });
    console.log(data.value);
  } catch (err) {
    error.value = true;
  } finally {
    loading.value = false;
  }
};

const markItemAsDone = async (item: any) => {
  try {
    item.done = true;
    await updateDoc(doc($firebase.db, "tips", item.id), {
      done: true,
    });
    // loadData();
  } catch (err) {
    console.error(err);
    item.done = false;
  }
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.customBg {
  background-image: url("~/assets/imgs/logo.svg");
  background-repeat: repeat;
  background-size: 100px 80px;
  animation: fade 5s infinite alternate-reverse;
}

.sliver {
  animation: sliver 1s alternate forwards;
}

@keyframes fade {
  0% {
    opacity: 0.1;
  }
  100% {
    opacity: 0.25;
  }
}

@keyframes sliver {
  0% {
    left: 30%;
  }
  100% {
    left: 120%;
  }
}
</style>
