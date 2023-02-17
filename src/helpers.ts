export function outputAlfredItems(
  items: Record<string, any>[],
  additionals: Record<string, any> = {}
) {
  console.log(
    JSON.stringify({
      ...additionals,

      items,
    })
  );
}
