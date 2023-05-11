import React from "react";
import {AnyFunction, IUser} from "../../types";
import './UserCard.scss';
import {Avatar, Button, Group, Cell, ScreenSpinner} from "@vkontakte/vkui";
import {
    Icon24CancelOutline,
    Icon24DeleteOutline,
    Icon24EducationOutline,
    Icon24PenOutline,
    Icon24PlaceOutline,
    Icon24UserAddOutline
} from "@vkontakte/icons";
import {Popover} from "@vkontakte/vkui/dist/components/Popover/Popover";
import {useScreenType} from "../../hooks";
import {useAtomState, useSetAtomState} from "@mntm/precoil";
import {currentUserAtom, popoutAtom} from "../../store";
import {api} from "../../api";
import {useNavigate} from "react-router-dom";

export function declOfAge(n: number) {
    let text_forms = ['год', 'года', 'лет'];
    n = Math.abs(n) % 100;
    let n1 = n % 10;
    if (n > 10 && n < 20) { return text_forms[2]; }
    if (n1 > 1 && n1 < 5) { return text_forms[1]; }
    if (n1 === 1) { return text_forms[0]; }
    return text_forms[2];
}

function getAge(birthdate: string) {
    const date = new Date(birthdate);
    let diff = Date.now() - date.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

interface UserCardProps extends React.HTMLAttributes<HTMLDivElement> {
    user: IUser,
    setUser: AnyFunction
}

export const UserCard: React.FC<UserCardProps> = ({
    user,
    setUser
}) => {
    const setPopout = useSetAtomState(popoutAtom);
    const [currentUser, setCurrentUser] = useAtomState(currentUserAtom);
    const screenType = useScreenType();
    const navigate = useNavigate();

    const addFriend = () => {
        setPopout(<ScreenSpinner/>)
        api.addFriend(user.id).then(data => {
            user.friend_status = data.friend_status
            setCurrentUser(currentUser)
            setPopout(null)
        }).catch(() => {
            setPopout(null)
        })
    }

    const delFriend = () => {
        setPopout(<ScreenSpinner/>)
        api.delFriend(user.id).then(data => {
            user.friend_status = data.friend_status
            setCurrentUser(currentUser)
            setPopout(null)
        }).catch(() => {
            setPopout(null)
        })
    }

    const onEditAvatar = () => {
        let input = document.createElement('input');
        input.accept = 'image/png,image/jpeg,image/jpg';
        input.multiple = true;
        input.onchange = (e: any) => editAvatar(e.target.files[0]);
        input.type = 'file';
        input.click();
    }

    const editAvatar = (file: any) => {
        const data = new FormData()
        data.append('file', file)
        api.uploadPhoto(data).then(data => {
            api.editUser({avatar_id: data.id}).then(resp => {
                setCurrentUser(resp as IUser)
                setUser(resp as IUser)
            })
        })
    }

    const delAvatar = () => {
        api.editUser({avatar_id: 'delete'}).then(resp => {
            setCurrentUser(resp as IUser)
            setUser(resp as IUser)
        })
    }

    return (
        <Group className={'UserCard__wrapper'}>
            <div className={'UserInfo__cover'}/>
            <div className={'UserCard'}>
                <div className={'UserInfo__general'}>
                    <div className={'UserInfo__avatar'}>
                        {
                            user.id === currentUser?.id ?
                                <Popover action={'hover'} content={
                                    <>
                                        <Cell before={<Icon24PenOutline/>} onClick={onEditAvatar}>Обновить фотографию</Cell>
                                        <Cell before={<Icon24DeleteOutline fill={'red'}/>} onClick={delAvatar}>Удалить фотографию</Cell>
                                    </>
                                }>
                                    <Avatar src={user.avatar ? user.avatar.url : 'https://vk.com/images/camera_200.png'} size={screenType === 'desktop' ? 128 : 96}/>
                                </Popover>
                            :
                                <Avatar src={user.avatar ? user.avatar.url : 'https://vk.com/images/camera_200.png'} size={screenType === 'desktop' ? 128 : 96}/>
                        }
                    </div>
                    <div className={'UserInfo'}>
                        <div className={'UserInfo__name'} title={`${user.first_name} ${user.last_name}`}>
                            <span>{user.first_name} {user.last_name}</span>
                            {user.birthdate &&
                                <div className={'UserInfo__age'}>
                                    {getAge(user.birthdate)} {declOfAge(getAge(user.birthdate))}
                                </div>
                            }
                        </div>
                        <div className={'UserInfo__other'}>
                            {user.city &&
                                <div className={'UserInfo__other__item'} title={user.city}>
                                    <Icon24PlaceOutline/> <span>{user.city}</span>
                                </div>
                            }
                            {user.study_place &&
                                <div className={'UserInfo__other__item'} title={user.study_place}>
                                    <Icon24EducationOutline/> <span>{user.study_place}</span>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div className={'UserInfo__controls'}>
                    {currentUser?.id === user.id &&
                        <Button size={'m'} mode={'secondary'} before={<Icon24PenOutline/>} stretched={screenType === 'mobile'} onClick={() => navigate('/edit')}>
                            Редактировать
                        </Button>
                    }
                    {currentUser?.id !== user.id &&
                        <>
                            {(!user.friend_status || [0, 1].includes(user.friend_status)) ?
                                <Button size={'m'} before={<Icon24UserAddOutline/>} mode={'secondary'} onClick={addFriend} stretched={screenType === 'mobile'}>
                                    {user.friend_status === 0 ? 'Добавить в друзья' : 'Одобрить заявку'}
                                </Button>
                                : null
                            }
                            {(user.friend_status && [1, 2, 3].includes(user.friend_status)) ?
                                <Button size={'m'} before={<Icon24CancelOutline/>} className={'Button--dangerous'} onClick={delFriend} stretched={screenType === 'mobile'}>
                                    {user.friend_status === 1 ?
                                        'Отклонить заявку'
                                        : user.friend_status === 2 ?
                                            'Удалить из друзей'
                                            :
                                            'Отозвать заявку'
                                    }
                                </Button>
                                : null
                            }
                        </>
                    }
                </div>
            </div>
        </Group>
    )
}