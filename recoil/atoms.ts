'use client';

import { atom, selector } from 'recoil';
import { Todo, TodoFilter } from '@/types/todo';

export const todosState = atom<Todo[]>({
  key: 'todosState',
  default: [],
});

export const todoFilterState = atom<TodoFilter>({
  key: 'todoFilterState',
  default: 'all',
});

export const filteredTodosState = selector({
  key: 'filteredTodosState',
  get: ({get}) => {
    const filter = get(todoFilterState);
    const todos = get(todosState);

    switch (filter) {
      case 'active':
        return todos.filter((todo) => !todo.completed);
      case 'completed':
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  },
});

export const todoStatsState = selector({
  key: 'todoStatsState',
  get: ({get}) => {
    const todos = get(todosState);
    const activeCount = todos.filter(todo => !todo.completed).length;
    const completedCount = todos.filter(todo => todo.completed).length;
    const totalCount = todos.length;

    return {
      activeCount,
      completedCount,
      totalCount,
    };
  },
});