import React, {useEffect} from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import {
    DialogPage,
    LoginPage,
    MessengerPage,
    NewsfeedPage,
    NotFoundPage,
    ProfilePage,
    RegistrationPage,
    EditProfilePage,
    FriendsPage
} from "./pages";
import {useAtomValue} from "@mntm/precoil";
import {popoutAtom} from "./store";
import {ConfigProvider, AdaptivityProvider, AppRoot, SplitLayout} from "@vkontakte/vkui";
import {Header} from "./components";
import {MainLayout} from "./pages/MainLayout/MainLayout";
import {useScreenType} from "./hooks";
import {api} from "./api";

export const App: React.FC = () => {
  const popout = useAtomValue(popoutAtom);
  const screenType = useScreenType();

  useEffect(() => {
      api.authUser();
  }, [])

  return (
      <ConfigProvider appearance="light" platform="vkcom">
        <AdaptivityProvider>
          <AppRoot>
            {screenType === 'desktop' && <Header/>}
            <SplitLayout popout={popout} className={'MainLayout'}>
              <Routes>
                  <Route path={'*'} element={<NotFoundPage/>}/>
                  <Route path={'/login'} element={<LoginPage/>}/>
                  <Route path={'/registration'} element={<RegistrationPage/>}/>
                  <Route path={'/'} element={<MainLayout/>}>
                      <Route path={'profile/:userId'} element={<ProfilePage/>}/>
                      <Route path={'edit'} element={<EditProfilePage/>}/>
                      <Route path={'messenger'} element={<MessengerPage/>}/>
                      <Route path={'newsfeed'} element={<NewsfeedPage/>}/>
                      <Route path={'messenger/:userId'} element={<DialogPage/>}/>
                      <Route path={'friends/:userId'} element={<FriendsPage/>}/>
                      <Route path="/" element={<Navigate to="/login" replace={true}/>} />
                  </Route>
              </Routes>
            </SplitLayout>
          </AppRoot>
        </AdaptivityProvider>
      </ConfigProvider>
  );
}