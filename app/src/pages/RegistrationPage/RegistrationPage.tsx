import React, {useState} from 'react';
import './RegistrationPage.scss';
import {Page} from "../../components";
import {Button, Card, FormItem, FormLayout, FormLayoutGroup, Input, Tappable} from "@vkontakte/vkui";
import {Icon16HideOutline, Icon16ViewOutline, Icon24Chevron} from "@vkontakte/icons";
import {useNavigate} from "react-router-dom";

interface RegistrationPageProps extends React.HTMLAttributes<HTMLDivElement> {

}

export const RegistrationPage: React.FC<RegistrationPageProps> = ({

})=> {
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [showError, setShowError] = useState(false);
    const navigate = useNavigate();

    const authorize = () => {
        if (login && password.length >= 8 && firstName && lastName) {
            setShowError(false);
        } else {
            setShowError(true);
        }
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
                        <FormLayoutGroup mode="horizontal">
                            <FormItem top="Имя" status={showError && !firstName ? 'error' : 'default'}>
                                <Input placeholder={'Иван'} name={'name'} value={firstName} onChange={e => setFirstName(e.currentTarget.value)}/>
                            </FormItem>
                            <FormItem top="Фамилия" status={showError && !lastName ? 'error' : 'default'}>
                                <Input placeholder={'Петров'} name={'lastname'} value={lastName} onChange={e => setLastName(e.currentTarget.value)}/>
                            </FormItem>
                        </FormLayoutGroup>
                        <FormItem status={showError && !login ? 'error' : 'default'}>
                            <Input placeholder={'E-mail'} name={'email'} value={login} onChange={e => setLogin(e.currentTarget.value)}/>
                        </FormItem>
                        <FormItem bottom={'Как минимум 8 символов'} status={showError && password.length < 8 ? 'error' : 'default'}>
                            <Input placeholder={'Пароль'} type={isPasswordVisible ? 'password' : 'text'} autoComplete="current-password" after={
                                <Tappable onClick={() => setPasswordVisible(!isPasswordVisible)}>
                                    {!isPasswordVisible ? <Icon16HideOutline/> : <Icon16ViewOutline/>}
                                </Tappable>
                            } value={password} onChange={e => setPassword(e.currentTarget.value)}/>
                        </FormItem>
                        <FormItem className={'ButtonFormItem'}>
                            <Button stretched={true} size={'l'} onClick={authorize}>
                                Зарегистрироваться
                            </Button>
                        </FormItem>
                    </FormLayout>
                </Card>
            </div>
        </Page>
    )
}