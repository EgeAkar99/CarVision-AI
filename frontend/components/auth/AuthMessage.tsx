type AuthMessageProps = {
  error?: string;
  success?: string;
};

export default function AuthMessage({
  error,
  success,
}: AuthMessageProps) {
  if (!error && !success) {
    return null;
  }

  const isError = Boolean(error);
  const message = error ?? success;

  return (
    <div
      role="alert"
      className={`mb-5 rounded-2xl border px-4 py-3 text-sm leading-6 ${
        isError
          ? "border-red-400/20 bg-red-400/10 text-red-200"
          : "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
      }`}
    >
      {message}
    </div>
  );
}
