import BaseService from "./base-service";

export class FollowService extends BaseService {
    async follow(artistId: string) {
        const { data } = await this._axios.post('/followers', artistId)
        return data.data
    }

    async unfollow(artistId: string){
        const {data} = await this._axios.delete(`/followers/${artistId}/unfollow`)
        return data
    }

    async isFollowing(artistId: string){
        const {data} = await this._axios.get<boolean>(`/followers/${artistId}`)
        return data
    }
}