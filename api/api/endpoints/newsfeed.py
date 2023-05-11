from fastapi import APIRouter, Depends, HTTPException
from storage.models import User, Post, Like, Friend

from sqlalchemy.orm import aliased
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import and_, or_, func, desc, any_
from typing import List

from api import deps
import schemas

router = APIRouter()


@router.get("/", response_model=List[schemas.Post])
async def get_newsfeed(
        current_user: User = Depends(deps.get_current_user),
        db: AsyncSession = Depends(deps.get_db)
):
    friends = select(
        User.id
    ).select_from(Friend).join(User, (
        and_(
            or_(
                User.id == Friend.user_id,
                User.id == Friend.friend_id
            ),
            User.id != current_user.id
        )
    ), isouter=True).where(
        or_(
            Friend.user_id == current_user.id,
            and_(
                Friend.friend_id == current_user.id,
                Friend.status == 2
            )
        )
    ).subquery('friends')

    like_alias_1 = aliased(Like)
    like_alias_2 = aliased(Like)

    posts_query = select(
        Post,
        func.count(like_alias_1.id).label('likes_count'),
        func.count(like_alias_2.id).label('is_liked')
    ).join(
        like_alias_1,
        Post.id == like_alias_1.post_id,
        isouter=True
    ).join(
        like_alias_2,
        and_(
            Post.id == like_alias_2.post_id,
            like_alias_2.user_id == current_user.id
        ),
        isouter=True
    ).where(
        and_(
            Post.wall_id == any_(friends),
            Post.creator_id == Post.wall_id
        )
    ).group_by(Post.id).order_by(desc(Post.date))
    posts = await db.execute(posts_query)

    return list([schemas.Post(is_liked=i.is_liked > 0, likes_count=i.likes_count, **i.Post.__dict__) for i in posts.fetchall()])