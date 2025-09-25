import type { components } from "./generated"

export type { paths, components } from "./generated"

// Core models
export type User = components["schemas"]["UserView"]
export type Space = components["schemas"]["Space"]
export type Note = components["schemas"]["Note"]
export type Comment = components["schemas"]["Comment"]

// Field-related types
export type SpaceField = components["schemas"]["SpaceField"]
export type FieldType = components["schemas"]["FieldType"]
export type Filter = components["schemas"]["Filter"]
export type FilterCondition = components["schemas"]["FilterCondition"]
export type FilterOperator = components["schemas"]["FilterOperator"]

// Template-related types
export type SpaceTemplates = components["schemas"]["SpaceTemplates"]
export type UpdateSpaceTemplateRequest = components["schemas"]["UpdateSpaceTemplateRequest"]

// Request/Response types
export type LoginRequest = components["schemas"]["LoginRequest"]
export type LoginResponse = components["schemas"]["LoginResponse"]
export type ChangePasswordRequest = components["schemas"]["ChangePasswordRequest"]
export type CreateSpaceRequest = components["schemas"]["CreateSpaceRequest"]
export type CreateNoteRequest = components["schemas"]["CreateNoteRequest"]
export type UpdateNoteFieldsRequest = components["schemas"]["UpdateNoteFieldsRequest"]
export type CreateCommentRequest = components["schemas"]["CreateCommentRequest"]
export type CreateUserRequest = components["schemas"]["CreateUserRequest"]
export type AddMemberRequest = components["schemas"]["AddMemberRequest"]
export type UpdateListFieldsRequest = components["schemas"]["UpdateListFieldsRequest"]
export type UpdateHiddenCreateFieldsRequest = components["schemas"]["UpdateHiddenCreateFieldsRequest"]
export type UpdateSpaceTitleRequest = components["schemas"]["UpdateSpaceTitleRequest"]
export type UpdateSpaceSlugRequest = components["schemas"]["UpdateSpaceSlugRequest"]
export type UpdateSpaceDescriptionRequest = components["schemas"]["UpdateSpaceDescriptionRequest"]

// Pagination types
export interface PaginationResult<T> {
  items: T[]
  total: number
  limit: number
  offset: number
}
export type NotePaginationResult = components["schemas"]["PaginationResult_Note_"]
export type CommentPaginationResult = components["schemas"]["PaginationResult_Comment_"]

// Error types
export type ErrorResponse = components["schemas"]["ErrorResponse"]
export type ValidationError = components["schemas"]["ValidationError"]

// Export types
export type ExportData = components["schemas"]["ExportData"]
