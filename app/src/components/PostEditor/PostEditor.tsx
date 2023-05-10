import {Avatar, Group, Textarea, Button, File, Tappable, ScreenSpinner} from "@vkontakte/vkui";
import React, {useState} from "react";
import {useAtomValue, useSetAtomState} from "@mntm/precoil";
import {currentUserAtom, popoutAtom} from "../../store";
import {Icon24CameraOutline, Icon20Cancel} from "@vkontakte/icons";
import './PostEditor.scss';
import {api} from "../../api";
import {AnyFunction, IPhoto, UserType} from "../../types";


interface PostEditorProps extends React.HTMLAttributes<HTMLDivElement> {
    user: UserType,
    addPost: AnyFunction
}

export const PostEditor: React.FC<PostEditorProps> = ({
    user,
    addPost
}) => {
    const setPopout = useSetAtomState(popoutAtom);
    const [postText, setPostText] = useState('');
    const [postPhoto, setPostPhoto] = useState<IPhoto | null>(null);
    const currentUser = useAtomValue(currentUserAtom);

    const attachPhoto = (e: any) => {
        setPopout(<ScreenSpinner/>)
        const data = new FormData();
        const file = e.currentTarget.files[0];
        data.append('file', file)
        api.uploadPhoto(data).then(data => {
            setPopout(null)
            setPostPhoto(data)
        }).catch(err => {
            setPopout(null)
        })
    }

    const createPost = () => {
        setPopout(<ScreenSpinner/>)
        api.createPost(user.id, {text: postText ? postText : null, photo: postPhoto?.id}).then(data => {
            setPostText('');
            setPostPhoto(null);
            setPopout(null);
            addPost(data);
        }).catch(err => {
            setPopout(null)
        })
    }

    return (
        <>
            {currentUser &&
                <Group className={'NewPost'}>
                    <div className={'NewPost__layout'}>
                        <div className={'NewPost__column'}>
                            <Avatar src={currentUser?.avatar?.url} size={36} style={{marginLeft: 12}}/>
                        </div>
                        <div className={'NewPost__column NewPost__column--withTextarea'}>
                            <div className={'NewPost__textarea__row'}>
                                <Textarea
                                    className={'NewPost__textarea'} placeholder={'Что у вас нового?'} rows={1}
                                    value={postText} onChange={e => setPostText(e.target.value)}
                                />
                                {(!postText && !postPhoto) &&
                                    <File mode={'tertiary'} className={'AttachPhotoButton'} onChange={attachPhoto}>
                                        <Icon24CameraOutline/>
                                    </File>
                                }
                            </div>
                            {postPhoto &&
                                <div className={'NewPost__image'}>
                                    <img src={postPhoto.url} alt={''}/>
                                    <Tappable className={'NewPost__image__deleteButton'} onClick={() => setPostPhoto(null)}>
                                        <Icon20Cancel fill={'red'}/>
                                    </Tappable>
                                </div>
                            }
                            { (postText || postPhoto) &&
                                <div className={'NewPost__controls'}>
                                    {!postPhoto &&
                                        <Button mode={'tertiary'} className={'AttachPhotoButton'}>
                                            <Icon24CameraOutline/>
                                        </Button>
                                    }
                                    <Button className={'PostButton'} onClick={createPost}>
                                        Опубликовать
                                    </Button>
                                </div>
                            }
                        </div>
                    </div>
                </Group>
            }
        </>
    )
}
