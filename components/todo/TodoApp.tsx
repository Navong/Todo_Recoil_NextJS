'use client';

import { RecoilRoot } from 'recoil';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AddTodoForm } from './AddTodoForm';
import { FilterButtons } from './FilterButtons';
import { TodoList } from './TodoList';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export const TodoApp = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Todo List</CardTitle>
          </CardHeader>
          <CardContent>
            <AddTodoForm />
            <FilterButtons />
            <TodoList />
          </CardContent>
        </Card>
      </RecoilRoot>
    </QueryClientProvider>
  );
};