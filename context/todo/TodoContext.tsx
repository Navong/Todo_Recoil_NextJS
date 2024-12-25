"use client"

import { createContext } from 'react';
import { TodoContextType } from '@/types/todo';

export const TodoContext = createContext<TodoContextType | null>(null);