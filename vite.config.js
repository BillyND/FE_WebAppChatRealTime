import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": {}, // to workaround the process.env error but not a
    //permanent fix
  },
  resolve: {
    alias: {
      "@utils": `/src/utils`,
      "@UI": `/src/UI`,
      "@assets": `/src/assets`,
      "@services": `/src/services`,
    },
  },
});
