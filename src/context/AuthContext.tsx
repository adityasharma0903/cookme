import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CreatorAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
  bio: string;
  specialty: string;
  followers: number;
  following: number;
  totalLikes: number;
  totalViews: number;
  isVerified: boolean;
  createdAt: string;
  status: 'active' | 'suspended';
  socialLinks: { instagram?: string; youtube?: string; twitter?: string };
}

export interface CreatorRecipe {
  id: string;
  creatorId: string;
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
  steps: { number: number; title: string; description: string }[];
  tags: string[];
  likes: number;
  saves: number;
  comments: number;
  views: number;
  isPublished: boolean;
  createdAt: string;
}

export interface CreatorReel {
  id: string;
  creatorId: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  description: string;
  likes: number;
  views: number;
  comments: number;
  createdAt: string;
}

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'creator';
  avatar?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  // Admin actions
  createCreator: (data: Omit<CreatorAccount, 'id' | 'followers' | 'following' | 'totalLikes' | 'totalViews' | 'createdAt'>) => CreatorAccount;
  updateCreator: (id: string, data: Partial<CreatorAccount>) => void;
  deleteCreator: (id: string) => void;
  getCreators: () => CreatorAccount[];
  getCreatorById: (id: string) => CreatorAccount | undefined;
  // Creator actions
  addRecipe: (recipe: Omit<CreatorRecipe, 'id' | 'likes' | 'saves' | 'comments' | 'views' | 'createdAt'>) => void;
  updateRecipe: (id: string, data: Partial<CreatorRecipe>) => void;
  deleteRecipe: (id: string) => void;
  getMyRecipes: () => CreatorRecipe[];
  getAllCreatorRecipes: () => CreatorRecipe[];
  addReel: (reel: Omit<CreatorReel, 'id' | 'likes' | 'views' | 'comments' | 'createdAt'>) => void;
  deleteReel: (id: string) => void;
  getMyReels: () => CreatorReel[];
  updateProfile: (data: Partial<CreatorAccount>) => void;
  changePassword: (oldPass: string, newPass: string) => { success: boolean; error?: string };
}

const AuthContext = createContext<AuthContextType | null>(null);

const ADMIN_EMAIL = 'admin@cookme.com';
const ADMIN_PASSWORD = 'admin123';

const generateId = () => Math.random().toString(36).substr(2, 9);

// Seed some initial creators
const seedCreators = (): CreatorAccount[] => {
  const existing = localStorage.getItem('cookme_creators');
  if (existing) return JSON.parse(existing);
  
  const seed: CreatorAccount[] = [
    {
      id: 'cr_1',
      name: 'Aditya Sharma',
      email: 'aditya@cookme.com',
      password: 'creator123',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
      bio: 'Passionate Indian cuisine chef specializing in traditional recipes with a modern twist.',
      specialty: 'Indian Cuisine',
      followers: 45200,
      following: 120,
      totalLikes: 234500,
      totalViews: 890000,
      isVerified: true,
      createdAt: '2025-01-15',
      status: 'active',
      socialLinks: { instagram: '@aditya_cooks', youtube: 'AdityaCooks' }
    },
    {
      id: 'cr_2',
      name: 'Priya Patel',
      email: 'priya@cookme.com',
      password: 'creator123',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
      bio: 'Vegan food artist creating plant-based magic.',
      specialty: 'Vegan & Plant-Based',
      followers: 38900,
      following: 85,
      totalLikes: 189000,
      totalViews: 650000,
      isVerified: true,
      createdAt: '2025-02-20',
      status: 'active',
      socialLinks: { instagram: '@priya_vegan', youtube: 'PriyaCooks' }
    },
  ];
  localStorage.setItem('cookme_creators', JSON.stringify(seed));
  return seed;
};

