import { Photo } from "../Photo/photo"
import { User } from "../User/user"

export interface Comment {
    id:string,
    user?:User,
    comment:String,
    created_at:string,
    updated_at:string,
    photo?:Photo
}
