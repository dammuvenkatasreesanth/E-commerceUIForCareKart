// Manual integration instead of a wrapper package (react-facebook-login is
// unmaintained) — this is exactly what a maintained wrapper does internally:
// inject the official SDK script once, then drive it via the window.FB global.
declare global {
  interface Window {
    FB?: {
      init: (params: { appId: string; cookie: boolean; xfbml: boolean; version: string }) => void;
      login: (
        callback: (response: {
          authResponse: { accessToken: string; userID: string } | null;
          status: string;
        }) => void,
        params: { scope: string },
      ) => void;
    };
    fbAsyncInit?: () => void;
  }
}

let loadPromise: Promise<void> | null = null;

export function loadFacebookSdk(appId: string): Promise<void> {
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve) => {
    window.fbAsyncInit = () => {
      window.FB?.init({ appId, cookie: false, xfbml: false, version: "v21.0" });
      resolve();
    };

    if (document.getElementById("facebook-jssdk")) return;
    const script = document.createElement("script");
    script.id = "facebook-jssdk";
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  });

  return loadPromise;
}

export function facebookLoginPopup(): Promise<{ accessToken: string; userId: string } | null> {
  return new Promise((resolve, reject) => {
    if (!window.FB) {
      reject(new Error("Facebook SDK failed to load."));
      return;
    }
    window.FB.login((response) => {
      if (response.authResponse) {
        resolve({ accessToken: response.authResponse.accessToken, userId: response.authResponse.userID });
      } else {
        resolve(null); // user cancelled or declined permissions
      }
    }, { scope: "email" });
  });
}
