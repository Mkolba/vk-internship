import React from "react";
import {Group, Header, Placeholder, Avatar, Tappable} from "@vkontakte/vkui";
import {UserType} from "../../types";
import {useNavigate} from "react-router-dom";
import './FriendsCard.scss';

interface FriendsCardProps extends React.HTMLAttributes<HTMLDivElement> {
    user: UserType
}
export const FriendsCard: React.FC<FriendsCardProps> = ({
    user,
    ...restProps
}) => {
    const friends = [1,2,3,4]
    const navigate = useNavigate();
    return (
        <Group header={<Header onClick={() => navigate('/friends')} indicator={11}>Друзья</Header>} {...restProps}>
            {friends.length ?
                <div className={'FriendsCard__list'}>
                    {friends.map(item => (
                        <Tappable className={'FriendsCard__list__item'} key={item} onClick={() => navigate(`/profile/${item}`)}>
                            <Avatar src={'https://vk.com/images/camera_200.png'} size={64}/>
                            Друг
                        </Tappable>
                    ))}
                </div>
                :
                <Placeholder>
                    У вас нет друзей
                </Placeholder>
            }
        </Group>
    )
}
