import { createBrowserRouter } from "react-router"
import LoginPage from "@/components/pages/login/LoginPage"
import Layout from "@/components/layouts/Layout"
import HomePage from "@/components/pages/home/HomePage"
import NotesPage from "@/components/pages/notes/NotesPage"
import MembersPage from "@/components/pages/members/MembersPage"
import FieldsPage from "@/components/pages/fields/FieldsPage"
import FiltersPage from "@/components/pages/filters/FiltersPage"
import SpaceTemplatesPage from "@/components/pages/space-templates/SpaceTemplatesPage"
import SpaceSettingsPage from "@/components/pages/space-settings/SpaceSettingsPage"
import NewFieldPage from "@/components/pages/new-field/NewFieldPage"
import NewNotePage from "@/components/pages/new-note/NewNotePage"

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
          path: "s/:slug",
          Component: NotesPage,
        },
        {
          path: "s/:slug/new",
          Component: NewNotePage,
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
          path: "s/:slug/settings",
          Component: SpaceSettingsPage,
        },
      ],
    },
  ])
