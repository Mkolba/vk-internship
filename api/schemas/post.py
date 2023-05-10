# -*- coding: utf-8 -*-
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, root_validator, UUID4
from . import PhotoUploaded, User


class Post(BaseModel):
    id: int
    creator_id: int
    wall_id: int
    text: Optional[str]
    date: datetime
    photo: Optional[PhotoUploaded]
    creator: User
    is_liked: bool
    likes_count: int

    @root_validator
    def check_text_or_photo_attached(cls, values):
        if 'text' not in values and 'photo' not in values:
            raise ValueError('Photo or text should be specified')
        return values

    class Config:
        orm_mode = True


class PostLike(BaseModel):
    id: int

    class Config:
        orm_mode = True


class PostList(BaseModel):
    posts: List[Post]

    class Config:
        orm_mode = True


class PostCreate(BaseModel):
    text: Optional[str]
    photo: Optional[UUID4]

    @root_validator
    def check_text_or_photo_attached(cls, values):
        if 'text' not in values and 'photo' not in values:
            raise ValueError('Photo or text should be specified')
        return values