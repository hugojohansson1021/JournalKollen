// components/GoogleAnalytics.js

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { pageview } from '../utils/gtag';

const GoogleAnalytics = () => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      pageview(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return null;
};

export default GoogleAnalytics;
