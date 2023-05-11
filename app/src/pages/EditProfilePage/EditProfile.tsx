import React, {useState} from 'react';
import {
    Button,
    DateInput,
    FormItem,
    FormLayout,
    FormLayoutGroup, FormStatus,
    Group,
    Header,
    Input, Link, ScreenSpinner,
} from "@vkontakte/vkui";
import {useAtomState, useSetAtomState} from "@mntm/precoil";
import {currentUserAtom, popoutAtom} from "../../store";
import {api} from "../../api";
import {IUser} from "../../types";
import './EditProfile.scss';
import {useNavigate} from "react-router-dom";

interface EditProfileProps extends React.HTMLAttributes<HTMLDivElement> {

}

export const EditProfilePage: React.FC<EditProfileProps> = () => {
    const setPopout = useSetAtomState(popoutAtom);
    const [currentUser, setCurrentUser] = useAtomState(currentUserAtom);
    const [firstName, setFirstName] = useState(currentUser?.first_name);
    const [lastName, setLastName] = useState(currentUser?.last_name);
    const [studyPlace, setStudyPlace] = useState(currentUser?.study_place);
    const [city, setCity] = useState(currentUser?.city);
    const [showError, setShowError] = useState(false);
    const [birthdate, setBirthdate] = useState<Date | undefined>(() => {
        if (currentUser?.birthdate) return new Date(currentUser?.birthdate)
        return new Date()
    })

    const navigate = useNavigate();

    const edit = () => {
        if (!firstName || !lastName) {
            setShowError(true)
            return
        }
        let options = {
            first_name: firstName,
            last_name: lastName,
            study_place: studyPlace ? studyPlace : null,
            city: city ? city : null,
            birthdate: birthdate ? birthdate.toJSON().substring(0,10) : null
        }
        setShowError(false);
        setPopout(<ScreenSpinner/>)
        api.editUser(options).then(resp => {
            setCurrentUser(resp as IUser)
            setPopout(<ScreenSpinner state={'done'}/>)
            setTimeout(() => setPopout(null), 1000)
        }).catch(() => {
            setPopout(<ScreenSpinner state={'error'}/>)
            setTimeout(() => setPopout(null), 1000)
        })
    }

    return (
        <Group header={<Header>Редактирование профиля</Header>}>
            <FormLayout>
                <FormLayoutGroup mode="horizontal">
                    <FormItem top="Имя" status={showError && !firstName ? 'error' : 'default'}>
                        <Input placeholder={'Иван'} name={'name'} value={firstName} onChange={e => setFirstName(e.currentTarget.value.trim())}/>
                    </FormItem>
                    <FormItem top="Фамилия" status={showError && !lastName ? 'error' : 'default'}>
                        <Input placeholder={'Петров'} name={'lastname'} value={lastName} onChange={e => setLastName(e.currentTarget.value.trim())}/>
                    </FormItem>
                </FormLayoutGroup>
                <FormLayoutGroup mode="horizontal">
                    <FormItem top="Место учёбы" status={showError && !studyPlace ? 'error' : 'default'}>
                        <Input placeholder={'ПГНИУ'} value={studyPlace} onChange={e => setStudyPlace(e.currentTarget.value)}/>
                    </FormItem>
                    <FormItem top="Город" status={showError && !city ? 'error' : 'default'}>
                        <Input placeholder={'Пермь'} value={city} onChange={e => setCity(e.currentTarget.value)}/>
                    </FormItem>
                </FormLayoutGroup>
                <FormItem top="Дата рождения" status={showError && birthdate && birthdate > new Date() ? 'error' : 'default'}>
                    <DateInput
                        value={birthdate}
                        onChange={e => setBirthdate(e as Date)}
                        showNeighboringMonth
                        disableFuture
                    />
                </FormItem>

                <FormStatus>
                    Аватар можно изменить прямо с <Link onClick={() => navigate(`/profile/${currentUser?.id}`)}>вашей страницы</Link> — просто нажмите на него и выберите нужный подпункт в меню
                </FormStatus>

                <FormItem className={'ButtonFormItem'}>
                    <Button stretched={true} size={'l'} onClick={edit}>
                        Изменить данные
                    </Button>
                </FormItem>
            </FormLayout>
        </Group>
    )
}