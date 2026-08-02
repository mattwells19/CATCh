export const validateTurnstileToken = (
  turnstileToken: string,
): Promise<boolean> => {
  const formData = new FormData();
  formData.set("secret", import.meta.env.TURNSTILE_SECRET_KEY);
  formData.set("response", turnstileToken);

  return fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: formData,
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        return false;
      }
    })
    .then((data) => data.success as boolean)
    .catch(() => false);
};
