/** Rules for admin passwords. Shared by the reset form (live checklist) and the API (enforcement). */
export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 12;

export const passwordRules: { label: string; test: (pw: string) => boolean }[] = [
  {
    label: `${PASSWORD_MIN}–${PASSWORD_MAX} characters`,
    test: (pw) => pw.length >= PASSWORD_MIN && pw.length <= PASSWORD_MAX,
  },
  { label: "One uppercase letter (A–Z)", test: (pw) => /[A-Z]/.test(pw) },
  { label: "One lowercase letter (a–z)", test: (pw) => /[a-z]/.test(pw) },
  { label: "One number (0–9)", test: (pw) => /[0-9]/.test(pw) },
  { label: "One special character (e.g. ! @ # $ %)", test: (pw) => /[^A-Za-z0-9\s]/.test(pw) },
  { label: "No spaces", test: (pw) => pw.length > 0 && !/\s/.test(pw) },
];

/** Returns the first rule the password breaks, or null if it passes them all. */
export function passwordError(pw: string): string | null {
  const failed = passwordRules.find((r) => !r.test(pw));
  if (!failed) return null;
  return `Password needs: ${failed.label.charAt(0).toLowerCase()}${failed.label.slice(1)}.`;
}
