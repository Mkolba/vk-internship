import React from 'react';
import './ProfilePage.scss';
import {FriendsCard, PostEditor} from "../../components";
import {Group, Header, Placeholder, SplitCol, SplitLayout} from "@vkontakte/vkui";
import {useAtomValue} from "@mntm/precoil";
import {currentUserAtom} from "../../store";
import {UserCard} from "../../components/UserCard/UserCard";
import {Icon56NewsfeedOutline} from "@vkontakte/icons";
import {useParams} from "react-router-dom";
import {useScreenType} from "../../hooks";

interface ProfilePageProps extends React.HTMLAttributes<HTMLDivElement> {

}

export const ProfilePage: React.FC<ProfilePageProps> = ({

})=> {
    const {userId} = useParams();
    const screenType = useScreenType();
    const currentUser = useAtomValue(currentUserAtom);
    const user = currentUser?.id === Number(userId) ? currentUser : null;
    return (
        <>
            {user &&
                <>
                    <UserCard user={user}/>
                    <SplitLayout className={'ProfileLayout'}>
                        <SplitCol maxWidth={screenType === 'desktop' ? 700 : '100%'} width={'100%'} className={'Profile__column'} stretchedOnMobile>
                            {screenType === 'mobile' &&
                                <FriendsCard user={user}/>
                            }
                            <PostEditor/>
                            <Group header={<Header mode={'secondary'}>Ваша стена</Header>}>
                                <Placeholder icon={<Icon56NewsfeedOutline/>}>
                                    На стене пока нет ни одной записи
                                </Placeholder>
                            </Group>
                        </SplitCol>
                        {screenType === 'desktop' &&
                            <SplitCol autoSpaced className={'Profile__column'}>
                                <FriendsCard user={user}/>
                            </SplitCol>
                        }
                    </SplitLayout>
                </>
            }
        </>
    )
}