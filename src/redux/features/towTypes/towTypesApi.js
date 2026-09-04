import { baseApi } from "../../api/baseApi";

const towTypesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTowTypes: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          // Use the dynamic query parameters provided by the caller
          Object.entries(args).forEach(([key, value]) => {
            params.append(key, value);
          });
        }
        return {
          url: "tow-type",
          method: "GET",
          params,
        };
      },
      providesTags: ["towType"],
    }),
    storeTowType: builder.mutation({
      query: (payload) => ({
        url: `tow-type`,
        method: "POST",
        body: payload
      }),
      invalidatesTags: ["towType"],
    }),
    updateTowType: builder.mutation({
      query: ({ id, payload }) => ({
        url: `tow-type/${id}`,
        method: "PUT",
        body: payload
      }),
      invalidatesTags: ["towType"],
    }),
    deleteTowType: builder.mutation({
      query: ({ id }) => ({
        url: `tow-type/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["towType"],
    }),
  }),
});

export const {
  useGetAllTowTypesQuery,
  useStoreTowTypeMutation,
  useUpdateTowTypeMutation,
  useDeleteTowTypeMutation
} = towTypesApi;

export default towTypesApi;
