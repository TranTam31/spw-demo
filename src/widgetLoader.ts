export async function loadWidgetBundle(url: string) {
  await import(/* @vite-ignore */ url);
}
