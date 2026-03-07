import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    credentials: "include",
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
        return (
          currentArg?.page !== previousArg?.page ||
          currentArg?.userId !== previousArg?.userId ||
          currentArg?.type !== previousArg?.type
        );
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

    getPostComments: builder.query({
      query: ({ postId, page }) => ({
        url: `posts/${postId}/comments?page=${page}`,
        method: "GET",
        credentials: "include",
      }),
      serializeQueryArgs: ({ queryArgs, endpointName }) => {
        // Unique key for cache: Different  per Tab (posts vs reels)
        return `${queryArgs.postId}`;
      },
      merge: (currentCache, newItems) => {
        currentCache.data = {
          hasNextPage: newItems.data.hasNextPage,
          nextPage: newItems.data.nextPage,
          page: newItems.data.page,
          totalDocs: newItems.data.totalDocs,
          totalPages: newItems.data.totalPages,
          docs: [...currentCache.data.docs, ...newItems.data.docs],
        };
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page;
      },
    }),

    getUserFollowers: builder.query({
      query: ({ userId, page, type }) => ({
        url: `users/${userId}/followers?page=${page}`,
        method: "GET",
        credentials: "include",
      }),
      serializeQueryArgs: ({ queryArgs, endpointName }) => {
        // Unique key for cache: Different  per Tab (posts vs reels)
        return `${queryArgs.userId}-${queryArgs.type}`;
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page == 1) {
          currentCache.data = newItems.data;
        } else {
          currentCache.data = {
            hasNextPage: newItems.data.hasNextPage,
            nextPage: newItems.data.nextPage,
            page: newItems.data.page,
            totalDocs: newItems.data.totalDocs,
            totalPages: newItems.data.totalPages,
            docs: [...currentCache.data.docs, ...newItems.data.docs],
          };
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page;
      },
    }),

    getUserFollowing: builder.query({
      query: ({ userId, page, type }) => ({
        url: `users/${userId}/following?page=${page}`,
        method: "GET",
        credentials: "include",
      }),
      serializeQueryArgs: ({ queryArgs, endpointName }) => {
        // Unique key for cache: Different  per Tab (posts vs reels)
        return `${queryArgs.userId}-${queryArgs.type}`;
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page == 1) {
          currentCache.data = newItems.data;
        } else {
          currentCache.data = {
            hasNextPage: newItems.data.hasNextPage,
            nextPage: newItems.data.nextPage,
            page: newItems.data.page,
            totalDocs: newItems.data.totalDocs,
            totalPages: newItems.data.totalPages,
            docs: [...currentCache.data.docs, ...newItems.data.docs],
          };
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page;
      },
    }),

    getUserFeed: builder.query({
      query: ({ cursor }) => ({
        url: `users/feed`,
        params: cursor ? { cursor } : {},
        method: "GET",
        credentials: "include",
      }),

      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },

      merge: (currentCache, newItems) => {
        if (newItems?.data?.posts) {
          // Purane posts ke aage naye posts append kar do
          currentCache.data.posts.push(...newItems.data.posts);
          
          // Cursor aur pagination info update kar do
          currentCache.data.nextCursor = newItems.data.nextCursor;
          currentCache.data.hasNextPage = newItems.data.hasNextPage;
        }
      },
      
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.cursor !== previousArg?.cursor;
      },
    }),

    likePost: builder.mutation({
      query: (postId) => ({
        url: `posts/${postId}/like`, // Apne backend ka route check kar lena
        method: "POST", 
        credentials: "include",
      }),
      async onQueryStarted(postId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData("getUserFeed", undefined, (draft) => {
            const post = draft.data.posts.find((p) => p._id === postId);
            if (post && !post.hasLiked) {
              post.totalLikes += 1;
              post.hasLiked = true;
            }
          })
        );
        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
          console.error("Like failed, reverting UI:", error);
        }
      },
    }),

    // 2. UNLIKE POST MUTATION
    unlikePost: builder.mutation({
      query: (postId) => ({
        url: `posts/${postId}/like`, // Apne backend ka unlike route check kar lena
        method: "DELETE", // Agar unlike ke liye POST use kar rahe ho, toh yahan method change kar lena
        credentials: "include",
      }),
      async onQueryStarted(postId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData("getUserFeed", undefined, (draft) => {
            const post = draft.data.posts.find((p) => p._id === postId);
            if (post && post.hasLiked) {
              post.totalLikes -= 1;
              post.hasLiked = false;
            }
          })
        );
        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
          console.error("Unlike failed, reverting UI:", error);
        }
      },
    }),


  }),
});

export const {
  useGetAllUserPostsQuery,
  useGetAllFeedStoriesQuery,
  useGetPostCommentsQuery,
  useGetUserFollowersQuery,
  useGetUserFollowingQuery,
  useGetUserFeedQuery,
  useLikePostMutation,
  useUnlikePostMutation
} = apiSlice;
