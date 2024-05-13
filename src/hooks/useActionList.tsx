import { functionTemplatePage } from '@/api';
import { useQuery } from '@tanstack/react-query';

export function useActionList(kindId: string) {
  const { data } = useQuery({
    queryKey: ['functionTemplatePage'],
    queryFn: () => functionTemplatePage(),
  });
  if (Array.isArray(data)) {
    if (kindId) {
      return data.filter((item) => {
        if (kindId === '0') {
          return item.kindId === '0';
        } else {
          return item.kindId !== '0' && item.kindId !== '1';
        }
      });
    }
    return data;
  }
  return [];
}
