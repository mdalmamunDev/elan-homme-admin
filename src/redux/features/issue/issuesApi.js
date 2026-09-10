import { baseApi } from "../../api/baseApi";

const issuesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // admin — list issues, optionally filtered by magazineId (details page)
    getIssues: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args?.magazineId) {
          params.append("magazineId", args.magazineId);
        }
        if (args?.page) {
          params.append("page", args.page);
        }
        if (args?.limit) {
          params.append("limit", args.limit);
        }
        return {
          url: "issue",
          method: "GET",
          params,
        };
      },
      providesTags: ["issue"],
    }),
    // multipart/form-data — { title, magazineId, downloadLimit, file (pdf) }
    createIssue: builder.mutation({
      query: (payload) => ({
        url: "issue",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["issue"],
    }),
    // multipart/form-data — { title, downloadLimit, isActive, file? (pdf) }
    updateIssue: builder.mutation({
      query: ({ id, payload }) => ({
        url: `issue/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["issue"],
    }),
    deleteIssue: builder.mutation({
      query: ({ id }) => ({
        url: `issue/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["issue"],
    }),
  }),
});

export const {
  useGetIssuesQuery,
  useCreateIssueMutation,
  useUpdateIssueMutation,
  useDeleteIssueMutation,
} = issuesApi;

export default issuesApi;