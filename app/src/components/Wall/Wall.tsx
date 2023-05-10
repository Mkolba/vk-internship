import React from "react";
import {IPost} from "../../types";
import {Post} from "../Post/Post";
import './Wall.scss'

interface WallProps extends React.HTMLAttributes<HTMLDivElement> {
    posts: IPost[]
}

export const Wall: React.FC<WallProps> = ({
    posts,
}) => {
    return (
        <div className={'Wall'}>
            {posts.map(item => (
                <Post post={item} key={item.id}/>
            ))}
        </div>
    )
}