import { createSlice } from "@reduxjs/toolkit"

const postSlice = createSlice({

    name: "posts",
    initialState: {
        posts: [],
        currentPage: 0
    },
    reducers: {
        getPostsByPage: (state, action) => {
            const posts = action.payload.posts;
            const nextPage = action.payload.currentPage;

            const existingPosts = state.posts;

            const postIdSet = new Set();

            if (nextPage > state.currentPage) {
                const newPostsState = []

                for (let i = 0; i < existingPosts.length; i++) {
                    newPostsState.push(existingPosts[i]);
                    postIdSet.add(existingPosts[i]._id);
                }

                for (let i = 0; i < posts.length; i++) {
                    if (!postIdSet.has(posts[i]._id)) {
                        newPostsState.push(posts[i]);
                    }
                }

                state.posts = newPostsState;
                state.currentPage = nextPage;
            }
        },
        updatePostById: (state, action) => {
            const post = action.payload.post;
            
            const existingPosts = state.posts;
            const newPostsState = [];

            for (let i = 0; i < existingPosts.length; i++) {
                if (existingPosts[i]._id === post._id) {
                    newPostsState.push(post);
                } else {
                    newPostsState.push(existingPosts[i]);
                }
            }

            state.posts = newPostsState;
        }
    }
})

export default postSlice.reducer;
export const { getPostsByPage, updatePostById } = postSlice.actions;
