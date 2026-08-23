/**
 * Les hooks mock / API paginée renvoient { data: T[] }.
 * Les pages attendent un tableau. Cette fonction normalise les deux formes.
 */
export function unwrapList<T>(result: unknown): T[] {
  if (Array.isArray(result)) {
    return result as T[];
  }
  if (result && typeof result === 'object' && 'data' in result) {
    const data = (result as { data: unknown }).data;
    if (Array.isArray(data)) {
      return data as T[];
    }
  }
  return [];
}
