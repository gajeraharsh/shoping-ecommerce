'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';

const SocialContext = createContext();

const socialReducer = (state, action) => {
  switch (action.type) {
    case 'SET_POSTS':
      return { ...state, posts: action.payload };
    
    case 'ADD_POST':
      return { ...state, posts: [action.payload, ...state.posts] };
    
    case 'UPDATE_POST':
      return {
        ...state,
        posts: state.posts.map(post =>
          post.id === action.payload.id ? { ...post, ...action.payload } : post
        )
      };
    
    case 'DELETE_POST':
      return {
        ...state,
        posts: state.posts.filter(post => post.id !== action.payload)
      };
    
    case 'LIKE_POST':
      return {
        ...state,
        posts: state.posts.map(post =>
          post.id === action.payload.postId
            ? {
                ...post,
                likes: action.payload.liked
                  ? [...post.likes, action.payload.userId]
                  : post.likes.filter(id => id !== action.payload.userId),
                likesCount: action.payload.liked
                  ? post.likesCount + 1
                  : post.likesCount - 1
              }
            : post
        )
      };
    
    case 'ADD_COMMENT':
      return {
        ...state,
        posts: state.posts.map(post =>
          post.id === action.payload.postId
            ? {
                ...post,
                comments: [...post.comments, action.payload.comment],
                commentsCount: post.commentsCount + 1
              }
            : post
        )
      };
    
    case 'SAVE_POST':
      return {
        ...state,
        savedPosts: action.payload.saved
          ? [...state.savedPosts, action.payload.postId]
          : state.savedPosts.filter(id => id !== action.payload.postId)
      };
    
    case 'FOLLOW_USER':
      return {
        ...state,
        following: action.payload.following
          ? [...state.following, action.payload.userId]
          : state.following.filter(id => id !== action.payload.userId)
      };
    
    case 'SET_TRENDING':
      return { ...state, trending: action.payload };
    
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    default:
      return state;
  }
};

export function SocialProvider({ children }) {
  const [state, dispatch] = useReducer(socialReducer, {
    posts: [],
    savedPosts: [],
    following: [],
    trending: {
      hashtags: [],
      creators: [],
      posts: []
    },
    loading: false
  });

  // Mock data for development
  useEffect(() => {
    const mockPosts = [
      {
        id: '1',
        user: {
          id: 'user1',
          name: 'Fashion Influencer',
          username: 'fashionista_maya',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b74f9e2b?w=100&h=100&fit=crop&crop=face',
          verified: true,
          role: 'influencer'
        },
        images: [
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop'
        ],
        caption: 'Loving this new autumn collection! Perfect for the season 🍂 #AutumnFashion #StyleInspiration',
        hashtags: ['#AutumnFashion', '#StyleInspiration', '#OOTD'],
        taggedProducts: [
          {
            id: 'product1',
            name: 'Autumn Sweater',
            price: 2999,
            brand: 'StyleCo',
            image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&h=200&fit=crop'
          }
        ],
        likes: ['user2', 'user3'],
        likesCount: 245,
        comments: [
          {
            id: 'comment1',
            user: { name: 'Style Lover', username: 'stylelover23' },
            text: 'Absolutely gorgeous! Where did you get this?',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
          }
        ],
        commentsCount: 15,
        sharesCount: 12,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        location: 'Mumbai, India'
      },
      {
        id: '2',
        user: {
          id: 'user2',
          name: 'Street Style',
          username: 'streetstyle_sam',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
          verified: false,
          role: 'user'
        },
        images: [
          'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&h=800&fit=crop'
        ],
        caption: 'Street style vibes for today! Keeping it simple yet stylish 🔥 #StreetFashion',
        hashtags: ['#StreetFashion', '#Minimal', '#Casual'],
        taggedProducts: [],
        likes: ['user1'],
        likesCount: 89,
        comments: [],
        commentsCount: 5,
        sharesCount: 3,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        location: 'Delhi, India'
      }
    ];

    const mockTrending = {
      hashtags: [
        { tag: '#AutumnFashion', count: 1234 },
        { tag: '#StyleInspiration', count: 987 },
        { tag: '#OOTD', count: 756 },
        { tag: '#StreetFashion', count: 543 }
      ],
      creators: [
        {
          id: 'user1',
          name: 'Fashion Influencer',
          username: 'fashionista_maya',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b74f9e2b?w=100&h=100&fit=crop&crop=face',
          followerCount: 125000,
          verified: true
        },
        {
          id: 'user3',
          name: 'Style Guru',
          username: 'styleguru_raj',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
          followerCount: 98000,
          verified: true
        }
      ],
      posts: mockPosts
    };

    dispatch({ type: 'SET_POSTS', payload: mockPosts });
    dispatch({ type: 'SET_TRENDING', payload: mockTrending });
  }, []);

  const likePost = (postId, userId) => {
    const post = state.posts.find(p => p.id === postId);
    const liked = !post?.likes.includes(userId);
    
    dispatch({
      type: 'LIKE_POST',
      payload: { postId, userId, liked }
    });
  };

  const addComment = (postId, commentData) => {
    const comment = {
      id: Date.now().toString(),
      ...commentData,
      timestamp: new Date().toISOString()
    };
    
    dispatch({
      type: 'ADD_COMMENT',
      payload: { postId, comment }
    });
  };

  const savePost = (postId, userId) => {
    const saved = !state.savedPosts.includes(postId);
    
    dispatch({
      type: 'SAVE_POST',
      payload: { postId, saved }
    });
  };

  const followUser = (userId, currentUserId) => {
    const following = !state.following.includes(userId);
    
    dispatch({
      type: 'FOLLOW_USER',
      payload: { userId, following }
    });
  };

  const createPost = (postData) => {
    const newPost = {
      id: Date.now().toString(),
      ...postData,
      likes: [],
      likesCount: 0,
      comments: [],
      commentsCount: 0,
      sharesCount: 0,
      createdAt: new Date().toISOString()
    };
    
    dispatch({ type: 'ADD_POST', payload: newPost });
    return newPost;
  };

  return (
    <SocialContext.Provider value={{
      posts: state.posts,
      savedPosts: state.savedPosts,
      following: state.following,
      trending: state.trending,
      loading: state.loading,
      likePost,
      addComment,
      savePost,
      followUser,
      createPost
    }}>
      {children}
    </SocialContext.Provider>
  );
}

export const useSocial = () => {
  const context = useContext(SocialContext);
  if (!context) {
    throw new Error('useSocial must be used within a SocialProvider');
  }
  return context;
};
