import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "../../lib/api/endpoints/admin/marketing";

const COUPONS_KEY = ["admin", "coupons"];
const BANNERS_KEY = ["admin", "banners"];
const CONTENT_KEY = ["admin", "content-pages"];
const CAMPAIGNS_KEY = ["admin", "campaigns"];
const SETTINGS_KEY = ["admin", "settings"];

export function useAdminCoupons() {
  return useQuery({ queryKey: COUPONS_KEY, queryFn: api.listCoupons });
}
export function useCreateCoupon() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: api.createCoupon, onSuccess: () => queryClient.invalidateQueries({ queryKey: COUPONS_KEY }) });
}
export function useUpdateCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: Parameters<typeof api.updateCoupon>[1] }) => api.updateCoupon(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: COUPONS_KEY }),
  });
}
export function useDeleteCoupon() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: (id: number) => api.deleteCoupon(id), onSuccess: () => queryClient.invalidateQueries({ queryKey: COUPONS_KEY }) });
}

export function useAdminBanners() {
  return useQuery({ queryKey: BANNERS_KEY, queryFn: api.listAdminBanners });
}
export function useCreateBanner() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: api.createBanner, onSuccess: () => queryClient.invalidateQueries({ queryKey: BANNERS_KEY }) });
}
export function useUpdateBanner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: Parameters<typeof api.updateBanner>[1] }) => api.updateBanner(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BANNERS_KEY }),
  });
}
export function useDeleteBanner() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: (id: number) => api.deleteBanner(id), onSuccess: () => queryClient.invalidateQueries({ queryKey: BANNERS_KEY }) });
}
export function useUploadBannerImage() {
  return useMutation({ mutationFn: ({ file, onProgress }: { file: File; onProgress?: (percent: number) => void }) => api.uploadBannerImage(file, onProgress) });
}

export function useContentPages() {
  return useQuery({ queryKey: CONTENT_KEY, queryFn: api.listContentPages });
}
export function useCreateContentPage() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: api.createContentPage, onSuccess: () => queryClient.invalidateQueries({ queryKey: CONTENT_KEY }) });
}
export function useUpdateContentPage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: Parameters<typeof api.updateContentPage>[1] }) => api.updateContentPage(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CONTENT_KEY }),
  });
}
export function useDeleteContentPage() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: (id: number) => api.deleteContentPage(id), onSuccess: () => queryClient.invalidateQueries({ queryKey: CONTENT_KEY }) });
}

export function useCampaigns() {
  return useQuery({ queryKey: CAMPAIGNS_KEY, queryFn: api.listCampaigns });
}
export function useCreateCampaign() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: api.createCampaign, onSuccess: () => queryClient.invalidateQueries({ queryKey: CAMPAIGNS_KEY }) });
}

export function useAdminSettings() {
  return useQuery({ queryKey: SETTINGS_KEY, queryFn: api.getSettings });
}
export function useUpdateSetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: unknown }) => api.updateSetting(key, value),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SETTINGS_KEY }),
  });
}
