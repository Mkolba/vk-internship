import React, {useEffect} from 'react';
import {Routes, Route, Navigate, useLocation, useNavigate} from 'react-router-dom';
import {
    LoginPage,
    NewsfeedPage,
    NotFoundPage,
    ProfilePage,
    RegistrationPage,
    EditProfilePage,
    FriendsPage,
    MainLayout
} from "./pages";
import {useAtomValue} from "@mntm/precoil";
import {popoutAtom} from "./store";
import {ConfigProvider, AdaptivityProvider, AppRoot, SplitLayout} from "@vkontakte/vkui";
import {Header} from "./components";
import {useScreenType} from "./hooks";
import {api} from "./api";

export const App: React.FC = () => {
  const popout = useAtomValue(popoutAtom);
  const screenType = useScreenType();
  const {pathname} = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
      api.authUser().then(data => {
          if (data.success && (pathname.indexOf('/login') > -1 || pathname.indexOf('/registration') > -1)) {
              const {payload} = api.getToken()
              navigate('/profile/' + payload['sub'])
          } else if (!data.success && !(pathname.indexOf('/login') > -1 || pathname.indexOf('/registration') > -1)) {
              navigate('/login/')
          }
      });
  })

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
                      <Route path={'newsfeed'} element={<NewsfeedPage/>}/>
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