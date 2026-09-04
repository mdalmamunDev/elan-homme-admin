import { baseApi } from "../../api/baseApi";

const earningsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTransferAll: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          // Use the dynamic query parameters provided by the caller
          Object.entries(args).forEach(([key, value]) => {
            params.append(key, value);
          });
        }
        return {
          url: "dashboard/transactions",
          method: "GET",
          params,
        };
      },
      providesTags: ["user"],
    }),
    getTransfer: builder.query({
      query: (id) => ({
        url: `payment/transaction/${id}`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    responseRefund: builder.mutation({
      query: ({ id, refunded }) => ({
        url: `payment/refund/response/${id}`,
        method: "POST",
        body: { refunded } // takes boolean value
      }),
      invalidatesTags: ["user"],
    }),
    transferTransaction: builder.mutation({
      query: ({ id }) => ({
        url: `payment/transaction/transfer/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const {
  useGetTransferAllQuery,
  useGetTransferQuery,
  useResponseRefundMutation,
  useTransferTransactionMutation,
} = earningsApi;

export default earningsApi;
