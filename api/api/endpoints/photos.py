# -*- coding: utf-8 -*-

from fastapi import APIRouter, UploadFile, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from storage.models import Photo, User
from uuid import uuid4
from api import deps
import schemas
import io

router = APIRouter()


@router.post('/upload', response_model=schemas.Photo)
async def upload_photo(
        file: UploadFile,
        user: User = Depends(deps.get_current_user),
        db: AsyncSession = Depends(deps.get_db),
        s3=Depends(deps.get_s3)
):
    contents = file.file.read()
    temp_file = io.BytesIO()
    temp_file.write(contents)
    temp_file.seek(0)
    photo_id = uuid4()
    await s3.upload_fileobj(temp_file, 'test-vk-internship', f'{photo_id}.png')
    temp_file.close()

    photo = Photo(id=photo_id, url=f'https://test-vk-internship.hb.bizmrg.com/{photo_id}.png', uploaded_by=user.id)
    db.add(photo)
    await db.commit()
    await db.refresh(photo)
    return photo
