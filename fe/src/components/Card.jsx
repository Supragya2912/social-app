import React, { useCallback, useState, useEffect } from 'react';
import moment from 'moment';
import { FcLike, FcLikePlaceholder } from "react-icons/fc";
import { useSelector, useDispatch } from 'react-redux';
import { updatePostById } from '../redux/reducers/postReducer';
import { addLike, getPostById } from '../utils/api';

const Card = ({
    post
}) => {
    const user_id = useSelector(state => state.loginReducer.user?._id);
    const dispatch = useDispatch();

    const [isLiked, setIsLiked] = useState(false);
    const [isContentTruncated, setIsContentTruncated] = useState(true); // Initially assume content is truncated
    const [showFullContent, setShowFullContent] = useState(false); // State to track whether to show full content or not

    const toggleLike = useCallback(
        async (postId) => {
            try {
                await addLike({ id: postId });
                const post = await getPostById(postId);
                dispatch(updatePostById({ post: post.data.post }));
            } catch (error) {
                console.error('Error occurred while toggling like:', error);
            }
        },
        [dispatch]
    );

    useEffect(() => {
        if (Array.isArray(post.likeBy) && post.likeBy.includes(user_id)) {
            setIsLiked(true);
        } else {
            setIsLiked(false);
        }

        // Check if content exceeds a certain length to determine whether to truncate or not
        if (post.content && post.content.length > 100) {
            setIsContentTruncated(true);
        } else {
            setIsContentTruncated(false);
        }
    }, [post, user_id]);

    const toggleContent = () => {
        setShowFullContent(!showFullContent);
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-4 mt-4">
            <div className="flex items-center mb-4">
                <img
                    className="w-10 h-10 rounded-full mr-2"
                    src="https://via.placeholder.com/50"
                    alt="User Avatar"
                />
                <div className='flex flex-col'>
                    <span className="font-bold">{post.name}</span>
                    <span className='text-gray-600'>{post.bio}</span>
                </div>
            </div>
            <p className="text-gray-600">{post.description}</p>
            {
                post?.image?.length > 0 ? (
                    <div className="rounded-lg border border-gray-200 overflow-hidden mt-3">
                        <img src={post.image[0]} alt="Content" className="w-full p-0" />
                    </div>
                ) : post.content ? (
                    <div className="rounded-lg border border-gray-200 p-4 mb-4 m-3">
                        {isContentTruncated ? (
                            <>
                                <p>{showFullContent ? post.content : `${post.content.slice(0, 100)}...`}</p>
                                <button onClick={toggleContent} className="text-gray-400 hover:text-blue-700">
                                    {showFullContent ? 'Read less' : 'Read more'}
                                </button>
                            </>
                        ) : (
                            <p>{post.content}</p>
                        )}
                    </div>
                ) : null
            }

            <div className="flex items-center justify-between">
                <p className="text-gray-400 text-sm mt-2">{moment(post.createdAt).fromNow()}</p>
                <button onClick={() => toggleLike(post._id)} className="text-blue-500 hover:text-blue-700 mr-3">
                    {isLiked ? <FcLike size={24} /> : <FcLikePlaceholder size={24} />} {post.like}
                </button>
            </div>
        </div>
    )
};

export default React.memo(Card);
