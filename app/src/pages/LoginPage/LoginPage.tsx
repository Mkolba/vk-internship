import React, {useState} from 'react';
import './LoginPage.scss';
import {Page} from "../../components";
import {Card, FormLayout, FormItem, Input, Button, ScreenSpinner, Tappable, FormStatus} from "@vkontakte/vkui";
import {useSetAtomState} from "@mntm/precoil";
import {popoutAtom} from "../../store";
import {useNavigate} from "react-router-dom";
import {Icon16HideOutline, Icon16ViewOutline} from "@vkontakte/icons";
import {api} from "../../api";

interface LoginPageProps extends React.HTMLAttributes<HTMLDivElement> {

}

export const LoginPage: React.FC<LoginPageProps> = ({

})=> {
    const setPopout = useSetAtomState(popoutAtom);
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [showError, setShowError] = useState(false);
    const [errorText, setErrorText] = useState('');
    const navigate = useNavigate();

    const authorize = () => {
        if (login && password) {
            const data = new FormData();
            data.append('username', login)
            data.append('password', password)
            setPopout(<ScreenSpinner/>);
            api.login({formData: data}).then(data => {
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
        } else {
            setShowError(true);
        }
    }

    return (
        <Page className={'Page LoginPage'} id={'login'}>
            <div className={'AuthCard__Wrapper'}>
                <Card className={'AuthCard'}>
                    <div className={'AuthCard__Header'}>
                        Вход в NOTVK
                    </div>
                    <FormLayout>
                        {errorText &&
                            <FormStatus mode={'error'}>
                                {errorText}
                            </FormStatus>
                        }
                        <FormItem status={showError && !login ? 'error' : 'default'}>
                            <Input placeholder={'Логин'} name={'email'} value={login} onChange={e => setLogin(e.currentTarget.value)}/>
                        </FormItem>
                        <FormItem status={showError && !password ? 'error' : 'default'}>
                            <Input placeholder={'Пароль'} type={isPasswordVisible ? 'password' : 'text'} autoComplete="current-password" after={
                                <Tappable onClick={() => setPasswordVisible(!isPasswordVisible)}>
                                    {!isPasswordVisible ? <Icon16HideOutline/> : <Icon16ViewOutline/>}
                                </Tappable>
                            } onChange={e => setPassword(e.currentTarget.value)} value={password}/>
                        </FormItem>
                        <FormItem className={'ButtonFormItem'}>
                            <Button stretched={true} size={'l'} onClick={authorize}>
                                Войти
                            </Button>
                        </FormItem>
                    </FormLayout>
                </Card>
                <Card className={'AuthCard RegCard'}>
                    <Button size={'l'} stretched={true} className={'Button--commerce'} id={'reg-button'} onClick={() => navigate('/registration')}>
                        Зарегистрироваться
                    </Button>
                    <div className={'RegBenefits'}>
                        После регистрации вы получите доступ ко всем возможностям сайта
                    </div>
                </Card>
            </div>
        </Page>
    );
}