from datetime import timedelta
from typing import Annotated

from fastapi.security import OAuth2PasswordRequestForm
from fastapi import APIRouter, Depends, HTTPException

from storage.models import User

from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import and_

from api import deps
import security
import schemas
import config

router = APIRouter()


@router.post("/login/access-token", response_model=schemas.Token)
async def login_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: AsyncSession = Depends(deps.get_db)) -> schemas.Token:
    user = await db.execute(select(User).where(
        and_(User.login == form_data.username))
    )
    user = user.scalar()

    if not user:
        raise HTTPException(status_code=400, detail="Неправильный логин или пароль")
    elif not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Неправильный логин или пароль")

    access_token_expires = timedelta(minutes=config.ACCESS_TOKEN_EXPIRE_MINUTES)
    return schemas.Token(
        access_token=security.create_access_token(user.id, expires_delta=access_token_expires),
        token_type="bearer"
    )


@router.post('/register')
async def register(data: schemas.UserCreate, db: AsyncSession = Depends(deps.get_db)):
    user = User(
        login=data.login,
        hashed_password=security.get_password_hash(data.password),
        first_name=data.first_name,
        last_name=data.last_name
    )
    db.add(user)
    try:
        await db.commit()
    except IntegrityError:
        raise HTTPException(status_code=400, detail="Пользователь с таким логином уже существует")
    access_token_expires = timedelta(minutes=config.ACCESS_TOKEN_EXPIRE_MINUTES)
    return schemas.Token(
        access_token=security.create_access_token(user.id, expires_delta=access_token_expires),
        token_type="bearer"
    )
