import React, {useState} from 'react';
import './ProfilePage.scss';
import {FriendsCard, NavMenu, Page} from "../../components";
import {Avatar, Button, Group, Header, Placeholder, SplitCol, SplitLayout, Textarea} from "@vkontakte/vkui";
import {useAtomValue} from "@mntm/precoil";
import {currentUserAtom} from "../../store";
import {UserCard} from "../../components/UserCard/UserCard";
import {Icon56NewsfeedOutline} from "@vkontakte/icons";
import {PostEditor} from "../../components/PostEditor/PostEditor";
import {useNavigate, useParams} from "react-router-dom";

interface ProfilePageProps extends React.HTMLAttributes<HTMLDivElement> {

}

export const ProfilePage: React.FC<ProfilePageProps> = ({

})=> {
    const navigate = useNavigate();
    const {userId} = useParams();
    const currentUser = useAtomValue(currentUserAtom);
    const user = currentUser?.id === Number(userId) ? currentUser : null
    return (
        <Page className={'Page ProfilePage'}>
            <SplitLayout className={'PageLayout'}>
                <NavMenu/>
                <SplitCol width={'100%'} autoSpaced>
                    {user &&
                        <>
                            <UserCard user={user}/>
                            <SplitLayout className={'ProfileLayout'}>
                                <SplitCol maxWidth={700} width={'100%'} className={'Profile__column'}>
                                    <PostEditor/>
                                    <Group header={<Header mode={'secondary'}>Ваша стена</Header>}>
                                        <Placeholder icon={<Icon56NewsfeedOutline/>}>
                                            На стене пока нет ни одной записи
                                        </Placeholder>
                                    </Group>
                                </SplitCol>
                                <SplitCol autoSpaced className={'Profile__column'}>
                                    <FriendsCard user={user}/>
                                </SplitCol>
                            </SplitLayout>
                        </>
                    }
                </SplitCol>
            </SplitLayout>
        </Page>
    )
}