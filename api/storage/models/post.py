from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func, UUID
from sqlalchemy.orm import relationship

from ..database import Base


class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    creator_id = Column(Integer, ForeignKey("users.id"))
    wall_id = Column(Integer, ForeignKey("users.id"))
    text = Column(String)
    date = Column(DateTime, default=func.now())
    photo_id = Column(UUID, ForeignKey("photos.id"))

    creator = relationship("User", foreign_keys=[creator_id], lazy='selectin')
    photo = relationship("Photo", foreign_keys=[photo_id], lazy='selectin')
