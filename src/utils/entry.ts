export function getExtension(filename: string) {
  return filename.slice(filename.lastIndexOf('.') + 1)
}
