export function PdfViewer({ url, filename }: { url: string; filename: string }) {
  return <iframe src={url} title={filename} className="w-full h-[70vh] border rounded" />
}
