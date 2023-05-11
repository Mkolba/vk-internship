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
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        setIsFetching(true)
        api.getNewsfeed().then(data => {
            setIsFetching(false);
            setPosts(data)
        }).catch(() => {
            setIsFetching(false);
        })
    }, [])

    return (
        posts.length ?
            <Wall posts={posts}/>
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