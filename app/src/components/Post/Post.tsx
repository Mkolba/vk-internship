import React, {useState} from "react";
import {IPost} from "../../types";
import {Avatar, Button, Cell, Group} from "@vkontakte/vkui";
import {Icon20LikeCircleFillRed, Icon20LikeOutline} from "@vkontakte/icons";
import {useNavigate} from "react-router-dom";
import {api} from "../../api";
import './Post.scss'


interface PostProps extends React.HTMLAttributes<HTMLDivElement> {
    post: IPost
}

export const Post: React.FC<PostProps> = ({
    post
}) => {
    const [likesCount, setLikesCount] = useState(post.likes_count)
    const [isLiked, setIsLiked] = useState(post.is_liked)
    const [isFetching, setIsFetching] = useState(false);
    const navigate = useNavigate();

    const toggleLike = () => {
        if (!isFetching) {
            setIsFetching(true);
            if (isLiked) {
                api.dislikePost(post.id).then(resp => {
                    setLikesCount(likesCount - 1)
                    setIsLiked(false)
                    setIsFetching(false);
                }).catch(err => {
                    setIsFetching(false);
                })
            } else {
                api.likePost(post.id).then(resp => {
                    setLikesCount(likesCount + 1)
                    setIsLiked(true)
                    setIsFetching(false);
                }).catch(err => {
                    setIsFetching(false);
                })
            }
        }
    }

    return (
        <Group className={'Post'}>
            <div className={'Post__user'}>
                <Cell before={<Avatar size={36} src={post.creator.avatar.url}/>}
                      subtitle={new Date(post.date).toLocaleString()}
                      onClick={() => navigate(`/profile/${post.creator.id}`)}
                >
                    {post.creator.first_name} {post.creator.last_name}
                </Cell>
            </div>
            <div className={'Post__content'}>
                {post.text &&
                    <div className={'Post__text'}>
                        {post.text}
                    </div>
                }
                {post.photo &&
                    <div className={'Post__photo'}>
                        <img src={post.photo.url} alt={''}/>
                    </div>
                }
            </div>
            <div className={'Post__controls'}>
                <Button before={isLiked ? <Icon20LikeCircleFillRed/> : <Icon20LikeOutline/>}
                        onClick={toggleLike}
                        className={'Post__likeButton'}
                        mode={'secondary'}
                >
                    {likesCount}
                </Button>
            </div>
        </Group>
    )
}