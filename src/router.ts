import { createBrowserRouter } from "react-router"
import LoginPage from "@/components/pages/LoginPage"
import Layout from "@/components/layouts/Layout"
import HomePage from "@/components/pages/home/HomePage"
import SpaceDetailPage from "@/components/pages/SpaceDetailPage"
import MembersPage from "@/components/pages/space/members/MembersPage"
import FieldsPage from "@/components/pages/space/FieldsPage"
import FiltersPage from "@/components/pages/space/FiltersPage"
import TemplatesPage from "@/components/pages/space/TemplatesPage"
import SettingsPage from "@/components/pages/space/SettingsPage"
import NewFieldPage from "@/components/pages/space/NewFieldPage"

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
          Component: SpaceDetailPage,
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
          Component: TemplatesPage,
        },
        {
          path: "s/:slug/settings",
          Component: SettingsPage,
        },
      ],
    },
  ])
