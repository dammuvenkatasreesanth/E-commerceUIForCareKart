import { useMutation } from "@tanstack/react-query";
import * as usersApi from "../lib/api/endpoints/users";
import type { UpdateProfileInput } from "../lib/api/endpoints/users";
import { useAuth } from "../context/AuthContext";

export function useUpdateProfile() {
  const { refreshProfile } = useAuth();
  return useMutation({
    mutationFn: (input: UpdateProfileInput) => usersApi.updateProfile(input),
    onSuccess: () => refreshProfile(),
  });
}
