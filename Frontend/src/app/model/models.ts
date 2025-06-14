export interface LoginState  {
  loading: boolean;
  error: string | null;
  authenticated: boolean;
}


export interface UserProfileState {
  loading: boolean;
  error: string | null;
  profile: any | null;
  available: boolean;
}

export interface photoCategoryState{
  category : any | null;
}

