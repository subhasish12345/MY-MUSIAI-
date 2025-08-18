export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto max-w-5xl py-8 md:py-12">
      {children}
    </div>
  );
}
