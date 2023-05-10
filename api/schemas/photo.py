# -*- coding: utf-8 -*-
from pydantic import BaseModel, UUID4


class Photo(BaseModel):
    id: UUID4
    uploaded_by: int
    url: str

    class Config:
        orm_mode = True


class PhotoUploaded(BaseModel):
    url: str

    class Config:
        orm_mode = True
