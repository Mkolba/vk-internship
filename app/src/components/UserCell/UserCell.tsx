import React from "react";
import {AnyFunction, IUser} from "../../types";
import {useNavigate} from "react-router-dom";
import {Avatar, Button, ButtonGroup, RichCell} from "@vkontakte/vkui";


interface UserCellProps extends React.HTMLAttributes<HTMLDivElement> {
    item: IUser,
    delFriend: AnyFunction,
    addFriend: AnyFunction,
    showControls: boolean
}


export const UserCell: React.FC<UserCellProps> = ({
    item,
    delFriend,
    addFriend,
    showControls
}) => {
    const navigate = useNavigate()
    return (
        <RichCell
            onClick={() => navigate(`/profile/${item.id}`)}
            before={<Avatar size={72} src={item.avatar.url} />}
            actions={showControls &&
                <ButtonGroup mode="horizontal" gap="s" stretched>
                    {[0, 1].includes(item.friend_status as number) &&
                        <Button mode="primary" size="s" onClick={e => {
                            e.stopPropagation();
                            addFriend(item)
                        }}>
                            {item.friend_status === 0 ? 'Добавить в друзья' : 'Одобрить заявку'}
                        </Button>
                    }
                    {[1, 2, 3].includes(item.friend_status as number) &&
                        <Button size="s" className={'Button--dangerous'} onClick={e => {
                            e.stopPropagation();
                            delFriend(item)
                        }}>
                            {item.friend_status === 1 ? 'Отклонить заявку' : item.friend_status === 2 ? 'Удалить из друзей' : 'Отозвать заявку'}
                        </Button>
                    }
                </ButtonGroup>
            }
        >
            {item.first_name} {item.last_name}
        </RichCell>
    )
}