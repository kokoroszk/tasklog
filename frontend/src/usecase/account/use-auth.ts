import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { config } from 'config';

export const useAuth = () => {
  const router = useRouter();
  useEffect(() => {
    if (!isAllowed(router.pathname)) {
      fetch(`${config.backend.baseUrl}isSignedIn`, { credentials: 'same-origin' })
        .then((r) => {
          if (r.status !== 200) router.push('/signIn');
        })
        .catch(() => router.push('/signIn'));
    }
  }, []);
};

const allowed = ['signIn'];
const isAllowed = (currentPath: string) => allowed.some((p) => currentPath.startsWith(p));
