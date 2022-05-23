import { useRouter } from 'next/router';
import { config } from 'config/index';

export const useSignOutFunction = () => {
  const router = useRouter();

  return async () => {
    try {
      request();
    } catch {
      // TODO
    } finally {
      router.push(`/signIn`);
    }
  };
};

const request = () => fetch(`${config.backend.baseUrl}signOut`, { credentials: 'same-origin' });
