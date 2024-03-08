import React from 'react';
import Card from './Card';

const CardList = ({ postData }) => {
    return (
        <>
            {postData && postData.map((post) => (
                <Card
                    key={post._id}
                    post={post}
                />
            ))}
        </>
    );
};

export default CardList;
