import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            // Access token directly from Redux state instead of localStorage
            // This is more reliable in Capacitor as the state is already managed by Redux
            const token = getState().auth?.token;
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["Turf", "Tournament"],
    // Global settings for the slice
    keepUnusedDataFor: 300, // Keep data in memory for 5 minutes
    refetchOnFocus: false,   // Prevents refetching when app returns from background (useful for mobile)
    refetchOnReconnect: true, // Refetch when internet connection is restored
    refetchOnMountOrArgChange: false,

    endpoints: (builder) => ({
        getTurfs: builder.query({
            query: (city) => `/api/user/turf/all/${city.toLowerCase()}`,
            providesTags: (result, error, city) => [{ type: "Turf", id: city.toLowerCase() }],
        }),
        getTournaments: builder.query({
            query: (city) => `/api/user/tournaments/all/${city.toLowerCase()}`,
            providesTags: (result, error, city) => [{ type: "Tournament", id: city.toLowerCase() }],
        }),
    }),
});

export const { useGetTurfsQuery, useGetTournamentsQuery } = apiSlice;
