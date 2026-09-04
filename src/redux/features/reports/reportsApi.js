import { baseApi } from "../../api/baseApi";

const reportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllReports: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          // Use the dynamic query parameters provided by the caller
          Object.entries(args).forEach(([key, value]) => {
            params.append(key, value);
          });
        }
        return {
          url: "report",
          method: "GET",
          params,
        };
      },
      providesTags: ["report"],
    }),
    storeReport: builder.mutation({
      query: (payload) => ({
        url: `report`,
        method: "POST",
        body: payload
      }),
      invalidatesTags: ["report"],
    }),
    updateReport: builder.mutation({
      query: ({ id, payload }) => ({
        url: `report/${id}`,
        method: "PUT",
        body: payload
      }),
      invalidatesTags: ["report"],
    }),
    deleteReport: builder.mutation({
      query: ({ id }) => ({
        url: `report/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["report"],
    }),
  }),
});

export const {
  useGetAllReportsQuery,
  useStoreReportMutation,
  useUpdateReportMutation,
  useDeleteReportMutation
} = reportsApi;

export default reportsApi;
