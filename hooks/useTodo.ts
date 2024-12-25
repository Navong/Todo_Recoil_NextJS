// src/hooks/useTodo.ts
'use client';

import { useContext } from 'react';
import { TodoContext } from '@/context/todo/TodoContext';
import { TodoContextType } from '@/types/todo';

export const useTodo = (): TodoContextType => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
};