from fastapi import APIRouter, Depends, HTTPException
import security
from storage.models import User, Friend, Post, Like, Photo
from typing import List

from sqlalchemy.orm import aliased
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import and_, or_, func, desc

from api import deps
import schemas

router = APIRouter()


@router.get("/getCounters", response_model=schemas.UserCounters)
async def get_counters(
        current_user: User = Depends(deps.get_current_user),
        db: AsyncSession = Depends(deps.get_db)
):
    friends_total = await db.execute(select(func.count(Friend.id).label('count')).where(
        and_(
            or_(
                Friend.user_id == current_user.id,
                Friend.friend_id == current_user.id
            ),
            Friend.status == 2
        )
    ))
    friends_total = friends_total.scalar()

    friends_incoming = await db.execute(select(func.count(Friend.id).label('count')).where(
        and_(
            Friend.friend_id == current_user.id,
            Friend.status == 1
        )
    ))
    friends_incoming = friends_incoming.scalar()

    return schemas.UserCounters(
        friends_incoming=friends_incoming,
        friends_total=friends_total
    )


@router.patch("/edit", response_model=schemas.User)
async def edit_current_profile(
        data: schemas.UserUpdate,
        user: User = Depends(deps.get_current_user),
        db: AsyncSession = Depends(deps.get_db)
):
    updated_data = data.dict(exclude_unset=True)
    for attr, value in updated_data.items():
        if attr == 'password':
            setattr(user, 'hashed_password', security.get_password_hash(value))
        elif attr == 'avatar_id':
            if value != 'delete':
                photo = await db.execute(select(Photo).where(
                    Photo.id == value
                ))
                photo = photo.scalar()
                if not photo:
                    raise HTTPException(400, 'Фотография не найдена')
            setattr(user, attr, value if value != 'delete' else None)
        else:
            setattr(user, attr, value)

    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


@router.get("/getWall/{user_id}", response_model=List[schemas.Post])
async def get_wall(
        user: User = Depends(deps.get_user),
        current_user: User = Depends(deps.get_current_user),
        db: AsyncSession = Depends(deps.get_db)
):
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
        Post.wall_id == user.id
    ).group_by(Post.id).order_by(desc(Post.date))
    posts = await db.execute(posts_query)
    posts = posts.fetchall()
    return list([schemas.Post(is_liked=i.is_liked > 0, likes_count=i.likes_count, **i.Post.__dict__) for i in posts])


@router.get("/{user_id}", response_model=schemas.User)
async def get_profile(
        user: User = Depends(deps.get_user),
        current_user: User = Depends(deps.get_current_user),
        db: AsyncSession = Depends(deps.get_db)
):
    if user.id != current_user.id:
        friend = await db.execute(select(Friend.status, Friend.user_id).where(
            or_(
                and_(
                    Friend.user_id == user.id,
                    Friend.friend_id == current_user.id
                ),
                and_(
                    Friend.user_id == current_user.id,
                    Friend.friend_id == user.id
                ),
            )

        ))
        friend = friend.fetchone()
        print(friend)
        if not friend:
            friend_status = 0
        else:
            friend_status = 3 if friend.status == 1 and friend.user_id == current_user.id else friend.status
    else:
        friend_status = 0
    return schemas.User(friend_status=friend_status, **user.__dict__)