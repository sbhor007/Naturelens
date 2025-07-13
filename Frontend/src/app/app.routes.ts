import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { HomeLayoutComponent } from './components/home-layout/home-layout.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ExploreComponent } from './components/explore/explore.component';
import { DashboardLayoutComponent } from './components/user-dashboard/dashboard-layout/dashboard-layout.component';
import { ProfileComponent } from './components/user-dashboard/profile/profile.component';
import { CreatePostComponent } from './components/user-dashboard/create-post/create-post.component';
import { NotFoundComponent } from './components/not-found/not-found.component'; // Add a 404 component
import { authGuard } from './guard/auth.guard';
import { PostsComponent } from './components/user-dashboard/posts/posts.component';
import { SavedComponent } from './components/user-dashboard/saved/saved.component';
import { EditProfileComponent } from './components/user-dashboard/edit-profile/edit-profile.component';
import { LoadingComponent } from './loading/loading.component';
import { PhotoDetailsComponent } from './components/user-dashboard/photo-details/photo-details.component';
import { SearchComponent } from './components/user-dashboard/search/search.component';
import { SearchResultComponent } from './components/user-dashboard/search-result/search-result.component';
import { DomyImageInsertComponent } from './domy-image-insert/domy-image-insert.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '',
    component: HomeLayoutComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
      {
        path: 'explore',
        component: ExploreComponent,
      },
      {
        path: 'loading',
        component: LoadingComponent,
      },
    ],
  },

  {
    path: 'user',
    component: DashboardLayoutComponent,
    // canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'explore',
        pathMatch: 'full',
      },
      {
        path: 'profile',
        component: ProfileComponent,
        children: [
          {
            path: '',
            redirectTo: 'posts',
            pathMatch: 'full',
          },
          {
            path: 'posts',
            component: PostsComponent,
          },
          {
            path: 'saved',
            component: SavedComponent,
          },
        ],
      },
      {
        path: 'photo-details/:id',
        component: PhotoDetailsComponent,
      },
      {
        path: 'explore',
        component: ExploreComponent,
      },
      {
        path: 'create-post',
        component: CreatePostComponent,
      },
      {
        path: 'update-post/:id',
        component: CreatePostComponent,
      },
      {
        path: 'search',
        component: CreatePostComponent,
      },
      {
        path: 'edit-profile',
        component: EditProfileComponent,
      },
      {
        path:'search-result',
        component:SearchResultComponent
      },
      {
        path:'upload-images',
        component:DomyImageInsertComponent
      }
    ],
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
