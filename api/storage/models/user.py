# -*- coding: utf-8 -*-
from sqlalchemy import Column, Integer, String, UUID, ForeignKey, Date
from sqlalchemy.orm import relationship

from ..database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    login = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    first_name = Column(String)
    last_name = Column(String)
    avatar_id = Column(UUID, ForeignKey("photos.id"))
    study_place = Column(String)
    city = Column(String)
    birthdate = Column(Date)

    avatar = relationship('Photo', foreign_keys=[avatar_id], lazy='selectin')
