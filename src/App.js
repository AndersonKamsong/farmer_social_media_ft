import './App.css';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Link,
  Route,
  RouterProvider,
} from 'react-router-dom'
import Root from './components/common/root';
import Login from './components/auth/login';
import React, { Suspense } from 'react';
import LandingPage from './components/common/LandingPage';
import Signup from './components/auth/signup';
import Header from './components/common/Header';
import ChatPage from './components/chat/ChatPage';
import ChatRoom from './components/chat/ChatRoom';
// import CampaignListPage from './components/campaigns/CampaignListPage';
import UserListPage from './components/user/UserListPage';
import FarmerPostPage from './components/posts/FarmerPostPage';
import GroupManagementPage from './components/group/GroupManagementPage';
import GroupDetailPage from './components/group/GroupDetailPage';
import PostDetailPage from './components/posts/PostDetailPage';
import UserProfilePage from './components/user/UserProfilePage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/"
        element={<Root />}
      >
        <Route path="/"
          element={<Header />}
        >
          <Route index
            element={<LandingPage />}
          />
          <Route path='/posts'
            element={
              <FarmerPostPage />
            }
          >
          </Route>
          <Route path='/post/:postId'
            element={
              <PostDetailPage />
            }
          />
          <Route path='/groups'
            element={
              <GroupManagementPage />
            }
          >
            <Route path=':groupId'
              element={
                <GroupDetailPage />
              }
            />
          </Route>
          <Route path='/chat'
            element={
              <ChatPage />
            }
          >
            <Route path=':chatRoomId'
              element={
                <ChatRoom />
              }
            />
          </Route>
          <Route path='/userList'
            element={
              <UserListPage />
            }
          />
          <Route path='/users/:userId'
            element={
              <UserProfilePage />
            }
          />
        </Route>
        <Route path='/login'
          element={
            <Login />
          }
        />
        <Route path='/signup'
          element={
            <Signup />
          }
        />
        {/* <Route path='*'
          element={<NotFound />}
        /> */}
      </Route>
    </>
  )
)

const App = () => {
  return (
    <RouterProvider router={router} />
  );
}

export default App;