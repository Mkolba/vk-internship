from fastapi import APIRouter

from .endpoints import login, user, friends, posts, photos, newsfeed

api_router = APIRouter()
api_router.include_router(login.router, tags=["Авторизация"])
api_router.include_router(user.router, tags=["Пользователи"], prefix='/user')
api_router.include_router(friends.router, tags=["Друзья"], prefix='/friends')
api_router.include_router(posts.router, tags=["Публикации"], prefix='/posts')
api_router.include_router(newsfeed.router, tags=["Лента"], prefix='/newsfeed')
api_router.include_router(photos.router, tags=["Фотографии"], prefix='/photos')
