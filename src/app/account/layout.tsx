export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto max-w-4xl py-8 md:py-12">
      {children}
    </div>
  );
}
