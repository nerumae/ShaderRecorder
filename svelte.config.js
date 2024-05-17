import adapter from "@sveltejs/adapter-static";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      fallback: "404.html",
    }),
    paths: {
      base: process.argv.includes("dev") ? "" : `/${"ShaderRender"}`,
    },
    serviceWorker: {
      register: false,
    },
  },
};

export default config;
