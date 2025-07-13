import { Category } from "../Category/category";
import { Tags } from "../Tags/tags";
import { User } from "../User/user";

export interface Photo {
    id:string,
    title:string,
    description:string,
    image:string,
    location:string,
    created_at:string,
    updated_at:string,
    uploaded_by?:User
    category?:Category,
    tags?:Tags,
    like_count?:Number,
    isLoaded?:boolean

}

