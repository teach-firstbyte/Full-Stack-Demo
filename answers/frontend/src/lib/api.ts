const API_BASE = import.meta.env.VITE_API_URL ?? '';

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = API_BASE ? `${API_BASE}${path}` : path;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? 'Request failed');
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  getHabits: () => request<{ id: string; name: string; color: string; created_at: string }[]>('/api/habits'),

  addHabit: (name: string, color: string) =>
    request<{ id: string; name: string; color: string; created_at: string }>('/api/habits', {
      method: 'POST',
      body: JSON.stringify({ name, color }),
    }),

  deleteHabit: (id: string) =>
    request<void>(`/api/habits/${id}`, { method: 'DELETE' }),

  getCompletions: (date: string) =>
    request<{ id: string; habit_id: string; completion_date: string; created_at: string }[]>(
      `/api/completions?date=${encodeURIComponent(date)}`
    ),

  toggleCompletion: (habitId: string, date: string) =>
    request<{ completed: boolean; data?: { id: string; habit_id: string; completion_date: string; created_at: string } }>(
      '/api/completions/toggle',
      {
        method: 'POST',
        body: JSON.stringify({ habitId, date }),
      }
    ),
};
