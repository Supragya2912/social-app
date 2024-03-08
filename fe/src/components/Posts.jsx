import React, { useEffect, useCallback } from "react";
import Navbar from "./Navbar";
import { getPosts } from "../utils/api";
import CardList from "./CardList";
import UserProfile from "./UserProfile";
import { SpinnerColors } from "../utils/Loading";
import { useSelector, useDispatch } from "react-redux";
import { getPostsByPage } from "../redux/reducers/postReducer";
import InfiniteScroll from "react-infinite-scroll-component";
import { useMediaQuery } from 'react-responsive';

const Posts = () => {
  const postData = useSelector((state) => state.postReducer.posts);
  const currentPage = useSelector((state) => state.postReducer.currentPage);
  const dispatch = useDispatch();
  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });



  const postsPerPage = 10;

  const getNextPosts = useCallback(
    async (page) => {
      try {
        const response = await getPosts({ page, limit: postsPerPage });
        dispatch(
          getPostsByPage({
            type: "",
            posts: response.data.posts,
            currentPage: response.data.currentPage,
          })
        );
      } catch (error) {
        console.error("Error getting posts:", error);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    getNextPosts(1);
  }, [getNextPosts]);

  return (
    <>
      <Navbar />
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-3'} justify-center mt-8 bg-gray-200`}>
        <div className="col-start-1 col-end-2 ml-20 flex items-start fixed top-0 hidden sm:flex">
          <div className="mb-4 mt-20">
            <UserProfile />
          </div>
        </div>
        <div className={isMobile ? '' : 'col-start-2 col-end-3'}>
          <div className="flex justify-center items-center">
              <div className="w-full sm:max-w-lg">
                <div
                  className="mb-4 mt-20"
                >
                  <InfiniteScroll
                    dataLength={postData.length}
                    next={() => {
                        getNextPosts(currentPage + 1)
                    }}
                    hasMore={true}
                    loader={ <div className="text-2xl font-semibold text-center">
                    <SpinnerColors />
                  </div>}
                  >
                    <CardList
                      postData={postData}
                      currentPage={currentPage}
                      postsPerPage={postsPerPage}
                    />
                  </InfiniteScroll>
                </div>
              </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Posts;
