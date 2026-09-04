import { baseApi } from "../../api/baseApi";

const settingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSetting: builder.query({
      query: (endpoint) => {
        return {
          url: `setting/${endpoint}`,
          method: "GET",
        };
      },
      providesTags: ["setting"],
    }),
    getSettingGenerals: builder.query({
      query: () => {
        return {
          url: `setting/generals`,
          method: "GET",
        };
      },
      providesTags: ["setting"],
    }),
    updateSettings: builder.mutation({
      query: ({ url, body }) => ({
        url: `setting/${url}`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["setting"],
    }),
    updateSettingGenerals: builder.mutation({
      query: ({payload}) => ({
        url: `setting/generals`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["setting"],
    }),
  }),
});

export const { 
  useGetSettingQuery,
  useGetSettingGeneralsQuery,
  useUpdateSettingsMutation,
  useUpdateSettingGeneralsMutation,
} = settingApi;
