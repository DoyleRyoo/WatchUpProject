import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,

  nickname: "",

  loading: true,

  setUser: (user) =>
    set({
      user,
    }),

  setNickname: (nickname) =>
    set({
      nickname,
    }),

  setLoading: (loading) =>
    set({
      loading,
    }),

  logoutStore: () =>
    set({
      user: null,
      nickname: "",
    }),
}));

export default useAuthStore;