const seedRecipes = (): CreatorRecipe[] => {
  const existing = localStorage.getItem('cookme_creator_recipes');
  if (existing) return JSON.parse(existing);

  const seed: CreatorRecipe[] = [
    {
      id: 'rec_1', creatorId: 'cr_1', title: 'Butter Chicken Masala',
      description: 'A rich, creamy tomato-based curry with tender chicken pieces.',
      image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&h=400&fit=crop',
      category: 'Indian', difficulty: 'Medium', prepTime: 20, cookTime: 40, servings: 4, calories: 450,
      ingredients: [{ name: 'Chicken', amount: '500', unit: 'g' }, { name: 'Tomato Puree', amount: '2', unit: 'cups' }, { name: 'Cream', amount: '1', unit: 'cup' }],
      steps: [{ number: 1, title: 'Marinate', description: 'Marinate chicken for 2 hours.' }, { number: 2, title: 'Cook', description: 'Cook chicken and add gravy.' }],
      tags: ['chicken', 'curry', 'indian'], likes: 12400, saves: 8900, comments: 342, views: 89000,
      isPublished: true, createdAt: '2025-12-15'
    },
    {
      id: 'rec_2', creatorId: 'cr_2', title: 'Rainbow Buddha Bowl',
      description: 'A vibrant, nutrient-packed bowl featuring colorful roasted vegetables.',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop',
      category: 'Vegan', difficulty: 'Easy', prepTime: 15, cookTime: 25, servings: 2, calories: 380,
      ingredients: [{ name: 'Quinoa', amount: '1', unit: 'cup' }, { name: 'Avocado', amount: '1', unit: 'whole' }],
      steps: [{ number: 1, title: 'Cook Quinoa', description: 'Cook quinoa.' }, { number: 2, title: 'Assemble', description: 'Arrange in bowl.' }],
      tags: ['vegan', 'healthy', 'bowl'], likes: 15600, saves: 12300, comments: 489, views: 120000,
      isPublished: true, createdAt: '2026-01-05'
    },
  ];
  localStorage.setItem('cookme_creator_recipes', JSON.stringify(seed));
  return seed;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [creators, setCreators] = useState<CreatorAccount[]>(seedCreators());
  const [creatorRecipes, setCreatorRecipes] = useState<CreatorRecipe[]>(seedRecipes());
  const [reels, setReels] = useState<CreatorReel[]>(() => {
    const r = localStorage.getItem('cookme_reels');
    return r ? JSON.parse(r) : [];
  });

  useEffect(() => {
    const saved = localStorage.getItem('cookme_user');
    if (saved) setUser(JSON.parse(saved));
    setIsLoading(false);
  }, []);

  const saveCreators = (data: CreatorAccount[]) => {
    setCreators(data);
    localStorage.setItem('cookme_creators', JSON.stringify(data));
  };

  const saveRecipes = (data: CreatorRecipe[]) => {
    setCreatorRecipes(data);
    localStorage.setItem('cookme_creator_recipes', JSON.stringify(data));
  };

  const saveReels = (data: CreatorReel[]) => {
    setReels(data);
    localStorage.setItem('cookme_reels', JSON.stringify(data));
  };

  const login = (email: string, password: string) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const u: AuthUser = { id: 'admin', name: 'Main Admin', email, role: 'admin' };
      setUser(u);
      localStorage.setItem('cookme_user', JSON.stringify(u));
      return { success: true };
    }
    const creator = creators.find(c => c.email === email && c.password === password);
    if (creator) {
      if (creator.status === 'suspended') return { success: false, error: 'Account suspended. Contact admin.' };
      const u: AuthUser = { id: creator.id, name: creator.name, email, role: 'creator', avatar: creator.avatar };
      setUser(u);
      localStorage.setItem('cookme_user', JSON.stringify(u));
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password.' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cookme_user');
  };

  const createCreator = (data: Omit<CreatorAccount, 'id' | 'followers' | 'following' | 'totalLikes' | 'totalViews' | 'createdAt'>) => {
    const newCreator: CreatorAccount = {
      ...data,
      id: 'cr_' + generateId(),
      followers: 0,
      following: 0,
      totalLikes: 0,
      totalViews: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updated = [...creators, newCreator];
    saveCreators(updated);
    return newCreator;
  };

  const updateCreator = (id: string, data: Partial<CreatorAccount>) => {
    const updated = creators.map(c => c.id === id ? { ...c, ...data } : c);
    saveCreators(updated);
  };

  const deleteCreator = (id: string) => {
    saveCreators(creators.filter(c => c.id !== id));
    saveRecipes(creatorRecipes.filter(r => r.creatorId !== id));
    saveReels(reels.filter(r => r.creatorId !== id));
  };

  const getCreators = () => creators;
  const getCreatorById = (id: string) => creators.find(c => c.id === id);

  const addRecipe = (recipe: Omit<CreatorRecipe, 'id' | 'likes' | 'saves' | 'comments' | 'views' | 'createdAt'>) => {
    const newRecipe: CreatorRecipe = {
      ...recipe,
      id: 'rec_' + generateId(),
      likes: 0, saves: 0, comments: 0, views: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    saveRecipes([...creatorRecipes, newRecipe]);
  };

  const updateRecipe = (id: string, data: Partial<CreatorRecipe>) => {
    saveRecipes(creatorRecipes.map(r => r.id === id ? { ...r, ...data } : r));
  };

  const deleteRecipe = (id: string) => {
    saveRecipes(creatorRecipes.filter(r => r.id !== id));
  };

  const getMyRecipes = () => user ? creatorRecipes.filter(r => r.creatorId === user.id) : [];
  const getAllCreatorRecipes = () => creatorRecipes;

  const addReel = (reel: Omit<CreatorReel, 'id' | 'likes' | 'views' | 'comments' | 'createdAt'>) => {
    const newReel: CreatorReel = {
      ...reel,
      id: 'reel_' + generateId(),
      likes: 0, views: 0, comments: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    saveReels([...reels, newReel]);
  };

  const deleteReel = (id: string) => {
    saveReels(reels.filter(r => r.id !== id));
  };

  const getMyReels = () => user ? reels.filter(r => r.creatorId === user.id) : [];

  const updateProfile = (data: Partial<CreatorAccount>) => {
    if (!user) return;
    updateCreator(user.id, data);
    if (data.name || data.avatar) {
      const updated = { ...user, ...(data.name && { name: data.name }), ...(data.avatar && { avatar: data.avatar }) };
      setUser(updated);
      localStorage.setItem('cookme_user', JSON.stringify(updated));
    }
  };

  const changePassword = (oldPass: string, newPass: string) => {
    if (!user) return { success: false, error: 'Not logged in.' };
    const creator = creators.find(c => c.id === user.id);
    if (!creator) return { success: false, error: 'Creator not found.' };
    if (creator.password !== oldPass) return { success: false, error: 'Current password is incorrect.' };
    if (newPass.length < 6) return { success: false, error: 'New password must be at least 6 characters.' };
    updateCreator(user.id, { password: newPass });
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{
      user, isLoading, login, logout,
      createCreator, updateCreator, deleteCreator, getCreators, getCreatorById,
      addRecipe, updateRecipe, deleteRecipe, getMyRecipes, getAllCreatorRecipes,
      addReel, deleteReel, getMyReels,
      updateProfile, changePassword,
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
