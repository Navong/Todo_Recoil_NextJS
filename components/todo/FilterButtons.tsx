// src/components/todo/FilterButtons.tsx
'use client';

import { useTodo } from '@/hooks/useTodo';
import { Button } from '@/components/ui/button';
import { TodoFilter } from '@/types/todo';

export const FilterButtons = () => {
  const { todos, filter, setFilter } = useTodo();
  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.filter(todo => todo.completed).length;

  const handleFilterChange = (newFilter: TodoFilter) => {
    setFilter(newFilter);
  };

  return (
    <div className="flex gap-2 mb-4">
      <Button
        variant={filter === 'all' ? 'default' : 'outline'}
        onClick={() => handleFilterChange('all')}
        size="sm"
      >
        All ({todos.length})
      </Button>
      <Button
        variant={filter === 'active' ? 'default' : 'outline'}
        onClick={() => handleFilterChange('active')}
        size="sm"
      >
        Active ({activeCount})
      </Button>
      <Button
        variant={filter === 'completed' ? 'default' : 'outline'}
        onClick={() => handleFilterChange('completed')}
        size="sm"
      >
        Completed ({completedCount})
      </Button>
    </div>
  );
};