import React, {useEffect, useState} from 'react';
import './NewsfeedPage.scss';
import {Wall} from "../../components";
import {IPost} from "../../types";
import {api} from "../../api";
import {Group, Placeholder, Spinner} from "@vkontakte/vkui";

interface NewsfeedPageProps extends React.HTMLAttributes<HTMLDivElement> {

}

export const NewsfeedPage: React.FC<NewsfeedPageProps> = () => {
    const [posts, setPosts] = useState<IPost[]>([])
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        setIsFetching(true)
        api.getNewsfeed().then(data => {
            setIsFetching(false);
            setPosts(data)
            setHasMore(!(data.length < 20))
        }).catch(() => {
            setIsFetching(false);
        })
    }, [])

    const updatePosts = () => {
        api.getNewsfeed(offset + 20).then(data => {
            setHasMore(!(data.length < 20))
            setOffset(offset + 20)
            setPosts([...posts, ...data])
        })
    }

    return (
        posts.length ?
            <Wall posts={posts} hasMore={hasMore} next={updatePosts}/>
            :
            <Group>
                {isFetching ?
                    <Placeholder icon={<Spinner/>}/>
                    :
                    <Placeholder header={'Увы и ах!'}>Пока здесь ничего нет</Placeholder>
                }
            </Group>
    )
}