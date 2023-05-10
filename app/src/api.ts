import { redirect } from "react-router-dom"
import {currentUserAtom} from "./store";
const DEFAULT_API_URL = 'http://192.168.0.10/api';

export type RequestType = 'GET' | 'POST' | 'DELETE' | 'PATCH'

function parseJwt (token: string) {
    if (token) {
        try {
            let base64Url = token.split('.')[1];
            let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            return JSON.parse(jsonPayload);
        } catch(err) {

        }
    }
}

class API {
    getToken(shouldRedirect: boolean = true) {
        const token = localStorage.getItem('jwt-token')
        if (!token && shouldRedirect) redirect('/login')
        return {payload: token ? parseJwt(token) : '', token: token}
    }
    async call(path: string, type: RequestType, params: any = {}) {
        const {token} = this.getToken(path !== '/login/access_token');
        let headers: any = {'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json'};
        let options = {
            method: type,
            body: params.formData ? params.formData : JSON.stringify(params),
            headers: headers
        }
        if (type === 'GET') {
            delete options.body
        }
        if (params.formData) {
            delete headers["Content-Type"]
        }
        return fetch(`${DEFAULT_API_URL}${path}`, {...options}).then(response => {
            const contentType = response.headers.get('Content-Type') || '';
            if (response.ok && contentType.includes('application/json')) {
                return response.json().catch(error => {
                    return Promise.reject('500');
                });
            }
            if (![200, 503].includes(response.status)) {
                return Promise.reject(response.json())
            }
        }).catch(error => {
            return Promise.reject(error)
        });
    }

    getUser(user_id: number) {
        return this.call(`/user/${user_id}`, 'GET').then(data => {
            return Promise.resolve(data)
        })
    }

    editUser(params: any = {}) {
        return this.call(`/user/edit`, 'PATCH', params).then(data => {
            return Promise.resolve(data)
        })
    }

    authUser() {
        const {payload} = this.getToken()
        this.getUser(Number(payload['sub'])).then(data => {
            currentUserAtom.set(data);
        })
    }

    getFriends(user_id: number) {
        return this.call(`/friends/${user_id}`, 'GET').then(data => {
            return Promise.resolve(data)
        })
    }

    addFriend(user_id: number) {
        return this.call(`/friends/${user_id}`, 'POST').then(data => {
            return Promise.resolve(data)
        })
    }

    delFriend(user_id: number) {
        return this.call(`/friends/${user_id}`, 'DELETE').then(data => {
            return Promise.resolve(data)
        })
    }

    createPost(user_id: number, params: any = {}) {
        return this.call(`/posts/${user_id}`, 'POST', params).then(data => {
            return Promise.resolve(data)
        })
    }

    likePost(post_id: number) {
        return this.call(`/posts/like/${post_id}`, 'POST').then(data => {
            return Promise.resolve(data)
        })
    }

    dislikePost(post_id: number) {
        return this.call(`/posts/like/${post_id}`, 'DELETE').then(data => {
            return Promise.resolve(data)
        })
    }

    getWall(user_id: number) {
        return this.call(`/user/getWall/${user_id}`, 'GET').then(data => {
            return Promise.resolve(data)
        })
    }

    uploadPhoto = (formData: any) => {
        return this.call(`/photos/upload`, 'POST', {'formData': formData}).then(data => {
            return Promise.resolve(data)
        })
    }

    login(options: {formData: any}) {
        return this.call(`/login/access-token`, 'POST', options).then(data => {
            localStorage.setItem('jwt-token', data.access_token)
            this.authUser();
            return Promise.resolve({success: true})
        }).catch(error => {
            return Promise.reject(error)
        })
    }

    register(options: {first_name: string, last_name: string, password: string, login: string, birthdate?: string}) {
        return this.call(`/register`, 'POST', options).then(data => {
            localStorage.setItem('jwt-token', data.access_token)
            this.authUser();
            return Promise.resolve({success: true})
        }).catch(error => {
            return Promise.resolve(error)
        })
    }
}

export const api = new API();