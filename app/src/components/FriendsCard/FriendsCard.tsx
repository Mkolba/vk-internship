import React, {useEffect, useState} from "react";
import {Group, Header, Placeholder, Avatar, Tappable, Separator, Cell, UsersStack, Spinner} from "@vkontakte/vkui";
import {IUser} from "../../types";
import {useNavigate} from "react-router-dom";
import './FriendsCard.scss';
import {useScreenType} from "../../hooks";
import {api} from "../../api";

interface FriendsCardProps extends React.HTMLAttributes<HTMLDivElement> {
    user: IUser
}
export const FriendsCard: React.FC<FriendsCardProps> = ({
    user,
    ...restProps
}) => {
    const [friends, setFriends] = useState<IUser[]>([])
    const [isFetching, setIsFetching] = useState(false);
    const navigate = useNavigate();
    const screenType = useScreenType();

    useEffect(() => {
        setIsFetching(true);
        api.getFriends(user.id).then(data => {
            setIsFetching(false);
            setFriends(data.filter((item: any) => item.friend_status === 2))
        }).catch(err => {
            setIsFetching(false)
        })
    }, [user])

    return (
        <>
            {(screenType === "desktop" || friends.length) ?
                <>
                    <Separator className={'FriendsCard__separator'}/>
                    <Group
                        header={screenType === 'desktop' &&
                            <Header onClick={() => navigate(`/friends/${user.id}`)}
                                    indicator={screenType === 'desktop' ? friends.length ? friends.length : '' : null}
                                    style={{cursor: 'pointer'}}
                            >
                                Друзья
                            </Header>}
                        {...restProps}
                    >
                        {friends.length ?
                            screenType === 'desktop' ?
                                <div className={'FriendsCard__list'}>
                                    {friends.slice(0, 4).map(item => (
                                        <Tappable className={'FriendsCard__list__item'} key={item.id} onClick={() => navigate(`/profile/${item.id}`)}>
                                            <Avatar src={item.avatar?.url} size={64}/>
                                            {item.first_name}
                                        </Tappable>
                                    ))}
                                </div>
                                :
                                <Cell after={<UsersStack photos={friends.slice(0, 3).map(item => item.avatar.url)}/>} badgeAfterTitle={friends.length ? friends.length : ''} onClick={() => navigate(`/friends/${user.id}`)}>
                                    Друзья
                                </Cell>
                            :
                            isFetching ?
                                <Placeholder icon={<Spinner/>}/>
                                :
                                <Placeholder>
                                    Здесь никого нет :(
                                </Placeholder>
                        }
                    </Group>
                </>
                :
                null
            }
        </>
    )
}
