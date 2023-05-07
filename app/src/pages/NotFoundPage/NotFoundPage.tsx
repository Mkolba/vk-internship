import React from 'react';
import {Page} from '../../components';
import { Icon28GhostSimpleOutline } from '@vkontakte/icons';
import {Button, Placeholder} from "@vkontakte/vkui";
import './NotFoundPage.scss';
import {useNavigate} from "react-router-dom";

interface NotFoundPageProps extends React.HTMLAttributes<HTMLDivElement> {

}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
    ...restProps
})=> {
    const navigate = useNavigate();
    return (
        <Page className={'Page NotFoundPage'} id={'404'} {...restProps}>
            <Placeholder icon={<Icon28GhostSimpleOutline width={128} height={128} className={'NotFoundGhost'}/>} stretched={true} action={
                <Button mode={'tertiary'} onClick={() => navigate(-1)}>
                    Вернуться
                </Button>
            }>
                Такой страницы не существует
            </Placeholder>
        </Page>
    )
}