export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col overflow-x-hidden h-max bg-white">
      {children}
    </div>
  );
}
