import { useSuspenseQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { cache } from "@/hooks/useCache"
import { formatRelativeTime } from "@/lib/formatters"
import type { Comment } from "@/types"

function CommentItem({ comment }: { comment: Comment }) {
  const author = cache.useUser(comment.author_id)

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-medium">{author.username}</span>
          <span className="text-sm text-muted-foreground">{formatRelativeTime(comment.created_at)}</span>
        </div>
      </div>

      <div className="whitespace-pre-wrap text-sm">{comment.content}</div>
    </div>
  )
}

export function CommentList({ slug, noteNumber }: { slug: string; noteNumber: number }) {
  // For now, just fetch first page of comments (no pagination UI yet)
  const { data: paginatedComments } = useSuspenseQuery(api.queries.noteComments(slug, noteNumber, 1, 50))
  const comments = paginatedComments.items

  if (comments.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No comments yet. Be the first to comment!</div>
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  )
}
