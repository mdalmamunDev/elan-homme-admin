import { baseApi } from "../../api/baseApi";

const supportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReports: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item) => {
            params.append(item.name, item.value);
          });
        }
        return {
          url: `user/support-reports`,
          method: "GET",
          params,
        };
      },
      providesTags: ["support"],
    }),
    getChatUsersByToken: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item) => {
            params.append(item.name, item.value);
          });
        }
        return {
          url: `chat/list`,
          method: "GET",
          params,
        };
      },
      // providesTags: [],
    }),
    getChatList: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item) => {
            params.append(item.name, item.value);
          });
        }
        return {
          url: `chat/message`,
          method: "GET",
          params,
        };
      },
      // providesTags: ["chat"],
    }),
    sendMessage: builder.mutation({
      query: ({ id, body }) => ({
        url: `chat/create-message-with-file?chatId=${id}`,
        method: "POST",
        body: body,
      }),
      // invalidatesTags: ["chat"],
    }),
  }),
});

export const {
  useGetReportsQuery,
  useGetChatUsersByTokenQuery,
  useGetChatListQuery,
  useSendMessageMutation,
} = supportApi;
