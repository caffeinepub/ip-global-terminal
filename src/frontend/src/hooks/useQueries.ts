import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { IPCategory, IPRecord, UserProfile } from "../backend";
import type { ExternalBlob } from "../backend";
import { useActor } from "./useActor";

// ── User Profile ──────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

// ── IP Records ────────────────────────────────────────────────────────────────

export function useGetAllIPs(offset: number, limit: number) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<IPRecord[]>({
    queryKey: ["allIPs", offset, limit],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllIPs(BigInt(offset), BigInt(limit));
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSearchByTitle(keyword: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<IPRecord[]>({
    queryKey: ["searchByTitle", keyword],
    queryFn: async () => {
      if (!actor) return [];
      return actor.searchByTitle(keyword);
    },
    enabled: !!actor && !actorFetching && keyword.length > 0,
  });
}

export function useSearchByTitleOrHash(search: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<IPRecord[]>({
    queryKey: ["searchByTitleOrHash", search],
    queryFn: async () => {
      if (!actor) return [];
      return actor.searchByTitleOrHash(search);
    },
    enabled: !!actor && !actorFetching && search.length > 0,
  });
}

export function useFilterByCategory(category: IPCategory | "") {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<IPRecord[]>({
    queryKey: ["filterByCategory", category],
    queryFn: async () => {
      if (!actor || !category) return [];
      return actor.filterByCategory(category as IPCategory);
    },
    enabled: !!actor && !actorFetching && category !== "",
  });
}

export function useFilterByJurisdiction(jurisdiction: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<IPRecord[]>({
    queryKey: ["filterByJurisdiction", jurisdiction],
    queryFn: async () => {
      if (!actor || !jurisdiction) return [];
      return actor.filterByJurisdiction(jurisdiction);
    },
    enabled: !!actor && !actorFetching && jurisdiction !== "",
  });
}

// ── IP Registration ───────────────────────────────────────────────────────────

interface RegisterIPParams {
  title: string;
  description: string;
  category: IPCategory;
  documentHash: Uint8Array;
  fileBlob: ExternalBlob | null;
  jurisdiction: string;
  hash: string;
}

export function useRegisterIP() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: RegisterIPParams): Promise<bigint> => {
      if (!actor) throw new Error("Actor not available");
      return actor.registerIP(
        params.title,
        params.description,
        params.category,
        params.documentHash,
        params.fileBlob,
        params.jurisdiction,
        params.hash,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allIPs"] });
      queryClient.invalidateQueries({ queryKey: ["searchByTitleOrHash"] });
      queryClient.invalidateQueries({ queryKey: ["filterByCategory"] });
      queryClient.invalidateQueries({ queryKey: ["filterByJurisdiction"] });
    },
  });
}
