import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { WebStorageStateStore } from "oidc-client-ts";
import { AuthProvider, useAuth } from "react-oidc-context";
import { LogIn, LogOut } from "lucide-react";
import { useLanguage } from "./i18n";

type AuthConfig = { authority: string; domain: string; clientId: string };

export function useAuthConfig() {
  const [config, setConfig] = useState<AuthConfig | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    setFailed(false);
    fetch("/api/config")
      .then((response) => {
        if (!response.ok) throw new Error(`config: ${response.status}`);
        return response.json();
      })
      .then(setConfig, () => setFailed(true));
  }, [attempt]);
  return { config, failed, retry: () => setAttempt((value) => value + 1) };
}

// Cognito managed login: authorization code flow with PKCE. Cognito's
// logout endpoint is not in its discovery document, so it is seeded here.
export function SignInProvider({
  config,
  children,
}: {
  config: AuthConfig;
  children: ReactNode;
}) {
  const origin = window.location.origin;
  return (
    <AuthProvider
      authority={config.authority}
      client_id={config.clientId}
      redirect_uri={origin}
      scope="openid email"
      metadataSeed={{ end_session_endpoint: `https://${config.domain}/logout` }}
      userStore={new WebStorageStateStore({ store: window.localStorage })}
      onSigninCallback={() =>
        window.history.replaceState(null, "", window.location.pathname)
      }
    >
      {children}
    </AuthProvider>
  );
}

export function AccountButton() {
  const auth = useAuth();
  const { language, t } = useLanguage();
  if (auth.isAuthenticated)
    return (
      <button
        className="account-button"
        title={auth.user?.profile.email}
        onClick={() =>
          // Cognito's logout needs client_id, which oidc-client-ts omits
          // when it sends an id_token_hint.
          auth.signoutRedirect({
            extraQueryParams: {
              client_id: auth.settings.client_id,
              logout_uri: window.location.origin,
            },
          })
        }
      >
        <LogOut size={16} />
        {t("Sign out")}
      </button>
    );
  return (
    <button
      className="account-button"
      onClick={() => auth.signinRedirect({ extraQueryParams: { lang: language } })}
    >
      <LogIn size={16} />
      {t("Sign in")}
    </button>
  );
}
