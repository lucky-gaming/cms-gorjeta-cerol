// plugins/firebase.client.ts
import { defineNuxtPlugin } from "#app";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export default defineNuxtPlugin(({ hook }) => {
  hook("app:created", async () => {
    const nuxtApp = useNuxtApp();
    const firebaseConfig = {
      apiKey: "AIzaSyCYz3tWcey6WMhekbSynwoQmEUTtTcKmfw",
      authDomain: "gorgeta-do-cerol.firebaseapp.com",
      projectId: "gorgeta-do-cerol",
      storageBucket: "gorgeta-do-cerol.firebasestorage.app",
      messagingSenderId: "213672007586",
      appId: "1:213672007586:web:10dba2230d49b5e69084fb",
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth(app);

    nuxtApp.provide("firebase", {
      app,
      db,
      auth,
    });
  });
});
