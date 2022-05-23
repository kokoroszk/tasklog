import { useRouter } from 'next/router';
import { config } from 'config/index';

export const useSignInFunction = () => {
  const router = useRouter();

  return async (id: string, password: string) => {
    try {
      const currentProjectId = await request(id, password);
      if (!currentProjectId) throw Error();

      router.push(`${currentProjectId}/projects`);
      return true;
    } catch {
      return false;
    }
  };
};

const request = (id: string, password: string) =>
  fetch(`${config.backend.baseUrl}signIn`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      id,
      password,
    }),
    credentials: 'include',
  })
    .then((res) => res.json())
    .then((json) => json.currentProjectId);
