import { baseApi } from "../../api/baseApi";

const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboard: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          // Use the dynamic query parameters provided by the caller
          Object.entries(args).forEach(([key, value]) => {
            params.append(key, value);
          });
        }
        return {
          url: "/dashboard",
          method: "GET",
          params,
        };
      },
      providesTags: ["dashboard"],
    }),
  }),
});

export const {
  useGetDashboardQuery,
} = dashboardApi;

export default dashboardApi;
