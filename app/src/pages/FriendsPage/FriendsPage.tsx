import React, {useEffect, useState} from 'react';
import './FriendsPage.scss';
import {Group, Header, Placeholder, ScreenSpinner, Spinner} from "@vkontakte/vkui";
import {IUser} from "../../types";
import {api} from "../../api";
import {useParams} from "react-router-dom";
import {useAtomValue, useSetAtomState} from "@mntm/precoil";
import {currentUserAtom, popoutAtom} from "../../store";
import {UserCell} from "../../components";


interface FriendsPageProps extends React.HTMLAttributes<HTMLDivElement> {

}

export const FriendsPage: React.FC<FriendsPageProps> = () => {
    const {userId} = useParams();
    const setPopout = useSetAtomState(popoutAtom);
    const [friends, setFriends] = useState<IUser[]>([]);
    const [isFetching, setIsFetching] = useState(false);
    const currentUser = useAtomValue(currentUserAtom);


    useEffect(() => {
        setIsFetching(true);
        api.getFriends(Number(userId)).then(data => {
            setFriends(data);
            setIsFetching(false);
        }).catch(() => {
            setIsFetching(false);
        })
    }, [userId])

    const addFriend = (user: IUser) => {
        setPopout(<ScreenSpinner/>)
        api.addFriend(user.id).then(data => {
            setFriends([{...user, friend_status: data.friend_status}, ...friends.filter(item => item.id !== user.id)]);
            setPopout(null)
        }).catch(() => {
            setPopout(null)
        })
    }

    const delFriend = (user: IUser) => {
        setPopout(<ScreenSpinner/>)
        api.delFriend(user.id).then(data => {
            setFriends([{...user, friend_status: data.friend_status}, ...friends.filter(item => item.id !== user.id)]);
            setPopout(null)
        }).catch(() => {
            setPopout(null)
        })
    }

    const invoices = friends.filter(item => item.friend_status === 1)
    const others = friends.filter(item => item.friend_status === 2)

    return (
        !isFetching ?
            <>
                {invoices.length ?
                    <Group header={<Header>Заявки в друзья</Header>}>
                        {invoices.map(item => (
                            <UserCell item={item} key={item.id} addFriend={addFriend} delFriend={delFriend} showControls={Number(userId) === currentUser?.id}/>
                        ))}
                    </Group>
                    : null
                }
                {others.length ?
                    <Group header={<Header>Друзья</Header>}>
                        {others.map(item => (
                            <UserCell item={item} key={item.id} addFriend={addFriend} delFriend={delFriend} showControls={Number(userId) === currentUser?.id}/>
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
            </>
        : <Placeholder icon={<Spinner/>}/>
    )
}