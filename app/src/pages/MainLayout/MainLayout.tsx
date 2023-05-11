import React from 'react';
import {NavMenu, Page} from "../../components";
import {SplitCol, SplitLayout, Epic, TabbarItem, Tabbar} from "@vkontakte/vkui";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {useScreenType} from "../../hooks";
import {
    Icon28NewsfeedOutline,
    Icon28UserCircleOutline,
    Icon28UsersOutline
} from "@vkontakte/icons";
import {useAtomValue} from "@mntm/precoil";
import {currentUserAtom} from "../../store";

interface MainLayoutProps extends React.HTMLAttributes<HTMLDivElement> {

}

export const MainLayout: React.FC<MainLayoutProps> = () => {
    const screenType = useScreenType();
    const navigate = useNavigate();
    const location = useLocation().pathname.split("/")[1];
    const user = useAtomValue(currentUserAtom);
    return (
        <Page className={'MainLayout'}>
            <SplitLayout className={'PageLayout'}>
                {screenType === 'desktop' && <NavMenu/> }
                <SplitCol width={'100%'} autoSpaced stretchedOnMobile>
                    <Epic activeStory={'main'} tabbar={screenType === 'mobile' && (
                        <Tabbar>
                            <TabbarItem
                                onClick={() => navigate(`/profile/${user?.id}`)}
                                selected={location === 'profile'}
                                text="Профиль"
                            >
                                <Icon28UserCircleOutline/>
                            </TabbarItem>
                            <TabbarItem
                                onClick={() => navigate('/newsfeed')}
                                selected={location === 'newsfeed'}
                                text="Новости"
                            >
                                <Icon28NewsfeedOutline/>
                            </TabbarItem>
                            <TabbarItem
                                onClick={() => navigate(`/friends/${user?.id}`)}
                                selected={location === 'friends'}
                                text="Друзья"
                            >
                                <Icon28UsersOutline/>
                            </TabbarItem>
                        </Tabbar>
                    )}>
                        <Page id={'main'}>
                            <Outlet/>
                        </Page>
                    </Epic>
                </SplitCol>
            </SplitLayout>
        </Page>
    )
}