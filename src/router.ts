import { createBrowserRouter } from "react-router"
import LoginPage from "@/components/pages/login/LoginPage"
import Layout from "@/components/layouts/Layout"
import HomePage from "@/components/pages/home/HomePage"
import NotesPage from "@/components/pages/notes/NotesPage"
import NotePage from "@/components/pages/note/NotePage"
import MembersPage from "@/components/pages/members/MembersPage"
import FieldsPage from "@/components/pages/fields/FieldsPage"
import FiltersPage from "@/components/pages/filters/FiltersPage"
import SpaceTemplatesPage from "@/components/pages/space-templates/SpaceTemplatesPage"
import SpaceSettingsPage from "@/components/pages/space-settings/SpaceSettingsPage"
import ExportPage from "@/components/pages/export/ExportPage"
import NewFieldPage from "@/components/pages/new-field/NewFieldPage"
import NewNotePage from "@/components/pages/new-note/NewNotePage"
import NewSpacePage from "@/components/pages/new-space/NewSpacePage"
import ImportSpacePage from "@/components/pages/import-space/ImportSpacePage"
import UsersPage from "@/components/pages/users/UsersPage"

export const createRouter = () =>
  createBrowserRouter([
    {
      path: "/login",
      Component: LoginPage,
    },
    {
      path: "/",
      Component: Layout,
      HydrateFallback: () => null,
      children: [
        {
          index: true,
          Component: HomePage,
        },
        {
          path: "spaces/new",
          Component: NewSpacePage,
        },
        {
          path: "spaces/import",
          Component: ImportSpacePage,
        },
        {
          path: "users",
          Component: UsersPage,
        },
        {
          path: "s/:slug",
          Component: NotesPage,
        },
        {
          path: "s/:slug/new",
          Component: NewNotePage,
        },
        {
          path: "s/:slug/:number",
          Component: NotePage,
        },
        {
          path: "s/:slug/members",
          Component: MembersPage,
        },
        {
          path: "s/:slug/fields",
          Component: FieldsPage,
        },
        {
          path: "s/:slug/fields/new",
          Component: NewFieldPage,
        },
        {
          path: "s/:slug/filters",
          Component: FiltersPage,
        },
        {
          path: "s/:slug/templates",
          Component: SpaceTemplatesPage,
        },
        {
          path: "s/:slug/export",
          Component: ExportPage,
        },
        {
          path: "s/:slug/settings",
          Component: SpaceSettingsPage,
        },
      ],
    },
  ])
