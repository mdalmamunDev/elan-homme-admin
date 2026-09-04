import { baseApi } from "../../api/baseApi";

const uploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadSingle: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: 'upload',
          method: 'POST',
          body: formData,
          // No JSON payload
        };
      },
      invalidatesTags: ['service'],
    }),
  }),
});

export const {
  useUploadSingleMutation,
} = uploadApi;

export default uploadApi;
