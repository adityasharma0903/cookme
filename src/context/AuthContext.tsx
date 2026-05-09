import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import API from '../api';

export interface CreatorAccount {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  bio: string;
  specialty: string;
  followers: number;
  following: string[];
  followersList?: string[];
  isVerified: boolean;
  status: 'Active' | 'Suspended';
  socialLinks: { instagram?: string; youtube?: string; twitter?: string };
  createdAt: string;
  totalLikes?: number;
  totalViews?: number;
  likes?: number;
  recipes?: number;
  password?: string;
}

export interface CreatorRecipe {
  id: string;
  creator: CreatorAccount | any;
  title: string;
  description: string;
  image: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  prepTime: number;
  cookTime: number;
  servings: number;
  calories: number;
  ingredients: { name: string; amount: string; unit: string }[];
  steps: { number: number; title: string; description: string; duration?: number }[];
  tags: string[];
  likes: number;
  saves: number;
  comments: number;
  views: number;
  isPublished: boolean;
  createdAt: string;
  isTrending?: boolean;
  isSponsored?: boolean;
  cuisine?: string;
  likedBy?: string[];
  savedBy?: string[];
}

export interface CreatorReel {
  id: string;
  creator: CreatorAccount | any;
  title: string;
  thumbnail: string;
  videoUrl: string;
  description: string;
  likes: number;
  views: number;
  createdAt: string;
}

