import { baseApi } from "../../api/baseApi";

const carModelApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCarModels: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          Object.entries(args).forEach(([key, value]) => {
            params.append(key, value);
          });
        }
        return {
          url: "car-model/admin",  // adjust this URL to your backend route
          method: "GET",
          params,
        };
      },
      providesTags: ["carModel"],
    }),

    storeCarModel: builder.mutation({
      query: (payload) => ({
        url: "car-model",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["carModel"],
    }),

    updateCarModel: builder.mutation({
      query: ({ id, payload }) => ({
        url: `car-model/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["carModel"],
    }),

    deleteCarModel: builder.mutation({
      query: (id) => ({
        url: `car-model/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["carModel"],
    }),
  }),
});

export const {
  useGetAllCarModelsQuery,
  useStoreCarModelMutation,
  useUpdateCarModelMutation,
  useDeleteCarModelMutation,
} = carModelApi;

export default carModelApi;
