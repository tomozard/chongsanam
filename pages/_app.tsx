import { GitHubBanner, Refine } from '@refinedev/core';
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar';
import {
  notificationProvider,
  RefineThemes,
  ThemedLayoutV2,
  ThemedTitleV2,
} from '@refinedev/mantine';
import routerProvider, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from '@refinedev/nextjs-router';
import type { NextPage } from 'next';
import { AppProps } from 'next/app';

import { Header } from '@components/header';
import {
  ColorScheme,
  ColorSchemeProvider,
  Global,
  MantineProvider,
} from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { NotificationsProvider } from '@mantine/notifications';
// import dataProvider, { GraphQLClient } from '@refinedev/hasura';
import { appWithTranslation, useTranslation } from 'next-i18next';
import { authProvider } from 'src/authProvider';
import { AppIcon } from 'src/components/app-icon';
import dataProvider from 'src/nhost/src/dataProvider';
// import { NhostAuthProvider } from '@nhost/react-auth';

import { nhost } from 'src/utility';

// const API_URL = 'https://flowing-mammal-24.hasura.app/v1/graphql';

// const client = new GraphQLClient(API_URL, {
//   headers: {
//     'x-hasura-role': 'public',
//   },
// });

// highlight-start
import { NhostProvider } from '@nhost/nextjs';
// highlight-end

// highlight-start
// const nhost = new NhostClient({
//   subdomain: process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN || '',
//   region: process.env.NEXT_PUBLIC_NHOST_REGION || '',
// });
// highlight-end

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  noLayout?: boolean;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout): JSX.Element {
  const renderComponent = () => {
    if (Component.noLayout) {
      return <Component {...pageProps} />;
    }

    return (
      <ThemedLayoutV2
        Header={() => <Header sticky />}
        Title={({ collapsed }) => (
          <ThemedTitleV2
            collapsed={collapsed}
            text='Chong Sanam'
            icon={<AppIcon />}
          />
        )}
      >
        <Component {...pageProps} />
      </ThemedLayoutV2>
    );
  };

  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'light',
    getInitialValueInEffect: true,
  });
  const { t, i18n } = useTranslation();
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  return (
    <>
      <NhostProvider nhost={nhost} initial={pageProps.nhostSession}>
        <RefineKbarProvider>
          <ColorSchemeProvider
            colorScheme={colorScheme}
            toggleColorScheme={toggleColorScheme}
          >
            {/* You can change the theme colors here. example: theme={{ ...RefineThemes.Magenta, colorScheme:colorScheme }} */}
            <MantineProvider
              theme={{ ...RefineThemes.Purple, colorScheme: colorScheme }}
              withNormalizeCSS
              withGlobalStyles
            >
              <Global styles={{ body: { WebkitFontSmoothing: 'auto' } }} />
              <NotificationsProvider position='top-right'>
                <Refine
                  routerProvider={routerProvider}
                  dataProvider={dataProvider(nhost)}
                  notificationProvider={notificationProvider}
                  authProvider={authProvider}
                  i18nProvider={i18nProvider}
                  resources={[
                    // {
                    //   name: 'blog_posts',
                    //   list: '/blog-posts',
                    //   create: '/blog-posts/create',
                    //   edit: '/blog-posts/edit/:id',
                    //   show: '/blog-posts/show/:id',
                    //   meta: {
                    //     canDelete: true,
                    //   },
                    // },
                    {
                      name: 'stadium_type',
                      list: '/categories',
                      create: '/categories/create',
                      edit: '/categories/edit/:id',
                      show: '/categories/show/:id',
                      meta: {
                        canDelete: true,
                      },
                    },
                  ]}
                  options={{
                    syncWithLocation: true,
                    warnWhenUnsavedChanges: true,
                  }}
                >
                  {renderComponent()}
                  <RefineKbar />
                  <UnsavedChangesNotifier />
                  <DocumentTitleHandler />
                </Refine>
              </NotificationsProvider>
            </MantineProvider>
          </ColorSchemeProvider>
        </RefineKbarProvider>
      </NhostProvider>
    </>
  );
}

export default appWithTranslation(MyApp);
