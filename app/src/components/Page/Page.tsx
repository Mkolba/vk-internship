import React from "react";
import {
    ViewProps, Panel, View
} from "@vkontakte/vkui";
import './Page.scss';

export const Page: React.FC<Omit<ViewProps, 'activePanel'>> = ({
    id='',
    children,
    ...restProps
}) => {
    return (
        <View {...restProps} activePanel={id}>
            <Panel id={id}>
                {children}
            </Panel>
        </View>
    )
}