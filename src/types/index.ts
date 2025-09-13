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

// Request/Response types
export type LoginRequest = components["schemas"]["LoginRequest"]
export type LoginResponse = components["schemas"]["LoginResponse"]
export type ChangePasswordRequest = components["schemas"]["ChangePasswordRequest"]
export type CreateSpaceRequest = components["schemas"]["CreateSpaceRequest"]
export type CreateNoteRequest = components["schemas"]["CreateNoteRequest"]
export type CreateCommentRequest = components["schemas"]["CreateCommentRequest"]
export type CreateUserRequest = components["schemas"]["CreateUserRequest"]

// Error types
export type ErrorResponse = components["schemas"]["ErrorResponse"]
export type ValidationError = components["schemas"]["ValidationError"]
