import { baseApi } from "../../api/baseApi";

const earningsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWithdraw: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          // Use the dynamic query parameters provided by the caller
          Object.entries(args).forEach(([key, value]) => {
            params.append(key, value);
          });
        }
        return {
          url: "dashboard/withdraw",
          method: "GET",
          params,
        };
      },
      providesTags: ["user"],
    }),
    responseWithdraw: builder.mutation({
      query: ({ id, status }) => ({
        url: `payment/withdraw/${id}`,
        method: "POST",
        body: {status}
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const {
  useGetWithdrawQuery,
  useResponseWithdrawMutation,
} = earningsApi;

export default earningsApi;
