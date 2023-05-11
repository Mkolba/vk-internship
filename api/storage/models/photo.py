from sqlalchemy import Column, Text, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from uuid import uuid4

from ..database import Base


class Photo(Base):
    __tablename__ = "photos"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid4())
    uploaded_by = Column(Integer, ForeignKey("users.id"))
    url = Column(Text)
