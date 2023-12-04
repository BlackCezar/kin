import ky from "ky";

export const client = ky.create({
  prefixUrl: `${
    process.env.VUE_APP_BACKEND_HOST
      ? process.env.VUE_APP_BACKEND_HOST
      : "https://back.kin-store.ru"
  }/api`,
});
