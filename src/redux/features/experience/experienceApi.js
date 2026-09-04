import { baseApi } from "../../api/baseApi";

const experienceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllExperience: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          Object.entries(args).forEach(([key, value]) => {
            params.append(key, value);
          });
        }
        return {
          url: "experience/admin",
          method: "GET",
          params,
        };
      },
      providesTags: ["experience"],
    }),

    storeExperience: builder.mutation({
      query: ( payload ) => ({
        url: "experience",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["experience"],
    }),

    updateExperience: builder.mutation({
      query: ({ id, payload }) => ({
        url: `experience/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["experience"],
    }),

    deleteExperience: builder.mutation({
      query: (id) => ({
        url: `experience/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["experience"],
    }),
  }),
});

export const {
  useGetAllExperienceQuery,
  useStoreExperienceMutation,
  useUpdateExperienceMutation,
  useDeleteExperienceMutation,
} = experienceApi;

export default experienceApi;
