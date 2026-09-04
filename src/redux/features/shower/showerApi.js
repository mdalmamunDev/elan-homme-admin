import { baseApi } from "../../api/baseApi";

const showerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShowerByHost: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item) => {
            params.append(item.name, item.value);
          });
        }
        return {
          url: `user/host-information`,
          method: "GET",
          params,
        };
      },
      providesTags: ["host"],
    }),
    // updateSubscirption: builder.mutation({
    //   query: (body) => ({
    //     url: "subscriptions",
    //     method: "PUT",
    //     body: body,
    //   }),
    //   invalidatesTags: ["setting"],
    // }),
  }),
});

export const { useGetShowerByHostQuery } = showerApi;
