import React, {useEffect, useState} from 'react';
import './ProfilePage.scss';
import {FriendsCard, PostEditor, Wall} from "../../components";
import {Group, Header, Placeholder, Spinner, SplitCol, SplitLayout} from "@vkontakte/vkui";
import {useAtomValue} from "@mntm/precoil";
import {currentUserAtom} from "../../store";
import {UserCard} from "../../components/UserCard/UserCard";
import {Icon56NewsfeedOutline, Icon28IncognitoOutline} from "@vkontakte/icons";
import {useParams} from "react-router-dom";
import {useScreenType} from "../../hooks";
import {api} from "../../api";
import {IPost, UserType} from "../../types";

interface ProfilePageProps extends React.HTMLAttributes<HTMLDivElement> {

}

export const ProfilePage: React.FC<ProfilePageProps> = ({

})=> {
    const {userId} = useParams();
    const [user, setUser] = useState<UserType | null>(null);
    const [fetchedPosts, setFetchedPosts] = useState<IPost[]>([]);
    const [isFetching, setIsFetching] = useState(false);

    const screenType = useScreenType();

    useEffect(() => {
        setIsFetching(true);
        api.getUser(Number(userId)).then(data => {
            setUser(data);
            api.getWall(Number(userId)).then(posts => {
                setIsFetching(false);
                setFetchedPosts(posts);
            }).catch(err => {
                setIsFetching(false)
            })
        }).catch(err => {
            setIsFetching(false);
        })
    }, [userId])

    const addPost = (post: IPost) => {
        setFetchedPosts([post, ...fetchedPosts]);
    }

    return (
        <>
            {user ?
                <>
                    <UserCard user={user} setUser={setUser}/>
                    <SplitLayout className={'ProfileLayout'}>
                        <SplitCol maxWidth={screenType === 'desktop' ? 700 : '100%'} width={'100%'} className={'Profile__column'} stretchedOnMobile>
                            {screenType === 'mobile' &&
                                <FriendsCard user={user}/>
                            }
                            <PostEditor user={user} addPost={addPost}/>
                            {fetchedPosts.length ?
                                <Wall posts={fetchedPosts}/>
                                :
                                <Group header={<Header mode={'secondary'}>Ваша стена</Header>}>
                                    <Placeholder icon={<Icon56NewsfeedOutline/>}>
                                        На стене пока нет ни одной записи
                                    </Placeholder>
                                </Group>
                            }

                        </SplitCol>
                        {screenType === 'desktop' &&
                            <SplitCol autoSpaced className={'Profile__column'}>
                                <FriendsCard user={user}/>
                            </SplitCol>
                        }
                    </SplitLayout>
                </>
                :
                <Group>
                    {isFetching ?
                        <Placeholder stretched icon={<Spinner/>}/>
                        :
                        <Placeholder header={'Увы и ах!'} icon={<Icon28IncognitoOutline width={64} height={64}/>}>
                            Пользователь не найден
                        </Placeholder>
                    }
                </Group>
            }
        </>
    )
}