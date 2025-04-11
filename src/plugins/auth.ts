export default defineNuxtPlugin(({ hook }) => {
  hook("app:created", async () => {
    if (process.client) {
      const lastLogin = localStorage.getItem("lastLogin");
      if (!lastLogin) {
        navigateTo("/login", { replace: true });
        return;
      }
      const now = new Date();
      const lastLoginDate = new Date(lastLogin);
      const diff = now.getTime() - lastLoginDate.getTime();
      const diffInMinutes = diff / 1000 / 60;
      if (diffInMinutes > 60) {
        navigateTo("/login", { replace: true });
      }
    }
  });
});
