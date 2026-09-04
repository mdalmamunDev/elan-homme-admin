import { baseApi } from "../../api/baseApi";

const magazinesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllMagazines: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          // Use the dynamic query parameters provided by the caller
          Object.entries(args).forEach(([key, value]) => {
            params.append(key, value);
          });
        }
        return {
          url: "magazine",
          method: "GET",
          params,
        };
      },
      providesTags: ["magazine"],
    }),
    storeMagazine: builder.mutation({
      query: (payload) => ({
        url: `magazine`,
        method: "POST",
        body: payload
      }),
      invalidatesTags: ["magazine"],
    }),
    updateMagazine: builder.mutation({
      query: ({ id, payload }) => ({
        url: `magazine/${id}`,
        method: "PUT",
        body: payload
      }),
      invalidatesTags: ["magazine"],
    }),
    deleteMagazine: builder.mutation({
      query: ({ id }) => ({
        url: `magazine/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["magazine"],
    }),
  }),
});

export const {
  useGetAllMagazinesQuery,
  useStoreMagazineMutation,
  useUpdateMagazineMutation,
  useDeleteMagazineMutation
} = magazinesApi;

export default magazinesApi;
