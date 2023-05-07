import React from "react";
import {UserType} from "../../types";
import './UserCard.scss';
import {Avatar, Button, Group, Cell} from "@vkontakte/vkui";
import {Icon24DeleteOutline, Icon24EducationOutline, Icon24PenOutline, Icon24PlaceOutline} from "@vkontakte/icons";
import {Popover} from "@vkontakte/vkui/dist/components/Popover/Popover";

export function declOfAge(n: number) {
    let text_forms = ['год', 'года', 'лет'];
    n = Math.abs(n) % 100;
    let n1 = n % 10;
    if (n > 10 && n < 20) { return text_forms[2]; }
    if (n1 > 1 && n1 < 5) { return text_forms[1]; }
    if (n1 === 1) { return text_forms[0]; }
    return text_forms[2];
}

interface UserCardProps extends React.HTMLAttributes<HTMLDivElement> {
    user: UserType
}

export const UserCard: React.FC<UserCardProps> = ({
    user
}) => {
    return (
        <Group className={'UserCard__wrapper'}>
            <div className={'UserInfo__cover'}/>
            <div className={'UserCard'}>
                <div className={'UserInfo__avatar'}>
                    <Popover action={'hover'} content={
                        <>
                            <Cell before={<Icon24PenOutline/>}>Обновить фотографию</Cell>
                            <Cell before={<Icon24DeleteOutline fill={'red'}/>}>Удалить фотографию</Cell>
                        </>
                    }>
                        <Avatar src={user.avatar ? user.avatar : 'https://vk.com/images/camera_200.png'} size={128}/>
                    </Popover>
                </div>
                <div className={'UserInfo'}>
                    <div className={'UserInfo__name'}>
                        {user.first_name} {user.last_name}
                        {user.age &&
                            <div className={'UserInfo__age'}>
                                {user.age} {declOfAge(user.age)}
                            </div>
                        }
                    </div>
                    <div className={'UserInfo__other'}>
                        {user.city &&
                            <div className={'UserInfo__other__item'}>
                                <Icon24PlaceOutline/> {user.city}
                            </div>
                        }
                        {user.study_place &&
                            <div className={'UserInfo__other__item'}>
                                <Icon24EducationOutline/> {user.study_place}
                            </div>
                        }
                    </div>
                </div>
                <div className={'UserCard__Controls'}>
                    <Button before={<Icon24PenOutline/>} mode={"secondary"} size={'l'}>
                        Редактировать
                    </Button>
                </div>
            </div>
        </Group>
    )
}