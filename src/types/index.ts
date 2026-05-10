export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  video?: string;
  category: string;
  cuisine?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  prepTime: number;
  cookTime: number;
  servings: number;
  calories: number;
  ingredients: Ingredient[];
  steps: Step[];
  creator: Creator | any;
  likes?: number;
  saves?: number;
  comments?: number;
  views?: number;
  isSponsored?: boolean;
  isTrending?: boolean;
  tags: string[];
  createdAt: string;
}

export interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

export interface Step {
  number: number;
  title: string;
  description: string;
  image?: string;
  duration?: number;
}

export interface Creator {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  specialty: string;
  followers: number;
  recipes?: number;
  likes?: number;
  isVerified: boolean;
  joinedDate: string;
  socialLinks?: {
    instagram?: string;
    youtube?: string;
    twitter?: string;
    facebook?: string;
    threads?: string;
    mail?: string;
  };
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
  recipeCount: number;
  color: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  likes: number;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'sponsor' | 'user';
  savedRecipes: string[];
  likedRecipes: string[];
  following: string[];
}
