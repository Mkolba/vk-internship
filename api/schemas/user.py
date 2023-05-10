# -*- coding: utf-8 -*-

from typing import Optional, Union, Literal
from pydantic import BaseModel, EmailStr, Field, validator, UUID4
from datetime import datetime
from decorators import make_optional
from .photo import PhotoUploaded


class UserCreate(BaseModel):
    login: EmailStr
    password: str = Field(..., min_length=8)
    first_name: str
    last_name: str


class UserLogin(BaseModel):
    username: EmailStr
    password: str = Field(..., min_length=8)


class UserCounters(BaseModel):
    friends_incoming: int
    friends_total: int


class User(BaseModel):
    id: int
    avatar: Optional[PhotoUploaded]
    first_name: str
    last_name: str
    study_place: Optional[str]
    birthdate: Optional[datetime]
    city: Optional[str]
    friend_status: Optional[int]

    class Config:
        orm_mode = True

    @validator('avatar')
    def set_avatar(cls, avatar):
        return avatar or PhotoUploaded(url='https://test-vk-internship.hb.bizmrg.com/f922fddb-233c-4ae1-9be1-a490daea829b.png')


@make_optional(exclude=['avatar', 'id', 'friend_status'])
class UserUpdate(User):
    avatar_id: Optional[Union[UUID4, Literal["delete"]]]
    password: Optional[str] = Field(..., min_length=8)

    class Config:
        check_fields = False