import { createBrowserRouter } from "react-router"
import LoginPage from "@/components/pages/LoginPage"
import Layout from "@/components/layouts/Layout"
import HomePage from "@/components/pages/home/HomePage"
import SpaceDetailPage from "@/components/pages/SpaceDetailPage"

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
      ],
    },
  ])
