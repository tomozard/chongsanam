import { AuthBindings } from "@refinedev/core";
import nookies from "nookies";

import { nhost } from 'src/utility';


const mockUsers = [
  {
    name: "John Doe",
    email: "johndoe@mail.com",
    roles: ["admin"],
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    name: "Jane Doe",
    email: "janedoe@mail.com",
    roles: ["editor"],
    avatar: "https://i.pravatar.cc/150?img=1",
  },
];

export const authProvider: AuthBindings = {
  login: async ({ email, password }) => {
      const { error } = await nhost.auth.signIn({
          email,
          password,
      });

      if (error) {
          return {
              success: false,
              error: {
                  message: error.message,
                  name: "Login Error",
              },
          };
      }

      return {
          success: true,
          redirectTo: "/",
      };
  },
  logout: async () => {
      const { error } = await nhost.auth.signOut();
      if (error) {
          return {
              success: false,
              error: {
                  message: error.message,
                  name: "Login Error",
              },
          };
      }

      return {
          success: true,
          redirectTo: "/login",
      };
  },
  onError: async (error) => {
      if (error.status === 401) {
          nhost.auth.refreshSession();
      }

      return {};
  },
  check: async () => {
      // const isAuthenticated = await nhost.auth.isAuthenticatedAsync();
      // if (isAuthenticated) {
          return {
              authenticated: true,
          };
      // }

      return {
          authenticated: false,
          error: {
              message: "Check failed",
              name: "Not authenticated",
          },
          logout: true,
          redirectTo: "/login",
      };
  },
  getPermissions: async () => {
      const user = nhost.auth.getUser();
      if (user) {
          return user.roles;
      }

      return [];
  },
  getIdentity: async () => {
      const user = nhost.auth.getUser();
      if (user) {
          return {
              ...user,
              name: user.displayName,
              avatar: user.avatarUrl,
          };
      }

      return null;
  },
};