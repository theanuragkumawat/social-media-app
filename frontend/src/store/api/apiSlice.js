import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    credentials:"include"
  }),
  endpoints: (builder) => ({

    //GET ALL USER PROILE POSTS
    getAllUserPosts: builder.query({
      query: ({ userId, page, type }) => ({
        url: `/users/${userId}/posts?type=${type}&page=${page}`,
        method: "GET",
        credentials: "include",
      }),
      serializeQueryArgs: ({ queryArgs }) => {
        // Unique key for cache: Different  per Tab (posts vs reels)
        return `${queryArgs.userId}-${queryArgs.type}`;
      },
      merge: (currentCache, newItems, { arg }) => {
        // If we are fetching page 1, strictly REPLACE the existing cache
        if (arg.page === 1) {
          currentCache.data = newItems.data;
          // Also update other metadata if you have it (like totalDocs, hasMore, etc.)
          // currentCache.totalDocs = newItems.totalDocs;
        } else {
          // If page > 1, APPEND the new items to the existing list
          currentCache.data.push(...newItems.data);
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page;
      },
    }),

    // GET ALL FEED STORIES
    getAllFeedStories: builder.query({
      query: ({ userId }) => ({
        url: `/users/${userId}/stories`,
        method: "GET",
        credentials: "include",
      }),

    }),
    
  }),
});

export const { useGetAllUserPostsQuery, useGetAllFeedStoriesQuery } = apiSlice;
