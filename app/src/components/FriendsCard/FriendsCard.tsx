import React, {useEffect, useState} from "react";
import {Group, Header, Placeholder, Avatar, Tappable, Separator, Cell, UsersStack, Spinner} from "@vkontakte/vkui";
import {UserType} from "../../types";
import {useNavigate} from "react-router-dom";
import './FriendsCard.scss';
import {useScreenType} from "../../hooks";
import {api} from "../../api";

interface FriendsCardProps extends React.HTMLAttributes<HTMLDivElement> {
    user: UserType
}
export const FriendsCard: React.FC<FriendsCardProps> = ({
    user,
    ...restProps
}) => {
    const [friends, setFriends] = useState<UserType[]>([])
    const [isFetching, setIsFetching] = useState(false);
    const navigate = useNavigate();
    const screenType = useScreenType();

    useEffect(() => {
        setIsFetching(true);
        api.getFriends(user.id).then(data => {
            setIsFetching(false);
            setFriends(data.filter((item: any) => item.status === 2))
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
                            <Header onClick={() => navigate('/friends')}
                                    indicator={screenType === 'desktop' ? friends.length ? friends.length : '' : null}
                            >
                                Друзья
                            </Header>}
                        {...restProps}
                    >
                        {friends.length ?
                            screenType === 'desktop' ?
                                <div className={'FriendsCard__list'}>
                                    {friends.map(item => (
                                        <Tappable className={'FriendsCard__list__item'} key={item.id} onClick={() => navigate(`/profile/${item.id}`)}>
                                            <Avatar src={item.avatar?.url} size={64}/>
                                            {item.first_name}
                                        </Tappable>
                                    ))}
                                </div>
                                :
                                <Cell after={<UsersStack photos={friends.map(item => item.avatar.url)}/>} badgeAfterTitle={friends.length ? friends.length : ''}>
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