export interface RecipeComment {
  id: string;
  recipe: string;
  user: { id: string; name: string; avatar: string };
  text: string;
  createdAt: string;
}

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'creator' | 'user';
  avatar?: string;
  token: string;
  following?: string[];
  savedRecipes?: string[];
  likedRecipes?: string[];
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  // Admin actions
  createCreator: (data: any) => Promise<void>;
  updateCreator: (id: string, data: any) => Promise<void>;
  deleteCreator: (id: string) => Promise<void>;
  getCreators: () => CreatorAccount[];
  getCreatorById: (id: string) => CreatorAccount | undefined;
  fetchData: () => Promise<void>;
  // Creator actions
  addRecipe: (recipe: any) => Promise<void>;
  updateRecipe: (id: string, data: any) => Promise<void>;
  deleteRecipe: (id: string) => Promise<void>;
  getMyRecipes: () => CreatorRecipe[];
  getAllCreatorRecipes: () => CreatorRecipe[];
  getAllReels: () => CreatorReel[];
  addReel: (reel: any) => Promise<void>;
  deleteReel: (id: string) => Promise<void>;
  getMyReels: () => CreatorReel[];
  updateProfile: (data: any) => Promise<void>;
  changePassword: (oldPass: string, newPass: string) => Promise<{ success: boolean; error?: string }>;
  // User interactions
  toggleLikeRecipe: (recipeId: string) => Promise<{ liked: boolean; likes: number } | null>;
  toggleSaveRecipe: (recipeId: string) => Promise<{ saved: boolean; saves: number } | null>;
  toggleFollowUser: (userId: string) => Promise<{ isFollowing: boolean; followers: number } | null>;
  getComments: (recipeId: string) => Promise<RecipeComment[]>;
  addComment: (recipeId: string, text: string) => Promise<RecipeComment | null>;
  isRecipeLiked: (recipeId: string) => boolean;
  isRecipeSaved: (recipeId: string) => boolean;
  isFollowingUser: (userId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [creators, setCreators] = useState<CreatorAccount[]>([]);
  const [recipes, setRecipes] = useState<CreatorRecipe[]>([]);
  const [reels, setReels] = useState<CreatorReel[]>([]);

  const fetchData = async () => {
    try {
      const [creatorsRes, recipesRes, reelsRes] = await Promise.all([
        API.get('/users/creators'),
        API.get('/recipes'),
        API.get('/reels')
      ]);
      const mapId = (item: any) => {
        if (item._id && !item.id) item.id = item._id;
        if (item.creator && item.creator._id) item.creator.id = item.creator._id;
        return item;
      };
      setCreators(creatorsRes.data.map(mapId));
      setRecipes(recipesRes.data.map(mapId));
      setReels(reelsRes.data.map(mapId));
    } catch (err) {
      console.error('Error fetching data', err);
    }
  };

  // Fetch current user's full profile (for following, saved, liked)
  const refreshUserProfile = async () => {
    try {
      const { data } = await API.get('/auth/me');
      if (data._id && !data.id) data.id = data._id;
      const savedUser = localStorage.getItem('cookme_user');
      const token = savedUser ? JSON.parse(savedUser).token : '';
      const fullUser = { ...data, token, id: data._id || data.id };
      setUser(fullUser);
      localStorage.setItem('cookme_user', JSON.stringify(fullUser));
    } catch (err) {
      // silent
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('cookme_user');
    if (saved) {
      const u = JSON.parse(saved);
      if (u._id && !u.id) u.id = u._id;
      setUser(u);
    }
    fetchData().finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await API.post('/auth/login', { email, password });
      data.id = data._id;
      setUser(data);
      localStorage.setItem('cookme_user', JSON.stringify(data));
      await fetchData();
      // Also fetch full profile for following/liked/saved arrays
      setTimeout(() => refreshUserProfile(), 300);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const { data } = await API.post('/auth/register', { name, email, password });
      data.id = data._id;
      setUser(data);
      localStorage.setItem('cookme_user', JSON.stringify(data));
      await fetchData();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cookme_user');
  };

  const createCreator = async (data: any) => {
    await API.post('/users/creators', data);
    await fetchData();
  };

  const updateCreator = async (id: string, data: any) => {
    await API.put(`/users/creators/${id}`, data);
    await fetchData();
  };

  const deleteCreator = async (id: string) => {
    await API.delete(`/users/creators/${id}`);
    await fetchData();
  };

  const getCreators = () => creators;
  const getCreatorById = (id: string) => creators.find(c => c.id === id);

  const addRecipe = async (recipe: any) => {
    await API.post('/recipes', recipe);
    await fetchData();
  };

  const updateRecipe = async (id: string, data: any) => {
    await API.put(`/recipes/${id}`, data);
    await fetchData();
  };

  const deleteRecipe = async (id: string) => {
    await API.delete(`/recipes/${id}`);
    await fetchData();
  };

  const getMyRecipes = () => user ? recipes.filter(r => {
    const creatorId = typeof r.creator === 'string' ? r.creator : (r.creator as any)?.id;
    return creatorId === user.id;
  }) : [];
  
  const getAllCreatorRecipes = () => recipes;
  const getAllReels = () => reels;

  const addReel = async (reel: any) => {
    await API.post('/reels', reel);
    await fetchData();
  };

  const deleteReel = async (id: string) => {
    await API.delete(`/reels/${id}`);
    await fetchData();
  };

  const getMyReels = () => user ? reels.filter(r => {
    const creatorId = typeof r.creator === 'string' ? r.creator : (r.creator as any)?.id;
    return creatorId === user.id;
  }) : [];

  const updateProfile = async (data: any) => {
    if (!user) return;
    try {
      await API.put(`/users/creators/${user.id}`, data);
      await fetchData();
      if (data.name || data.avatar) {
        const updated = { ...user, ...(data.name && { name: data.name }), ...(data.avatar && { avatar: data.avatar }) };
        setUser(updated);
        localStorage.setItem('cookme_user', JSON.stringify(updated));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const changePassword = async (oldPass: string, newPass: string) => {
    try {
      await API.put('/users/password', { oldPassword: oldPass, newPassword: newPass });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Update failed' };
    }
  };

  // ===== User Interaction Functions =====

  const toggleLikeRecipe = async (recipeId: string) => {
    if (!user) return null;
    try {
      const { data } = await API.post(`/recipes/${recipeId}/like`);
      await fetchData();
      await refreshUserProfile();
      return data;
    } catch (err) {
      console.error('Error toggling like', err);
      return null;
    }
  };

  const toggleSaveRecipe = async (recipeId: string) => {
    if (!user) return null;
    try {
      const { data } = await API.post(`/recipes/${recipeId}/save`);
      await fetchData();
      await refreshUserProfile();
      return data;
    } catch (err) {
      console.error('Error toggling save', err);
      return null;
    }
  };

  const toggleFollowUser = async (userId: string) => {
    if (!user) return null;
    try {
      const { data } = await API.post(`/users/${userId}/follow`);
      await fetchData();
      await refreshUserProfile();
      return data;
    } catch (err) {
      console.error('Error toggling follow', err);
      return null;
    }
  };

  const getCommentsForRecipe = async (recipeId: string): Promise<RecipeComment[]> => {
    try {
      const { data } = await API.get(`/recipes/${recipeId}/comments`);
      return data.map((c: any) => ({
        id: c._id,
        recipe: c.recipe,
        user: { id: c.user._id, name: c.user.name, avatar: c.user.avatar },
        text: c.text,
        createdAt: c.createdAt,
      }));
    } catch (err) {
      console.error('Error fetching comments', err);
      return [];
    }
  };

  const addCommentToRecipe = async (recipeId: string, text: string): Promise<RecipeComment | null> => {
    if (!user) return null;
    try {
      const { data } = await API.post(`/recipes/${recipeId}/comments`, { text });
      await fetchData();
      return {
        id: data._id,
        recipe: data.recipe,
        user: { id: data.user._id, name: data.user.name, avatar: data.user.avatar },
        text: data.text,
        createdAt: data.createdAt,
      };
    } catch (err) {
      console.error('Error adding comment', err);
      return null;
    }
  };

  const isRecipeLiked = (recipeId: string) => {
    if (!user) return false;
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return false;
    return (recipe.likedBy || []).some((id: any) => id.toString() === user.id || id === user.id);
  };

  const isRecipeSaved = (recipeId: string) => {
    if (!user) return false;
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return false;
    return (recipe.savedBy || []).some((id: any) => id.toString() === user.id || id === user.id);
  };

  const isFollowingUser = (userId: string) => {
    if (!user || !user.following) return false;
    return user.following.some((id: any) => id.toString() === userId || id === userId);
  };

  return (
    <AuthContext.Provider value={{
      user, isLoading, login, signup, logout, fetchData,
      createCreator, updateCreator, deleteCreator, getCreators, getCreatorById,
      addRecipe, updateRecipe, deleteRecipe, getMyRecipes, getAllCreatorRecipes,
      getAllReels, addReel, deleteReel, getMyReels,
      updateProfile, changePassword,
      toggleLikeRecipe, toggleSaveRecipe, toggleFollowUser,
      getComments: getCommentsForRecipe, addComment: addCommentToRecipe,
      isRecipeLiked, isRecipeSaved, isFollowingUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
