import React from 'react';
import {Page} from '../../components';
import { Icon28GhostSimpleOutline } from '@vkontakte/icons';
import {Placeholder} from "@vkontakte/vkui";
import './NotFoundPage.scss';

interface NotFoundPageProps extends React.HTMLAttributes<HTMLDivElement> {

}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
    ...restProps
})=> {
    return (
        <Page className={'Page NotFoundPage'} id={'404'} {...restProps}>
            <Placeholder icon={<Icon28GhostSimpleOutline width={128} height={128} className={'NotFoundGhost'}/>} stretched={true}>
                Такой страницы не существует
            </Placeholder>
        </Page>
    )
}