import type { User as FirebaseUser } from '@firebase/auth';

export enum Category {
  Know = 'Know',
  Feel = 'Feel',
  Do = 'Do',
  Be = 'Be',
}

export interface ListItemData {
  id: string;
  text: string;
}

export type KFDBCategories = {
  [Category.Know]: ListItemData[];
  [Category.Feel]: ListItemData[];
  [Category.Do]: ListItemData[];
  [Category.Be]: ListItemData[];
};

export interface Suggestion {
  id: string;
  text: string;
  category: Category;
}

export interface AssistantMessage {
  id:string;
  role: 'user' | 'assistant' | 'system';
  content: React.ReactNode;
  suggestions?: Suggestion[];
  suggestionCategory?: Category;
}

export type User = FirebaseUser;

export interface Session {
  id: string;
  userId: string;
  topic: string;
  title: string;
  know: string[];
  feel: string[];
  do: string[];
  be: string[];
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
}