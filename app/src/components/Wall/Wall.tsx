import React from "react";
import {AnyFunction, IPost} from "../../types";
import {Post} from "../Post/Post";
import InfiniteScroll from 'react-infinite-scroll-component';
import './Wall.scss'
import {Placeholder, Spinner} from "@vkontakte/vkui";

interface WallProps extends React.HTMLAttributes<HTMLDivElement> {
    posts: IPost[],
    hasMore: boolean,
    next: AnyFunction
}

export const Wall: React.FC<WallProps> = ({
    posts,
    hasMore,
    next
}) => {
    const items = posts.map(item => (
        <Post post={item} key={item.id}/>
    ))

    return (
        <div className={'Wall'}>
            <InfiniteScroll
                dataLength={items.length}
                next={next}
                hasMore={hasMore}
                loader={<Placeholder icon={<Spinner/>}/>}
            >
                {items}
            </InfiniteScroll>
        </div>
    )
}