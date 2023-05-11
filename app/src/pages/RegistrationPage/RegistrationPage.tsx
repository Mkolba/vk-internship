import React, {useState} from 'react';
import './RegistrationPage.scss';
import {Page} from "../../components";
import {
    Button,
    Card,
    DateInput,
    FormItem,
    FormLayout,
    FormLayoutGroup, FormStatus,
    Input,
    Tappable
} from "@vkontakte/vkui";
import {Icon16HideOutline, Icon16ViewOutline, Icon24Chevron} from "@vkontakte/icons";
import {useNavigate} from "react-router-dom";
import {api} from "../../api";
import {useSetAtomState} from "@mntm/precoil";
import {popoutAtom} from "../../store";

interface RegistrationPageProps extends React.HTMLAttributes<HTMLDivElement> {

}

export const RegistrationPage: React.FC<RegistrationPageProps> = () => {
    const setPopout = useSetAtomState(popoutAtom);
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [showError, setShowError] = useState(false);
    const [birthdate, setBirthdate] = useState<Date | undefined>(() => new Date())
    const [errorText, setErrorText] = useState('');
    const navigate = useNavigate();

    const createUser = () => {
        if (!login || password.length < 8 || !firstName || !lastName) {
            setShowError(true)
            return
        }
        let options = {
            first_name: firstName,
            last_name: lastName,
            birthdate: birthdate ? birthdate.toJSON().substring(0,10) : undefined,
            password: password,
            login: login
        }

        api.register(options).then(() => {
            const {payload} = api.getToken()
            setPopout(null);
            navigate(`/profile/${payload['sub']}`)
        }).catch(error => {
            setPopout(null);
            error.then((err: any) => {
                if (err.detail) {
                    setErrorText(err.detail)
                }
            })
        })
    }

    return (
        <Page className={'Page RegistrationPage'}>
            <div className={'RegCard__Wrapper'}>
                <Card className={'RegCard'}>
                    <div className={'RegCard__Header'}>
                        <Button mode={'tertiary'} onClick={() => navigate(-1)}>
                            <Icon24Chevron/>
                        </Button>
                        Регистрация в NOTVK
                    </div>
                    <FormLayout>
                        {errorText &&
                            <FormStatus mode={'error'}>
                                {errorText}
                            </FormStatus>
                        }
                        <FormLayoutGroup mode="horizontal">
                            <FormItem top="Имя" status={showError && !firstName ? 'error' : 'default'}>
                                <Input placeholder={'Иван'} name={'name'} value={firstName} onChange={e => setFirstName(e.currentTarget.value.trim())}/>
                            </FormItem>
                            <FormItem top="Фамилия" status={showError && !lastName ? 'error' : 'default'}>
                                <Input placeholder={'Петров'} name={'lastname'} value={lastName} onChange={e => setLastName(e.currentTarget.value.trim())}/>
                            </FormItem>
                        </FormLayoutGroup>
                        <FormItem status={showError && birthdate && birthdate > new Date() ? 'error' : 'default'} top={'Дата рождения'}>
                            <DateInput
                                value={birthdate}
                                onChange={setBirthdate}
                                showNeighboringMonth
                                disableFuture
                            />
                        </FormItem>
                        <FormItem status={showError && !login ? 'error' : 'default'}>
                            <Input placeholder={'E-mail'} name={'email'} value={login} onChange={e => setLogin(e.currentTarget.value.trim())}/>
                        </FormItem>
                        <FormItem bottom={'Как минимум 8 символов'} status={showError && password.length < 8 ? 'error' : 'default'}>
                            <Input placeholder={'Пароль'} type={isPasswordVisible ? 'text' : 'password'} autoComplete="current-password" after={
                                <Tappable onClick={() => setPasswordVisible(!isPasswordVisible)}>
                                    {isPasswordVisible ? <Icon16HideOutline/> : <Icon16ViewOutline/>}
                                </Tappable>
                            } value={password} onChange={e => setPassword(e.currentTarget.value)}/>
                        </FormItem>
                        <FormItem className={'ButtonFormItem'}>
                            <Button stretched={true} size={'l'} onClick={createUser}>
                                Зарегистрироваться
                            </Button>
                        </FormItem>
                    </FormLayout>
                </Card>
            </div>
        </Page>
    )
}