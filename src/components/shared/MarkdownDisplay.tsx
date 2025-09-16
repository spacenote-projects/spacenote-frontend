import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface MarkdownDisplayProps {
  content: string
  className?: string
}

export default function MarkdownDisplay({ content, className }: MarkdownDisplayProps) {
  return (
    <div className={className}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">{children}</h1>,
          h2: ({ children }) => (
            <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">{children}</h3>,
          h4: ({ children }) => <h4 className="mt-8 scroll-m-20 text-xl font-semibold tracking-tight">{children}</h4>,
          h5: ({ children }) => <h5 className="mt-8 text-lg font-semibold tracking-tight">{children}</h5>,
          h6: ({ children }) => <h6 className="mt-8 text-base font-semibold tracking-tight">{children}</h6>,
          p: ({ children }) => <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>,
          ul: ({ children }) => <ul className="my-6 ml-6 list-disc [&>li]:mt-2">{children}</ul>,
          ol: ({ children }) => <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">{children}</ol>,
          li: ({ children }) => <li>{children}</li>,
          a: ({ children, href }) => (
            <a
              href={href}
              className="font-medium text-primary underline underline-offset-4 hover:no-underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => <blockquote className="mt-6 border-l-2 pl-6 italic">{children}</blockquote>,
          code: ({ className, children }) => {
            const isInline = !className
            if (isInline) {
              return (
                <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                  {children}
                </code>
              )
            }
            return (
              <code className="relative block rounded-lg bg-muted p-4 font-mono text-sm overflow-x-auto my-6">{children}</code>
            )
          },
          pre: ({ children }) => <pre className="overflow-x-auto">{children}</pre>,
          table: ({ children }) => (
            <div className="my-6 w-full overflow-y-auto">
              <table className="w-full">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="border-b">{children}</thead>,
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => <tr className="m-0 border-t p-0 even:bg-muted">{children}</tr>,
          th: ({ children }) => (
            <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">{children}</td>
          ),
          hr: () => <hr className="my-4 md:my-8" />,
        }}
      >
        {content}
      </Markdown>
    </div>
  )
}
