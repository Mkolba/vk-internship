# -*- coding: utf-8 -*-
from dotenv import load_dotenv
from utils import BetterDict
import os

load_dotenv('../env')

database = BetterDict({
    'host': os.getenv('DB_HOST', '127.0.0.1'),
    'database': os.getenv('DB_NAME', 'notvk'),
    'user': os.getenv('DB_USER', 'notvk-handler'),
    'password': os.getenv('DB_PASSWORD', '12345678')
})

SQLALCHEMY_DATABASE_URL = f"postgresql+asyncpg://{database.user}:{database.password}@{database.host}/{database.database}"

SECRET_KEY = os.getenv('SECRET_KEY', 'f4d4a3f71a7174b30c1c28297003b8a6e6128ab6a639e5224426fb99079a7c4a')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 24 * 60
