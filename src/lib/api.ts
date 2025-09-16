import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query"

import { authStorage } from "@/lib/auth-storage"
import type {
  LoginRequest,
  LoginResponse,
  User,
  ChangePasswordRequest,
  Space,
  SpaceField,
  AddMemberRequest,
  Note,
  CreateNoteRequest,
  Comment,
  CreateCommentRequest,
} from "@/types"
import { httpClient } from "@/lib/http-client"

export const api = {
  queries: {
    currentUser: () =>
      queryOptions({
        queryKey: ["currentUser"],
        queryFn: () => httpClient.get("api/v1/profile").json<User>(),
        staleTime: Infinity,
        gcTime: Infinity,
      }),
    spaces: () =>
      queryOptions({
        queryKey: ["spaces"],
        queryFn: () => httpClient.get("api/v1/spaces").json<Space[]>(),
        staleTime: Infinity,
        gcTime: Infinity,
      }),
    users: () =>
      queryOptions({
        queryKey: ["users"],
        queryFn: () => httpClient.get("api/v1/users").json<User[]>(),
        staleTime: Infinity,
        gcTime: Infinity,
      }),
    spaceNotes: (slug: string) =>
      queryOptions({
        queryKey: ["spaces", slug, "notes"],
        queryFn: () => httpClient.get(`api/v1/spaces/${slug}/notes`).json<Note[]>(),
        staleTime: 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000, // 5 minutes
      }),
    spaceNote: (slug: string, number: number) =>
      queryOptions({
        queryKey: ["spaces", slug, "notes", number],
        queryFn: () => httpClient.get(`api/v1/spaces/${slug}/notes/${String(number)}`).json<Note>(),
        staleTime: 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000, // 5 minutes
      }),
    noteComments: (slug: string, number: number) =>
      queryOptions({
        queryKey: ["spaces", slug, "notes", number, "comments"],
        queryFn: () => httpClient.get(`api/v1/spaces/${slug}/notes/${String(number)}/comments`).json<Comment[]>(),
        staleTime: 30 * 1000, // 30 seconds
        gcTime: 2 * 60 * 1000, // 2 minutes
      }),
  },
  mutations: {
    useLogin: () => {
      const queryClient = useQueryClient()

      return useMutation({
        mutationFn: (credentials: LoginRequest) =>
          httpClient.post("api/v1/auth/login", { json: credentials }).json<LoginResponse>(),
        onSuccess: async (response) => {
          authStorage.setAuthToken(response.token)
          // Fetch the current user after successful login
          await queryClient.invalidateQueries({ queryKey: ["currentUser"] })
        },
      })
    },

    useLogout: () => {
      const queryClient = useQueryClient()

      return useMutation({
        mutationFn: () => httpClient.post("api/v1/auth/logout"),
        onSuccess: () => {
          authStorage.clearAuthToken()
          queryClient.setQueryData(["currentUser"], null)
          queryClient.clear()
        },
      })
    },

    useChangePassword: () => {
      return useMutation({
        mutationFn: (data: ChangePasswordRequest) => httpClient.post("api/v1/profile/change-password", { json: data }),
      })
    },

    useAddSpaceField: () => {
      const queryClient = useQueryClient()

      return useMutation({
        mutationFn: ({ slug, field }: { slug: string; field: SpaceField }) =>
          httpClient.post(`api/v1/spaces/${slug}/fields`, { json: field }).json<Space>(),
        onSuccess: () => {
          // Invalidate spaces query to refresh the fields list
          void queryClient.invalidateQueries({ queryKey: ["spaces"] })
        },
      })
    },

    useAddMember: () => {
      const queryClient = useQueryClient()

      return useMutation({
        mutationFn: ({ slug, username }: { slug: string; username: string }) =>
          httpClient.post(`api/v1/spaces/${slug}/members`, { json: { username } as AddMemberRequest }).json<Space>(),
        onSuccess: () => {
          // Invalidate spaces query to refresh the members list
          void queryClient.invalidateQueries({ queryKey: ["spaces"] })
        },
      })
    },

    useRemoveMember: () => {
      const queryClient = useQueryClient()

      return useMutation({
        mutationFn: ({ slug, username }: { slug: string; username: string }) =>
          httpClient.delete(`api/v1/spaces/${slug}/members/${username}`),
        onSuccess: () => {
          // Invalidate spaces query to refresh the members list
          void queryClient.invalidateQueries({ queryKey: ["spaces"] })
        },
      })
    },

    useCreateNote: () => {
      const queryClient = useQueryClient()

      return useMutation({
        mutationFn: ({ slug, data }: { slug: string; data: CreateNoteRequest }) =>
          httpClient.post(`api/v1/spaces/${slug}/notes`, { json: data }).json<Note>(),
        onSuccess: (_data, variables) => {
          // Invalidate notes query to refresh the notes list
          void queryClient.invalidateQueries({ queryKey: ["spaces", variables.slug, "notes"] })
        },
      })
    },

    useDeleteSpace: () => {
      const queryClient = useQueryClient()

      return useMutation({
        mutationFn: (slug: string) => httpClient.delete(`api/v1/spaces/${slug}`),
        onSuccess: () => {
          // Clear all queries after deleting a space
          void queryClient.invalidateQueries({ queryKey: ["spaces"] })
        },
      })
    },

    useCreateComment: () => {
      const queryClient = useQueryClient()

      return useMutation({
        mutationFn: ({ slug, number, data }: { slug: string; number: number; data: CreateCommentRequest }) =>
          httpClient.post(`api/v1/spaces/${slug}/notes/${String(number)}/comments`, { json: data }).json<Comment>(),
        onSuccess: (_data, variables) => {
          // Invalidate comments query to refresh the comments list
          void queryClient.invalidateQueries({ queryKey: ["spaces", variables.slug, "notes", variables.number, "comments"] })
        },
      })
    },
  },
}
