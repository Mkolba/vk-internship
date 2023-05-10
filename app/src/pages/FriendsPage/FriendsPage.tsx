import React, {useEffect, useState} from 'react';
import './FriendsPage.scss';
import {Page} from "../../components";
import {Group, RichCell, Avatar, Button, ButtonGroup, Header, Placeholder, ScreenSpinner} from "@vkontakte/vkui";
import {AnyFunction, UserType} from "../../types";
import {api} from "../../api";
import {NavigateFunction, useNavigate, useParams} from "react-router-dom";
import {useAtomValue, useSetAtomState} from "@mntm/precoil";
import {currentUserAtom, popoutAtom} from "../../store";


interface FriendsPageProps extends React.HTMLAttributes<HTMLDivElement> {

}

interface FriendCellProps extends React.HTMLAttributes<HTMLDivElement> {
    item: UserType,
    navigate: NavigateFunction,
    delFriend: AnyFunction,
    addFriend: AnyFunction,
    showControls: boolean
}

const FriendCell: React.FC<FriendCellProps> = ({
    item,
    navigate,
    delFriend,
    addFriend,
    showControls
}) => {

    return (
        <RichCell
            onClick={() => navigate(`/profile/${item.id}`)}
            before={<Avatar size={72} src={item.avatar.url} />}
            actions={showControls &&
                <ButtonGroup mode="horizontal" gap="s" stretched>
                    {item.friend_status === 1 &&
                        <Button mode="primary" size="s" onClick={e => {
                            e.stopPropagation();
                            addFriend(item)
                        }}>
                            Добавить
                        </Button>
                    }
                    <Button size="s" className={'Button--dangerous'} onClick={e => {
                        e.stopPropagation();
                        delFriend(item)
                    }}>
                        Удалить
                    </Button>
                </ButtonGroup>
            }
        >
            {item.first_name} {item.last_name}
        </RichCell>
    )
}

export const FriendsPage: React.FC<FriendsPageProps> = ({

})=> {
    const {userId} = useParams();
    const setPopout = useSetAtomState(popoutAtom);
    const [friends, setFriends] = useState<UserType[]>([]);
    const [isFetching, setIsFetching] = useState(false);
    const currentUser = useAtomValue(currentUserAtom);
    const navigate = useNavigate()


    useEffect(() => {
        setIsFetching(true);
        api.getFriends(Number(userId)).then(data => {
            setFriends(data);
            setIsFetching(false);
        }).catch(err => {
            setIsFetching(false);
        })
    }, [userId])

    const addFriend = (user: UserType) => {
        setPopout(<ScreenSpinner/>)
        api.addFriend(user.id).then(data => {
            setFriends([{...user, friend_status: data.friend_status}, ...friends.filter(item => item.id !== user.id)]);
            setPopout(null)
        }).catch(err => {
            setPopout(null)
        })
    }

    const delFriend = (user: UserType) => {
        setPopout(<ScreenSpinner/>)
        api.delFriend(user.id).then(data => {
            setFriends([{...user, friend_status: data.friend_status}, ...friends.filter(item => item.id !== user.id)]);
            setPopout(null)
        }).catch(err => {
            setPopout(null)
        })
    }

    const invoices = friends.filter(item => item.friend_status === 1)
    const others = friends.filter(item => item.friend_status === 2)

    return (
        <Page className={'Page FriendsPage'}>
            {invoices.length ?
                <Group header={<Header>Заявки в друзья</Header>}>
                    {invoices.map(item => (
                        <FriendCell item={item} navigate={navigate} key={item.id} addFriend={addFriend} delFriend={delFriend} showControls={Number(userId) === currentUser?.id}/>
                    ))}
                </Group>
                : null
            }
            {others.length ?
                <Group header={<Header>Друзья</Header>}>
                    {others.map(item => (
                        <FriendCell item={item} navigate={navigate} key={item.id} addFriend={addFriend} delFriend={delFriend} showControls={Number(userId) === currentUser?.id}/>
                    ))}
                </Group>
                : null
            }
            {(!others.length && !invoices.length) ?
                <Group>
                    <Placeholder header={'Увы и ах!'}>
                        Здесь ещё никого нет
                    </Placeholder>
                </Group>
                : null
            }
        </Page>
    )
}