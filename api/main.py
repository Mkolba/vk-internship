from fastapi import FastAPI, Query, Request, Depends, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import Union
from sqlalchemy.future import select
from sqlalchemy import func, or_, and_, desc, asc
from typing import List
import asyncio
import re
from storage.database import Base, engine

from api.api import api_router


async def init_db():
    async with engine.begin() as conn:
        try:
            #await conn.run_sync(Base.metadata.drop_all)
            await conn.run_sync(Base.metadata.create_all)
        except Exception as err:
            print(f'DB init failed: {err}')

asyncio.get_event_loop().create_task(init_db())
app = FastAPI(title='NotVK')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix='/api')