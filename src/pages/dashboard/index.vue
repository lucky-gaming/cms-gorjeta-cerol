<template>
  <div
    class="flex flex-col items-center justify-center w-full h-screen relative px-8 2xl:px-0"
  >
    <div
      class="fixed inset-0 w-[180%] h-[180%] customBg z-[0] -rotate-12 -translate-y-[25%] -translate-x-[25%]"
    ></div>
    <div
      class="relative z-10 w-full max-w-[1280px] bg-[#883e2a] rounded-lg h-full max-h-[650px] shadow-xl shadow-secondary flex flex-col gap-4"
    >
      <div
        class="w-full px-8 py-4 flex items-center justify-between border-b border-secondary"
      >
        <span class="text-white text-2xl font-bold"> Gorjetas </span>

        <div class="flex items-end gap-10">
          <div class="flex items-center gap-2">
            <InputsDate
              :withCleanBtn="true"
              v-model:modelValue="filters.startDate"
              :label="'Data Inicial'"
            />
            <InputsDate
              :withCleanBtn="true"
              v-model:modelValue="filters.endDate"
              :label="'Data Final'"
            />
            <InputsSelect
              :withCleanBtn="true"
              v-model:modelValue="filters.status"
              :options="options"
              placeholder="Status"
              :label="'Status'"
            />
          </div>
          <button
            class="bg-primary text-secondary px-2 py-1 rounded flex items-center justify-center gap-2 font-semibold h-[44px]"
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
      </div>
      <div class="py-20" v-if="loading">
        <Loader message="Carregando..." :hideTypeAnimation="true" />
      </div>
      <div class="flex flex-col w-full h-full overflow-y-scroll" v-else>
        <div
          class="grid grid-cols-12 py-3 px-4 text-white hover:bg-secondary transition-all duration-200 ease-in-out"
          v-for="(item, index) in data"
          :key="index"
        >
          <div class="col-span-5 h-full flex items-center justify-center">
            {{ item.email }}
          </div>
          <div class="col-span-2 h-full flex items-center justify-center">
            {{ formatCurrency(item.tipValue) }}
          </div>
          <div class="col-span-2 h-full flex items-center justify-center">
            {{ formatISODate(item.created_at) }}
          </div>
          <div class="col-span-2 h-full flex items-center justify-center">
            <span
              v-if="item.invalid"
              class="flex items-center gap-2 font-semibold"
            >
              <i
                class="fi fi-sr-light-emergency-on flex items-center justify-center text-white"
              ></i>
              Inválido
            </span>
            <span
              v-else-if="item.done"
              class="flex items-center gap-2 font-semibold"
            >
              <i
                class="fi fi-ss-check-circle flex items-center justify-center text-white"
              ></i>
              Feito
            </span>
            <span
              v-else-if="!item.done"
              class="bg-primary text-black rounded-lg p-2 flex items-center gap-2 font-semibold"
            >
              <i
                class="fi-ss-triangle-warning flex items-center justify-center"
              ></i>
              Não Feito
            </span>
          </div>
          <div class="col-span-1 h-full flex items-center justify-center">
            <DropDown
              :withBorder="true"
              :items="dropDownOptions"
              @handleAction="handleDropdownAction($event, item)"
            />
          </div>
        </div>
        <ModalEdit
          v-if="itemToEdit"
          :item="itemToEdit"
          @close="itemToEdit = null"
          @refresh="loadData"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { formatDate } from "date-fns";
import {
  Timestamp,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import lodash from "lodash";
const { cloneDeep } = lodash;
const loading = ref(true);
const data = ref([]);
const error = ref(false);
const { $firebase } = useNuxtApp();
const filters = ref({
  startDate: "",
  endDate: "",
  status: "",
});
const options = ref([
  { label: "Feito", value: "done" },
  { label: "Não Feito", value: "not done" },
  { label: "Inválido", value: "invalid" },
  { label: "Todos", value: "" },
]);

const dropDownOptions = ref([
  { label: "Feito", value: "done", icon: "fi fi-ss-check-circle" },
  { label: "Não Feito", value: "not done", icon: "fi fi-ss-triangle-warning" },
  { label: "Inválido", value: "invalid", icon: "fi fi-sr-light-emergency-on" },
  { label: "Editar", value: "edit", icon: "fi fi-br-edit" },
]);
const itemToEdit = ref(null);

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const formatISODate = (date: Timestamp) => {
  //2025-04-11T11:42:12.277Z
  const tsString = new Timestamp(date.seconds, date.nanoseconds).toDate();
  return formatDate(tsString, "dd/MM/yyyy HH:mm:ss", {});
};

const loadData = async () => {
  loading.value = true;
  console.log(filters.value);
  itemToEdit.value = null;
  error.value = false;
  data.value = [];
  try {
    const start = filters.value.startDate
      ? Timestamp.fromDate(
          new Date(`${filters.value.startDate}`.split("T")[0] + " 00:00:00")
        )
      : null;

    const end = filters.value.endDate
      ? Timestamp.fromDate(
          new Date(`${filters.value.endDate}`.split("T")[0] + " 23:59:59")
        )
      : null;

    const finalFilters = [];

    if (start) {
      finalFilters.push(where("created_at", ">=", start));
    }
    if (end) {
      finalFilters.push(where("created_at", "<=", end));
    }

    finalFilters.push(orderBy("created_at", "desc"));

    const q = query(collection($firebase.db, "tips"), ...finalFilters);
    const res = await getDocs(q);
    data.value = res.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((item) => {
        if (filters.value.status === "") return true;
        if (filters.value.status === "done") return item.done && !item.invalid;
        if (filters.value.status === "not done") return !item.done;
        if (filters.value.status === "invalid") return item.invalid;
        return true;
      })
      .sort((a, b) => {
        return a.done - b.done;
      })
      .sort((a, b) => {
        return b.created_at.seconds - a.created_at.seconds;
      });

    console.log(data.value);
  } catch (err) {
    error.value = true;
  } finally {
    loading.value = false;
  }
};

const handleDropdownAction = (
  action: {
    label: string;
    value: string;
    icon?: string;
  },
  item: any
) => {
  const bckItem = cloneDeep(item);
  switch (action.value) {
    case "done":
      item.done = true;
      item.invalid = false;
      toggleItemStatus(item, bckItem);
      break;
    case "not done":
      item.done = false;
      item.invalid = false;
      toggleItemStatus(item, bckItem);
      break;
    case "invalid":
      item.done = true;
      item.invalid = true;
      toggleItemStatus(item, bckItem);
      break;
    case "edit":
      itemToEdit.value = item;
      break;
    default:
      break;
  }
};

const toggleItemStatus = async (item: any, bckItem: any) => {
  try {
    await updateDoc(doc($firebase.db, "tips", item.id), {
      done: item.done,
      invalid: item.invalid,
    });
    // loadData();
  } catch (err) {
    console.error(err);
    if (bckItem) {
      item.done = bckItem.done;
      item.invalid = bckItem.invalid;
    } else {
      item.done = false;
      item.invalid = false;
    }
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
