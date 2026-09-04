import { baseApi } from "../../api/baseApi";

const paymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentsChart: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          // Use the dynamic query parameters provided by the caller
          Object.entries(args).forEach(([key, value]) => {
            params.append(key, value);
          });
        }
        return {
          url: "payment/chart",
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
  useGetPaymentsChartQuery,
} = paymentsApi;

export default paymentsApi;
