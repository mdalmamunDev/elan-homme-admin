import { baseApi } from "../../api/baseApi";

const subscriptionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // admin — paginated list of all subscriptions (populates user + magazine)
    getAllSubscriptions: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          Object.entries(args).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
              params.append(key, value);
            }
          });
        }
        return {
          url: "subscription/all",
          method: "GET",
          params,
        };
      },
      providesTags: ["subscription"],
    }),
    // admin — grant a subscription without payment (testing / manual grants)
    // body: { userId, magazineId, orderType?, country?, period? (months) }
    adminCreateSubscription: builder.mutation({
      query: (payload) => ({
        url: "subscription/admin-create",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["subscription"],
    }),
    // admin — activate / deactivate: { status: 'active' | 'cancelled' }
    adminUpdateSubscriptionStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `subscription/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["subscription"],
    }),
  }),
});

export const {
  useGetAllSubscriptionsQuery,
  useAdminCreateSubscriptionMutation,
  useAdminUpdateSubscriptionStatusMutation,
} = subscriptionsApi;

export default subscriptionsApi;