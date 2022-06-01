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
      // SPAを再読み込みして状態をリフレッシュしたい
      window.location.href = `/signIn`;
    }
  };
};

const request = () => fetch(`${config.backend.baseUrl}signOut`, { credentials: 'same-origin' });
