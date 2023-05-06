import React from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import {DialogPage, LoginPage, MessengerPage, NewsfeedPage, NotFoundPage, ProfilePage, RegistrationPage} from "./pages";
import {useAtomValue} from "@mntm/precoil";
import {popoutAtom} from "./store";
import {ConfigProvider, AdaptivityProvider, AppRoot, SplitLayout} from "@vkontakte/vkui";

export const App: React.FC = () => {
  const popout = useAtomValue(popoutAtom);
  return (
      <ConfigProvider platform="ios">
        <AdaptivityProvider>
          <AppRoot>
            <SplitLayout popout={popout}>
              <Routes>
                  <Route path={'*'} element={<NotFoundPage/>}/>
                  <Route path={'/login'} element={<LoginPage/>}/>
                  <Route path={'/registration'} element={<RegistrationPage/>}/>
                  <Route path="/" element={<Navigate to="/login" replace={true}/>} />
              </Routes>
            </SplitLayout>
          </AppRoot>
        </AdaptivityProvider>
      </ConfigProvider>
  );
}