import { Habit } from '../types';
const API_URL = 'http://localhost:3001';

export async function apiFetch<T>(
  url: string,
  options: { method: string; body?: Habit }
): Promise<T> {

  const res: Response = await fetch(API_URL + url, {
    method: options.method,
    body: options.body ? JSON.stringify(options.body) : undefined,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  // If the response is 204, return null (Deleted Habit)
  if (res.status === 204) return null as T;

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}
