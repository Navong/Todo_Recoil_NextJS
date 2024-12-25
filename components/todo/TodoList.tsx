'use client';

import { useRecoilValue } from 'recoil';
import { todoFilterState } from '@/recoil/atoms';
import { TodoItem } from './TodoItem';
import { useQuery } from '@tanstack/react-query';
import { Todo } from '@/types/todo';

export const TodoList = () => {
  const filter = useRecoilValue(todoFilterState);
  
  // Fetch todos using React Query
  const { data: todos = [], isLoading, isError } = useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const response = await fetch('/api/todos');
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    },
  });

  // Filter todos based on Recoil filter state
  const filteredTodos = todos.filter((todo: Todo) => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  if (isLoading) {
    return (
      <div className="text-center py-8 text-gray-500">
        Loading todos...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8 text-red-500">
        Error loading todos. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {filteredTodos.map((todo: Todo) => (
      <TodoItem key={todo.id} todo={todo} />
      ))}
      {filteredTodos.length === 0 && (
      <div className="text-center py-8 text-gray-500">
        {filter === 'all' ? (
        "No todos yet. Add one above!"
        ) : filter === 'active' ? (
        "No active todos!"
        ) : (
        "No completed todos!"
        )}
      </div>
      )}
    </div>
  );
};