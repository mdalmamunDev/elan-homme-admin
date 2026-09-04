import { baseApi } from "../../api/baseApi";

const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUser: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          // Use the dynamic query parameters provided by the caller
          Object.entries(args).forEach(([key, value]) => {
            params.append(key, value);
          });
        }
        return {
          url: "user",
          method: "GET",
          params,
        };
      },
      providesTags: ["user"],
    }),
    getProvider: builder.query({
      query: (userId) => {
        return {
          url: `tow-truck/${userId}`,
          method: "GET",
        };
      },
      providesTags: ["user"],
    }),
    getPendingRequest: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          Object.entries(args).forEach(([key, value]) => {
            params.append(key, value);
          });
        }
        return {
          url: "user/verification-status",
          method: "GET",
          params,
        };
      },
      providesTags: ["user"],
    }),
    acceptVerification: builder.mutation({
      query: ({ id, isVerified }) => ({
        url: `/tow-truck/verify/${id}`,
        method: "PUT",
        body: {isVerified}
      }),
      invalidatesTags: ["user"],
    }),
    adminNotification: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          Object.entries(args).forEach(([key, value]) => {
            params.append(key, value);
          });
        }
        return {
          url: "notification",
          method: "GET",
          params,
        };
      },
      providesTags: ["transaction", "user"],
    }),
    // adminNotificationBadge: builder.query({
    //   query: () => ({
    //     url: "notification/badge-count",
    //     method: "GET",
    //   }),
    // }),
    // New endpoint for manager approval/deny
    managerApproveDeny: builder.mutation({
      query: ({ id, status }) => ({
        url: `auth/approve-deny?id=${id}&status=${status}`,
        method: "POST",
      }),
      invalidatesTags: ["user"],
    }),
    updateUser: builder.mutation({
      query: ({ id, payload }) => ({
        url: `user/${id}`,
        method: "PATCH",
        body: payload
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const {
  useGetAllUserQuery,
  useGetProviderQuery,
  useGetPendingRequestQuery,
  useAcceptVerificationMutation,
  useManagerApproveDenyMutation, // New hook for the approval/deny action
  useAdminNotificationQuery,
  // useAdminNotificationBadgeQuery,
  useUpdateUserMutation
} = usersApi;

export default usersApi;
