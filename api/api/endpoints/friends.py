from fastapi import APIRouter, Depends, HTTPException
from typing import List
from storage.models import User, Friend, Photo

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import and_, or_

from api import deps
import schemas

router = APIRouter()


@router.get("/{user_id}", response_model=List[schemas.Friend])
async def get_friends(
        user: User = Depends(deps.get_user),
        current_user: User = Depends(deps.get_current_user),
        db: AsyncSession = Depends(deps.get_db)
):
    requested_user_friends_query = select(
        User.id,
        Photo.url,
        User.first_name,
        User.last_name,
        Friend.status.label('friend_status'),
        Friend.user_id
    ).select_from(Friend).join(User, (
        and_(
            or_(
                User.id == Friend.user_id,
                User.id == Friend.friend_id
            ),
            User.id != user.id
        )
    ), isouter=True).join(Photo, Photo.id == User.avatar_id, isouter=True)
    if user.id == current_user.id:
        requested_user_friends_query = requested_user_friends_query.where(
            or_(
                Friend.user_id == user.id,
                Friend.friend_id == user.id
            )
        )
    else:
        requested_user_friends_query = requested_user_friends_query.where(
            and_(
                or_(
                    Friend.user_id == user.id,
                    Friend.friend_id == user.id
                ),
                Friend.status == 2
            )
        )
    requested_user_friends = await db.execute(requested_user_friends_query)
    requested_user_friends = list(requested_user_friends.fetchall())
    return list([schemas.Friend(
        is_yours=i.user_id == current_user.id, **i._mapping, avatar=schemas.PhotoUploaded(url=i.url) if i.url else None
    ) for i in requested_user_friends])


@router.post("/{user_id}")
async def add_friend(
        user: User = Depends(deps.get_user),
        current_user: User = Depends(deps.get_current_user),
        db: AsyncSession = Depends(deps.get_db)
):
    if user.id == current_user.id:
        raise HTTPException(400, 'Вы не можете применить это к себе.')

    friend = await db.execute(select(Friend).where(
        and_(
            or_(
                Friend.user_id == current_user.id,
                Friend.friend_id == current_user.id
            ),
            or_(
                Friend.user_id == user.id,
                Friend.friend_id == user.id
            )
        )
    ))
    friend = friend.scalar()

    if friend:
        if friend.status == 1:
            if friend.user_id == current_user.id:
                raise HTTPException(400, 'Заявка этому пользователю уже отправлена.')
            setattr(friend, 'status', 2)
            db.add(friend)
            await db.commit()
            return {'friend_status': 2}
        else:
            raise HTTPException(400, 'Вы уже добавили этого пользователя в друзья.')
    else:
        friend = Friend(user_id=current_user.id, friend_id=user.id, status=1)

    db.add(friend)
    await db.commit()
    return {'friend_status': 3}


@router.delete("/{user_id}")
async def delete_friend(
        user: User = Depends(deps.get_user),
        current_user: User = Depends(deps.get_current_user),
        db: AsyncSession = Depends(deps.get_db)
):
    if user.id == current_user.id:
        raise HTTPException(400, 'Вы не можете применить это к себе.')

    friend = await db.execute(select(Friend).where(
        and_(
            or_(
                Friend.user_id == current_user.id,
                Friend.friend_id == current_user.id
            ),
            or_(
                Friend.user_id == user.id,
                Friend.friend_id == user.id
            )
        )
    ))
    friend = friend.scalar()

    if friend:
        await db.delete(friend)
        await db.commit()
    else:
        raise HTTPException(400, 'Такой заявки в друзья не существует.')

    return {'friend_status': 0}