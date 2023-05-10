from fastapi import APIRouter, Depends, HTTPException
from typing import List, Union
from storage.models import User, Post, Photo, Like

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import and_, func

from api import deps
import schemas

router = APIRouter()


@router.post("/{user_id}", response_model=schemas.Post)
async def create_post(
        obj: schemas.PostCreate,
        photo: Union[Photo, None] = Depends(deps.get_photo),
        current_user: User = Depends(deps.get_current_user),
        user: User = Depends(deps.get_user),
        db: AsyncSession = Depends(deps.get_db),
):
    post = Post(text=obj.text, photo_id=photo.id if photo else None, wall_id=user.id, creator_id=current_user.id)
    db.add(post)
    await db.commit()
    await db.refresh(post)
    return schemas.Post(is_liked=False, likes_count=0, **post.__dict__)


@router.get("/{post_id}", response_model=schemas.Post)
async def get_post(
        post: Post = Depends(deps.get_post),
        current_user: User = Depends(deps.get_current_user),
        db: AsyncSession = Depends(deps.get_db)
):
    is_liked = await db.execute(select(Like).where(
        and_(
            Like.user_id == current_user.id,
            Like.post_id == post.id
        )
    ))
    is_liked = True if is_liked.scalar() else False
    likes_count = await db.execute(select(func.count(Like.id)).where(
        Like.post_id == post.id
    ))
    likes_count = likes_count.scalar()
    post = {k: v for k, v in post.__dict__.items()}
    return schemas.Post(is_liked=is_liked, likes_count=likes_count, **post)


@router.post("/like/{post_id}", response_model=schemas.PostLike)
async def like_post(
        post: Post = Depends(deps.get_post),
        current_user: User = Depends(deps.get_current_user),
        db: AsyncSession = Depends(deps.get_db),
):
    is_like_already_exists = await db.execute(select(Like).where(
        and_(
            Like.user_id == current_user.id,
            Like.post_id == post.id
        )
    ))
    if is_like_already_exists.scalar():
        raise HTTPException(400, 'Вы уже лайкнули этот пост')

    like = Like(user_id=current_user.id, post_id=post.id)
    db.add(like)
    await db.commit()
    await db.refresh(like)
    return like


@router.delete("/like/{post_id}")
async def dislike_post(
        post: Post = Depends(deps.get_post),
        current_user: User = Depends(deps.get_current_user),
        db: AsyncSession = Depends(deps.get_db),
):
    like = await db.execute(select(Like).where(
        and_(
            Like.user_id == current_user.id,
            Like.post_id == post.id
        )
    ))
    like = like.scalar()
    if not like:
        raise HTTPException(400, 'Вы не лайкали этот пост')

    await db.delete(like)
    await db.commit()
    return {'detail': 'Лайк удален'}
