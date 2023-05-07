import React from "react";
import {
    ViewProps, Panel, View
} from "@vkontakte/vkui";
import './Page.scss';

export const Page: React.FC<Omit<ViewProps, 'activePanel'>> = ({
    id='',
    children,
    className,
    ...restProps
}) => {
    return (
        <View {...restProps} activePanel={id} id={id}>
            <Panel id={id} className={'Page' + (className ? ` ${className}` : '')}>
                {children}
            </Panel>
        </View>
    )
}