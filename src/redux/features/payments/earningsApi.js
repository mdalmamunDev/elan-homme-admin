import { baseApi } from "../../api/baseApi";

const earningsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEarnings: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          // Use the dynamic query parameters provided by the caller
          Object.entries(args).forEach(([key, value]) => {
            params.append(key, value);
          });
        }
        return {
          url: "dashboard/earnings",
          method: "GET",
          params,
        };
      },
      providesTags: ["user"],
    }),
    // updateUser: builder.mutation({
    //   query: ({ id, payload }) => ({
    //     url: `user/${id}`,
    //     method: "PATCH",
    //     body: payload
    //   }),
    //   invalidatesTags: ["user"],
    // }),
  }),
});

export const {
  useGetEarningsQuery,
} = earningsApi;

export default earningsApi;
