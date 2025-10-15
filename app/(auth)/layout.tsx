// app/(auth)/layout.tsx (แก้ไขให้เป็นแบบนี้)
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="auth-wrapper">{children}</div>;
}
