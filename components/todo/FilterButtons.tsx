'use client';

import { useRecoilState } from 'recoil';
import { todoFilterState } from '@/recoil/atoms';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { Todo, TodoFilter } from '@/types/todo';

export const FilterButtons = () => {
  const [filter, setFilter] = useRecoilState(todoFilterState);
  
  // Fetch todos using React Query
  const { data: todos = [] } = useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const response = await fetch('/api/todos');
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    },
  });

  // Calculate stats from the fetched todos
  const stats = {
    totalCount: todos.length,
    activeCount: todos.filter((todo: Todo) => !todo.completed).length,
    completedCount: todos.filter((todo: Todo) => todo.completed).length,
  };

  return (
    <div className="flex gap-2 mb-4">
      <Button
        variant={filter === 'all' ? 'default' : 'outline'}
        onClick={() => setFilter('all')}
        size="sm"
      >
        All ({stats.totalCount})
      </Button>
      <Button
        variant={filter === 'active' ? 'default' : 'outline'}
        onClick={() => setFilter('active')}
        size="sm"
      >
        Active ({stats.activeCount})
      </Button>
      <Button
        variant={filter === 'completed' ? 'default' : 'outline'}
        onClick={() => setFilter('completed')}
        size="sm"
      >
        Completed ({stats.completedCount})
      </Button>
    </div>
  );
};