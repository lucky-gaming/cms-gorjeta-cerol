<template>
  <div
    class="flex flex-col items-center justify-center w-screen h-screen min-h-[768px] relative px-4"
  >
    <div
      class="fixed inset-0 w-[180%] h-[180%] customBg z-[0] -rotate-12 -translate-y-[25%] -translate-x-[25%]"
    ></div>
    <div
      class="z-[1] flex flex-col items-center justify-center bg-[#1A242D] rounded-2xl p-4 w-full max-w-[640px] gap-6 shadow-xl"
    >
      <h1 class="text-3xl font-bold text-white">Login</h1>
      <form
        class="flex flex-col items-center justify-center w-full mt-4 gap-6"
        @submit.prevent="login"
      >
        <div
          v-if="error"
          class="flex items-center gap-2 text-white bg-primary rounded-lg px-2 py-2 text-sm w-full"
        >
          <i class="fi fi-ss-info flex items-center justify-center"></i>
          <span> Credenciais erradas. Por favor, tente novamente. </span>
        </div>
        <div class="flex flex-col w-full gap-4">
          <input
            v-model="form.username"
            type="text"
            placeholder="Username"
            class="w-full p-2 bg-[#2D3748] text-white rounded-lg mb-2 outline-none border border-transparent focus:border-primary"
            inputmode="text"
            enterkeyhint="next"
            tabindex="1"
            ref="usernameInput"
          />
          <input
            v-model="form.password"
            type="password"
            placeholder="Password"
            class="w-full p-2 bg-[#2D3748] text-white rounded-lg mb-2 outline-none border border-transparent focus:border-primary"
            inputmode="text"
            enterkeyhint="go"
            tabindex="2"
            @keydown.enter.prevent="login"
          />
        </div>
        <button
          type="submit"
          class="w-full p-2 bg-primary text-white rounded-lg font-semibold relative overflow-hidden"
          @mouseover="showSliver = true"
          @mouseleave="showSliver = false"
        >
          <div
            class="w-[16px] -skew-x-12 top-0 h-full bg-white/50 absolute sliver"
            v-if="showSliver"
          ></div>
          <span> Login </span>
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const form = ref({
  username: "",
  password: "",
});

const showSliver = ref(false);
const error = ref(false);
const usernameInput = ref<HTMLElement | null>(null);

const login = async () => {
  error.value = false;
  if (
    form.value.username === "X7#d9f$3LqW@z2M" &&
    form.value.password === "R@p9!mD#7xT4k^Y"
  ) {
    localStorage.setItem("lastLogin", new Date().toISOString());
    router.push("/dashboard");
  } else {
    error.value = true;
    await nextTick(); // Garante que a DOM foi atualizada antes de mover o foco
    usernameInput.value?.focus();
  }
};

onMounted(() => {
  showSliver.value = true;

  // Lógica para mover o foco automaticamente no mobile ao pressionar "Next"
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input, index) => {
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        const nextInput = inputs[index + 1];
        if (nextInput) nextInput.focus();
      }
    });
  });

  // foco no primeiro input
  usernameInput.value?.focus();
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
