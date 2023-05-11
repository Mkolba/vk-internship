import React, {useState} from 'react';
import {FormItem, Group, Input, Placeholder, ScreenSpinner, Spinner} from "@vkontakte/vkui";
import {IUser} from "../../types";
import {api} from "../../api";
import {useSetAtomState} from "@mntm/precoil";
import {popoutAtom} from "../../store";
import {UserCell} from "../../components";
import './SearchPage.scss';
import InfiniteScroll from "react-infinite-scroll-component";


interface SearchPageProps extends React.HTMLAttributes<HTMLDivElement> {

}

export const SearchPage: React.FC<SearchPageProps> = () => {
    const setPopout = useSetAtomState(popoutAtom);
    const [users, setUsers] = useState<IUser[]>([]);
    const [isFetching, setIsFetching] = useState(false);
    const [search, setSearch] = useState('');
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [searchTimeout, setSearchTimeout] = useState<null | NodeJS.Timeout>(null);

    const addFriend = (user: IUser) => {
        setPopout(<ScreenSpinner/>)
        api.addFriend(user.id).then(data => {
            setUsers([{...user, friend_status: data.friend_status}, ...users.filter(item => item.id !== user.id)]);
            setPopout(null)
        }).catch(() => {
            setPopout(null)
        })
    }

    const delFriend = (user: IUser) => {
        setPopout(<ScreenSpinner/>)
        api.delFriend(user.id).then(data => {
            setUsers([{...user, friend_status: data.friend_status}, ...users.filter(item => item.id !== user.id)]);
            setPopout(null)
        }).catch(() => {
            setPopout(null)
        })
    }

    const getUsers = (q: string) => {
        setIsFetching(true)
        api.searchUsers(q).then(data => {
            setHasMore(!(data.length < 20))
            setUsers(data)
            setIsFetching(false)
        })
    }

    const updateUsers = () => {
        api.searchUsers(search, offset + 20).then(data => {
            setHasMore(!(data.length < 20))
            setOffset(offset + 20)
            setUsers([...users, ...data])
        })
    }

    const onSearchChange = (value: string) => {
        setSearch(value);
        if (searchTimeout) clearTimeout(searchTimeout);
        if (!value) setIsFetching(false);
        if (value) {
            setSearchTimeout(setTimeout(() => getUsers(value), 300));
            setIsFetching(true);
        }
    }

    const filtered = users.map(item => (
        <UserCell item={item} delFriend={delFriend} addFriend={addFriend} showControls={true} key={item.id}/>
    ))

    return (
        <Group>
            <FormItem>
                <Input placeholder={'Поиск'} value={search} onChange={e => onSearchChange(e.target.value)}/>
            </FormItem>
            {
                !search ?
                    <Placeholder>
                        Введите поисковый запрос
                    </Placeholder>
                : isFetching ?
                    <Placeholder icon={<Spinner/>}/>
                : !filtered.length ?
                    <Placeholder>
                        Нет результатов
                    </Placeholder>
                :
                    <InfiniteScroll next={updateUsers} hasMore={hasMore} loader={<Spinner/>} dataLength={filtered.length}>
                        {filtered}
                    </InfiniteScroll>
            }
        </Group>
    )
}