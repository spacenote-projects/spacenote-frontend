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
  UpdateNoteFieldsRequest,
  Comment,
  CreateCommentRequest,
  CreateSpaceRequest,
  CreateUserRequest,
  NotePaginationResult,
  CommentPaginationResult,
  UpdateSpaceTemplateRequest,
  ExportData,
  UpdateListFieldsRequest,
  UpdateHiddenCreateFieldsRequest,
  Filter,
  FieldType,
  FilterOperator,
} from "@/types"
import { httpClient } from "@/lib/http-client"

export const api = {
  queries: {
    /** Get the current authenticated user */
    currentUser: () =>
      queryOptions({
        queryKey: ["currentUser"],
        queryFn: () => httpClient.get("api/v1/profile").json<User>(),
        staleTime: Infinity,
        gcTime: Infinity,
      }),
    /** Get all spaces the user has access to */
    spaces: () =>
      queryOptions({
        queryKey: ["spaces"],
        queryFn: () => httpClient.get("api/v1/spaces").json<Space[]>(),
        staleTime: Infinity,
        gcTime: Infinity,
      }),
    /** Get all users in the system */
    users: () =>
      queryOptions({
        queryKey: ["users"],
        queryFn: () => httpClient.get("api/v1/users").json<User[]>(),
        staleTime: Infinity,
        gcTime: Infinity,
      }),
    /** Get paginated notes for a space */
    spaceNotes: (slug: string, page = 1, limit = 50, filter?: string) =>
      queryOptions({
        queryKey: ["spaces", slug, "notes", page, limit, filter],
        queryFn: () => {
          const offset = (page - 1) * limit
          const searchParams = new URLSearchParams({
            limit: String(limit),
            offset: String(offset),
          })
          if (filter) {
            searchParams.set("filter", filter)
          }
          return httpClient.get(`api/v1/spaces/${slug}/notes?${searchParams}`).json<NotePaginationResult>()
        },
        staleTime: 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000, // 5 minutes
      }),
    /** Get a specific note by number */
    spaceNote: (slug: string, number: number) =>
      queryOptions({
        queryKey: ["spaces", slug, "notes", number],
        queryFn: () => httpClient.get(`api/v1/spaces/${slug}/notes/${String(number)}`).json<Note>(),
        staleTime: 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000, // 5 minutes
      }),
    /** Get paginated comments for a note */
    noteComments: (slug: string, number: number, page = 1, limit = 50) =>
      queryOptions({
        queryKey: ["spaces", slug, "notes", number, "comments", page, limit],
        queryFn: () => {
          const offset = (page - 1) * limit
          const searchParams = new URLSearchParams({
            limit: String(limit),
            offset: String(offset),
          })
          return httpClient
            .get(`api/v1/spaces/${slug}/notes/${String(number)}/comments?${searchParams}`)
            .json<CommentPaginationResult>()
        },
        staleTime: 30 * 1000, // 30 seconds
        gcTime: 2 * 60 * 1000, // 2 minutes
      }),
    /** Export all space data */
    spaceExport: (slug: string, includeData = false) =>
      queryOptions({
        queryKey: ["spaces", slug, "export", includeData],
        queryFn: () => {
          const searchParams = new URLSearchParams()
          if (includeData) {
            searchParams.set("include_data", "true")
          }
          const url = searchParams.toString() ? `api/v1/spaces/${slug}/export?${searchParams}` : `api/v1/spaces/${slug}/export`
          return httpClient.get(url).json<ExportData>()
        },
      }),
    /** Get field operators metadata */
    fieldOperators: () =>
      queryOptions({
        queryKey: ["fieldOperators"],
        queryFn: () => httpClient.get("api/v1/metadata/field-operators").json<Record<FieldType, FilterOperator[]>>(),
        staleTime: Infinity,
        gcTime: Infinity,
      }),
  },
  mutations: {
    /** Authenticate user and store token */
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

    /** Clear authentication and cache */
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

    /** Update user password */
    useChangePassword: () => {
      return useMutation({
        mutationFn: (data: ChangePasswordRequest) => httpClient.post("api/v1/profile/change-password", { json: data }),
      })
    },

    /** Create a new space */
    useCreateSpace: () => {
      const queryClient = useQueryClient()

      return useMutation({
        mutationFn: (data: CreateSpaceRequest) => httpClient.post("api/v1/spaces", { json: data }).json<Space>(),
        onSuccess: async () => {
          // Refetch spaces to ensure cache is updated before navigation
          await queryClient.refetchQueries({ queryKey: ["spaces"] })
        },
      })
    },

    /** Import a space from JSON export */
    useImportSpace: () => {
      const queryClient = useQueryClient()

      return useMutation({
        mutationFn: (params: { data: ExportData; newSlug?: string; createMissingUsers?: boolean }) => {
          const searchParams = new URLSearchParams()
          if (params.newSlug) searchParams.append("new_slug", params.newSlug)
          if (params.createMissingUsers) searchParams.append("create_missing_users", "true")
          const url = searchParams.toString() ? `api/v1/spaces/import?${searchParams}` : "api/v1/spaces/import"
          return httpClient.post(url, { json: params.data }).json<Space>()
        },
        onSuccess: async (_data, variables) => {
          // Refetch spaces to ensure cache is updated before navigation
          await queryClient.refetchQueries({ queryKey: ["spaces"] })
          // If users were created, invalidate users cache
          if (variables.createMissingUsers) {
            void queryClient.invalidateQueries({ queryKey: ["users"] })
          }
        },
      })
    },

    /** Add a field to space schema */
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

    /** Remove a field from space schema */
    useRemoveSpaceField: () => {
      const queryClient = useQueryClient()

      return useMutation({
        mutationFn: ({ slug, fieldName }: { slug: string; fieldName: string }) =>
          httpClient.delete(`api/v1/spaces/${slug}/fields/${fieldName}`),
        onSuccess: () => {
          // Invalidate spaces query to refresh the fields list
          void queryClient.invalidateQueries({ queryKey: ["spaces"] })
        },
      })
    },

    /** Add member to a space */
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

    /** Remove member from a space */
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

    /** Update list fields for a space */
    useUpdateListFields: () => {
      const queryClient = useQueryClient()

      return useMutation({
        mutationFn: ({ slug, fieldNames }: { slug: string; fieldNames: string[] }) =>
          httpClient
            .patch(`api/v1/spaces/${slug}/list-fields`, { json: { field_ids: fieldNames } as UpdateListFieldsRequest })
            .json<Space>(),
        onSuccess: () => {
          // Invalidate spaces query to refresh the list fields
          void queryClient.invalidateQueries({ queryKey: ["spaces"] })
        },
      })
    },

    /** Update hidden create fields for a space */
    useUpdateHiddenCreateFields: () => {
      const queryClient = useQueryClient()

      return useMutation({
        mutationFn: ({ slug, fieldNames }: { slug: string; fieldNames: string[] }) =>
          httpClient
            .patch(`api/v1/spaces/${slug}/hidden-create-fields`, {
              json: { field_ids: fieldNames } as UpdateHiddenCreateFieldsRequest,
            })
            .json<Space>(),
        onSuccess: () => {
          // Invalidate spaces query to refresh the hidden create fields
          void queryClient.invalidateQueries({ queryKey: ["spaces"] })
        },
      })
    },

    /** Create a new note in a space */
    useCreateNote: () => {
      const queryClient = useQueryClient()

      return useMutation({
        mutationFn: ({ slug, data }: { slug: string; data: CreateNoteRequest }) =>
          httpClient.post(`api/v1/spaces/${slug}/notes`, { json: data }).json<Note>(),
        onSuccess: (_data, variables) => {
          // Invalidate all pages of notes query to refresh the notes list
          void queryClient.invalidateQueries({ queryKey: ["spaces", variables.slug, "notes"], exact: false })
        },
      })
    },

    /** Delete a space permanently */
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

    /** Update note fields */
    useUpdateNoteFields: () => {
      const queryClient = useQueryClient()

      return useMutation({
        mutationFn: ({ slug, number, data }: { slug: string; number: number; data: UpdateNoteFieldsRequest }) =>
          httpClient.patch(`api/v1/spaces/${slug}/notes/${String(number)}`, { json: data }).json<Note>(),
        onSuccess: (_data, variables) => {
          // Invalidate the specific note query to refresh the data
          void queryClient.invalidateQueries({
            queryKey: ["spaces", variables.slug, "notes", variables.number],
          })
        },
      })
    },

    /** Add comment to a note */
    useCreateComment: () => {
      const queryClient = useQueryClient()

      return useMutation({
        mutationFn: ({ slug, number, data }: { slug: string; number: number; data: CreateCommentRequest }) =>
          httpClient.post(`api/v1/spaces/${slug}/notes/${String(number)}/comments`, { json: data }).json<Comment>(),
        onSuccess: (_data, variables) => {
          // Invalidate all pages of comments query to refresh the comments list
          void queryClient.invalidateQueries({
            queryKey: ["spaces", variables.slug, "notes", variables.number, "comments"],
            exact: false,
          })
        },
      })
    },

    /** Update space note template */
    useUpdateSpaceTemplate: () => {
      const queryClient = useQueryClient()

      return useMutation({
        mutationFn: (variables: { slug: string; data: UpdateSpaceTemplateRequest }) =>
          httpClient.patch(`api/v1/spaces/${variables.slug}/templates`, { json: variables.data }).json<Space>(),
        onSuccess: (space) => {
          // Update the space in cache
          void queryClient.setQueryData(["spaces"], (oldSpaces: Space[] | undefined) => {
            if (!oldSpaces) return oldSpaces
            return oldSpaces.map((s) => (s.slug === space.slug ? space : s))
          })
        },
      })
    },

    /** Add filter to a space */
    useAddFilter: () => {
      const queryClient = useQueryClient()

      return useMutation({
        mutationFn: ({ slug, filter }: { slug: string; filter: Filter }) =>
          httpClient.post(`api/v1/spaces/${slug}/filters`, { json: filter }).json<Space>(),
        onSuccess: () => {
          // Invalidate spaces query to refresh the filters list
          void queryClient.invalidateQueries({ queryKey: ["spaces"] })
        },
      })
    },

    /** Remove filter from a space */
    useRemoveFilter: () => {
      const queryClient = useQueryClient()

      return useMutation({
        mutationFn: ({ slug, filterName }: { slug: string; filterName: string }) =>
          httpClient.delete(`api/v1/spaces/${slug}/filters/${filterName}`),
        onSuccess: () => {
          // Invalidate spaces query to refresh the filters list
          void queryClient.invalidateQueries({ queryKey: ["spaces"] })
        },
      })
    },

    /** Update space title */
    useUpdateSpaceTitle: () => {
      const queryClient = useQueryClient()

      return useMutation({
        mutationFn: ({ slug, title }: { slug: string; title: string }) =>
          httpClient.patch(`api/v1/spaces/${slug}/title`, { json: { title } }).json<Space>(),
        onSuccess: () => {
          // Invalidate spaces query to refresh the space data
          void queryClient.invalidateQueries({ queryKey: ["spaces"] })
        },
      })
    },

    /** Update space slug */
    useUpdateSpaceSlug: () => {
      const queryClient = useQueryClient()

      return useMutation({
        mutationFn: ({ slug, newSlug }: { slug: string; newSlug: string }) =>
          httpClient.patch(`api/v1/spaces/${slug}/slug`, { json: { new_slug: newSlug } }).json<Space>(),
        onSuccess: () => {
          // Invalidate spaces query to refresh the space data
          void queryClient.invalidateQueries({ queryKey: ["spaces"] })
        },
      })
    },

    /** Update space description */
    useUpdateSpaceDescription: () => {
      const queryClient = useQueryClient()

      return useMutation({
        mutationFn: ({ slug, description }: { slug: string; description: string }) =>
          httpClient.patch(`api/v1/spaces/${slug}/description`, { json: { description } }).json<Space>(),
        onSuccess: () => {
          // Invalidate spaces query to refresh the space data
          void queryClient.invalidateQueries({ queryKey: ["spaces"] })
        },
      })
    },

    /** Create a new user (admin only) */
    useCreateUser: () => {
      const queryClient = useQueryClient()

      return useMutation({
        mutationFn: (data: CreateUserRequest) => httpClient.post("api/v1/users", { json: data }).json<User>(),
        onSuccess: () => {
          // Invalidate users query to refresh the users list
          void queryClient.invalidateQueries({ queryKey: ["users"] })
        },
      })
    },

    /** Delete a user */
    useDeleteUser: () => {
      const queryClient = useQueryClient()

      return useMutation({
        mutationFn: (username: string) => httpClient.delete(`api/v1/users/${username}`),
        onSuccess: () => {
          // Invalidate users query to refresh the users list
          void queryClient.invalidateQueries({ queryKey: ["users"] })
        },
      })
    },
  },
}
