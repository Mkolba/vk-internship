import {Avatar, Group, Textarea, Button, File} from "@vkontakte/vkui";
import React, {useState} from "react";
import {useAtomValue} from "@mntm/precoil";
import {currentUserAtom} from "../../store";
import {Icon24CameraOutline} from "@vkontakte/icons";
import './PostEditor.scss';

export const PostEditor: React.FC = () => {
    const [postText, setPostText] = useState('');
    const [postPhoto, setPostPhoto] = useState(null);
    const user = useAtomValue(currentUserAtom);
    return (
        <>
            {user &&
                <Group className={'NewPost'}>
                    <div className={'NewPost__layout'}>
                        <div className={'NewPost__column'}>
                            <Avatar src={user?.avatar} size={36}/>
                        </div>
                        <div className={'NewPost__column NewPost__column--withTextarea'}>
                            <div className={'NewPost__textarea__row'}>
                                <Textarea
                                    className={'NewPost__textarea'} placeholder={'Что у вас нового?'} rows={1}
                                    value={postText} onChange={e => setPostText(e.target.value)}
                                />
                                {!postText &&
                                    <File mode={'tertiary'} className={'AttachPhotoButton'}>
                                        <Icon24CameraOutline color={'var(--)'}/>
                                    </File>
                                }
                            </div>

                            { postText &&
                                <div className={'NewPost__controls'}>
                                    <Button mode={'tertiary'} className={'AttachPhotoButton'}>
                                        <Icon24CameraOutline color={'var(--)'}/>
                                    </Button>
                                    <File className={'PostButton'}>
                                        Опубликовать
                                    </File>
                                </div>
                            }
                        </div>
                    </div>
                </Group>
            }
        </>
    )
}
