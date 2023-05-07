import React from 'react';
import {Routes, Route, Navigate, useLocation} from 'react-router-dom';
import {DialogPage, LoginPage, MessengerPage, NewsfeedPage, NotFoundPage, ProfilePage, RegistrationPage} from "./pages";
import {useAtomValue} from "@mntm/precoil";
import {popoutAtom} from "./store";
import {ConfigProvider, AdaptivityProvider, AppRoot, SplitLayout} from "@vkontakte/vkui";
import {Header} from "./components";

export const App: React.FC = () => {
  const popout = useAtomValue(popoutAtom);
  return (
      <ConfigProvider appearance="light">
        <AdaptivityProvider>
          <AppRoot>
            <Header/>
            <SplitLayout popout={popout} className={'MainLayout'}>
              <Routes>
                  <Route path={'*'} element={<NotFoundPage/>}/>
                  <Route path={'/login'} element={<LoginPage/>}/>
                  <Route path={'/registration'} element={<RegistrationPage/>}/>
                  <Route path={'/profile/:userId'} element={<ProfilePage/>}/>
                  <Route path="/" element={<Navigate to="/login" replace={true}/>} />
              </Routes>
            </SplitLayout>
          </AppRoot>
        </AdaptivityProvider>
      </ConfigProvider>
  );
}