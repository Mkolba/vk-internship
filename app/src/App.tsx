import React, {useEffect} from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import {DialogPage, LoginPage, MessengerPage, NewsfeedPage, NotFoundPage, ProfilePage} from "./pages";
import { Layout } from "./components";
import './styles/colors.scss'
import {useAtomState} from "@mntm/precoil";
import {themeAtom} from "./store";

export const App: React.FC = () => {
  const [theme, setTheme] = useAtomState(themeAtom);
  useEffect(() => {
    if (!document.body.getAttribute('theme')) {
      const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
      if (darkThemeMq.matches) {
        setTheme('dark');
      } else {
        setTheme('light');
      }
    }
    document.body.setAttribute('theme', theme);
  }, [theme])

  return (
      <Layout>
        <Routes>
          <Route path='*' element={<NotFoundPage/>} />

          <Route path={'/login'} element={<LoginPage/>}/>

          <Route path={'/newsfeed'} element={<NewsfeedPage/>}/>

          <Route path={'/dialogs'}>
            <Route index element={<MessengerPage/>}/>
            <Route path={':{id}'} element={<DialogPage/>}/>
          </Route>

          <Route path={'/profile'} element={<ProfilePage/>}/>

          <Route path="/" element={<Navigate to="/login" replace={true}/>}/>
        </Routes>
      </Layout>
  );
}