import { baseApi } from "../../api/baseApi";

const promosApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPromos: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          // Use the dynamic query parameters provided by the caller
          Object.entries(args).forEach(([key, value]) => {
            params.append(key, value);
          });
        }
        return {
          url: "promo",
          method: "GET",
          params,
        };
      },
      providesTags: ["promo"],
    }),
    storePromo: builder.mutation({
      query: (payload) => ({
        url: `promo`,
        method: "POST",
        body: payload
      }),
      invalidatesTags: ["promo"],
    }),
    updatePromo: builder.mutation({
      query: ({ id, payload }) => ({
        url: `promo/${id}`,
        method: "PUT",
        body: payload
      }),
      invalidatesTags: ["promo"],
    }),
    deletePromo: builder.mutation({
      query: ({ id }) => ({
        url: `promo/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["promo"],
    }),
  }),
});

export const {
  useGetAllPromosQuery,
  useStorePromoMutation,
  useUpdatePromoMutation,
  useDeletePromoMutation
} = promosApi;

export default promosApi;
