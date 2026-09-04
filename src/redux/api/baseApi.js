import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER_URL}`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
       //console.log(getState().auth.token);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("X-Custom-Header", "foobar");
      return headers;
    },
  }),
  tagTypes: ["auth", "user", "setting", "host", "transaction","support", "chat"],
  endpoints: () => ({}),
});
