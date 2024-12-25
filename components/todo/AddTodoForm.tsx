'use client';

import { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { todosState } from '@/recoil/atoms';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Todo } from '@/types/todo';

export const AddTodoForm = () => {
  const [newTodo, setNewTodo] = useState('');
  const setTodos = useSetRecoilState(todosState);
  const queryClient = useQueryClient();

  const addTodoMutation = useMutation({
    mutationFn: async (text: string) => {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    },
    onMutate: async (text) => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: ['todos'] });

      // Snapshot the previous value
      const previousTodos = queryClient.getQueryData(['todos']);

      // Create optimistic todo
      const optimisticTodo: Todo = {
        id: `temp-${Date.now()}`,
        text,
        completed: false,
      };

      // Optimistically update React Query cache
      queryClient.setQueryData(['todos'], (old: Todo[] = []) =>
        [optimisticTodo, ...old]
      );

      // Also update Recoil state for UI consistency
      setTodos((old) => [optimisticTodo, ...old]);

      // Return context with snapshot
      return { previousTodos };
    },
    onError: (err, newTodo, context) => {
      // If mutation fails, restore previous values
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos);
        setTodos(context.previousTodos as Todo[]);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the correct data
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTodo = newTodo.trim();

    if (!trimmedTodo) return;

    try {
      await addTodoMutation.mutateAsync(trimmedTodo);
      setNewTodo(''); // Clear input only after successful mutation
    } catch (error) {
      // You might want to show an error message to the user here
      console.error('Failed to add todo:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <Input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Add a new todo..."
        className="flex-1"
        disabled={addTodoMutation.isPending}
      />
      <Button
        type="submit"
        disabled={addTodoMutation.isPending || !newTodo.trim()}
      >
        <Plus className="w-4 h-4 mr-2" />
        {addTodoMutation.isPending ? 'Adding...' : 'Add'}
      </Button>
    </form>
  );
};