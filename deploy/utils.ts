/**
 * Checking file
 * @param { String } path
 */
export const exists = async (path: string): Promise<boolean> => {
  const r = await Deno.lstat(path).catch(() => null);
  return r !== null;
}
