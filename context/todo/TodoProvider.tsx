"use client"

import { ReactNode, useReducer, useState } from 'react';
import { TodoContext } from './TodoContext';
import { todoReducer } from './todoReducer';
import { TodoFilter } from '@/types/todo';

interface TodoProviderProps {
  children: ReactNode;
}

export const TodoProvider = ({ children }: TodoProviderProps) => {
  const [todos, dispatch] = useReducer(todoReducer, []);
  const [filter, setFilter] = useState<TodoFilter>('all');

  return (
    <TodoContext.Provider value={{ todos, dispatch, filter, setFilter }}>
      {children}
    </TodoContext.Provider>
  );
};