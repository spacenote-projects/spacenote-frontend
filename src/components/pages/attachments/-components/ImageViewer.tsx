export function ImageViewer({ url, filename }: { url: string; filename: string }) {
  return <img src={url} alt={filename} className="w-full h-auto rounded" />
}
