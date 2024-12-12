import MyRecipe from "./page";

export default async function Layout({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  return (
    <div className="flex flex-col overflow-x-hidden">
      <MyRecipe id={id} />
    </div>
  );
}
