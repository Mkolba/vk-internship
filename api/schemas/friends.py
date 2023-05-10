# -*- coding: utf-8 -*-

from typing import Optional, Union
from pydantic import BaseModel, EmailStr, Field, validator
from decorators import make_optional
from .user import User


class Friend(User):
    status: int
    is_yours: Optional[bool]