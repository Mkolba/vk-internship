from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import aioboto3
import config

engine = create_async_engine(config.SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

Base = declarative_base()

s3_session = aioboto3.Session()