export interface User {
    id:string,
    first_name:string,
    last_name:string,
    username:string,
    email:string,
    password?:string,
    userProfile?:UserProfile
}

export interface UserProfile{
    id?:string,
    user?:User,
    profile_image?:string,
    bio?:string,
} 
