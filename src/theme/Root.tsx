import type {ReactNode} from 'react';
import {useEffect} from 'react';
import {useLocation} from '@docusaurus/router';

type RootProps = {
  children: ReactNode;
};

export default function Root({children}: RootProps): ReactNode {
  const location = useLocation();

  useEffect(() => {
    const applySearchLabels = () => {
      document
        .querySelectorAll<HTMLInputElement>('input.navbar__search-input, input[type="search"][name="q"]')
        .forEach((input) => {
          input.setAttribute('aria-label', 'Поиск');
          input.setAttribute('placeholder', 'Поиск по документации');
          input.setAttribute('enterkeyhint', 'search');
          input.setAttribute('autocomplete', 'off');
        });

      document
        .querySelectorAll<HTMLElement>('.navbar__search-input, .searchBarContainer button, [class*="searchBarContainer"] button')
        .forEach((element) => {
          element.setAttribute('title', 'Открыть поиск по документации');
        });
    };

    applySearchLabels();

    const observer = new MutationObserver(() => {
      applySearchLabels();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [location.pathname]);

  return children;
}
