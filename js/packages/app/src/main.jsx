import { createApp, Suspense } from "vue"
import { NSpin } from "naive-ui"

import App from "./App.jsx"
import "./index.css"

createApp(() => (
  <Suspense
    v-slots={{
      fallback: () => (
        <NSpin
          size="large"
          class="absolute top-1/2 left-1/2"
          style={{ transform: "translate(-50%, -50%)" }}
        />
      ),
    }}
  >
    <App />
  </Suspense>
)).mount("#app")
