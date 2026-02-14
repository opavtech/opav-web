// Utility to execute Google reCAPTCHA v3
export async function executeRecaptcha(action: string): Promise<string | null> {
  if (typeof window === "undefined") return null;

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  if (!siteKey) {
    console.warn("reCAPTCHA site key not configured");
    return null;
  }

  try {
    // Wait for reCAPTCHA to load
    await new Promise<void>((resolve) => {
      const checkRecaptcha = () => {
        const grecaptcha = window.grecaptcha;
        if (grecaptcha) {
          grecaptcha.ready(() => resolve());
        } else {
          setTimeout(checkRecaptcha, 100);
        }
      };
      checkRecaptcha();
    });

    // Execute reCAPTCHA
    const grecaptcha = window.grecaptcha;
    if (!grecaptcha) return null;

    const token = await grecaptcha.execute(siteKey, { action });
    return token;
  } catch (error) {
    console.error("reCAPTCHA execution failed:", error);
    return null;
  }
}

// Add global type for grecaptcha
declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (
        siteKey: string,
        options: { action: string },
      ) => Promise<string>;
    };
  }
}
