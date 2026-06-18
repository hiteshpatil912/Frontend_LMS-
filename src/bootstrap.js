import Echo from "laravel-echo";
import Pusher from "pusher-js";

console.log("🔥 Bootstrap Loaded");

window.Pusher = Pusher;

const token = localStorage.getItem("token");

console.log("🔥 Token =", token);

window.Echo = new Echo({
  broadcaster: "reverb",

  key: import.meta.env.VITE_REVERB_APP_KEY,

  wsHost: import.meta.env.VITE_REVERB_HOST,

  wsPort: Number(import.meta.env.VITE_REVERB_PORT),

  forceTLS: false,

  enabledTransports: ["ws"],

  authEndpoint: "http://127.0.0.1:8000/api/broadcasting/auth",
  auth: {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      Accept: "application/json",
    },
  },
});

// Expose a helper to update headers dynamically after login
window.updateEchoToken = (newToken) => {
  if (window.Echo) {
    window.Echo.options.auth.headers.Authorization = `Bearer ${newToken}`;
  }
};

console.log("🔥 Echo =", window.Echo);
