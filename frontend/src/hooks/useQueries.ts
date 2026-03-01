import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { IPCategory, type IPRecord, type UserProfile } from '../backend';
import { Principal } from '@dfinity/principal';
import { ExternalBlob } from '../backend';

// ── User Profile ──────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
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
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// ── IP Records ────────────────────────────────────────────────────────────────

export function useGetAllIPs(offset: number, limit: number) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<IPRecord[]>({
    queryKey: ['allIPs', offset, limit],
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
    queryKey: ['searchByTitle', keyword],
    queryFn: async () => {
      if (!actor || !keyword.trim()) return [];
      return actor.searchByTitle(keyword);
    },
    enabled: !!actor && !actorFetching && keyword.trim().length > 0,
  });
}

export function useFilterByCategory(category: IPCategory | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<IPRecord[]>({
    queryKey: ['filterByCategory', category],
    queryFn: async () => {
      if (!actor || category === null) return [];
      return actor.filterByCategory(category);
    },
    enabled: !!actor && !actorFetching && category !== null,
  });
}

export function useFilterByJurisdiction(jurisdiction: string | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<IPRecord[]>({
    queryKey: ['filterByJurisdiction', jurisdiction],
    queryFn: async () => {
      if (!actor || !jurisdiction || !jurisdiction.trim()) return [];
      return actor.filterByJurisdiction(jurisdiction);
    },
    enabled: !!actor && !actorFetching && !!jurisdiction && jurisdiction.trim().length > 0,
  });
}

export function useGetIP(id: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<IPRecord | null>({
    queryKey: ['ip', id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getIP(id);
    },
    enabled: !!actor && !actorFetching && id !== null,
  });
}

export function useRegisterIP() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      title: string;
      description: string;
      category: IPCategory;
      documentHash: Uint8Array;
      fileBlob: ExternalBlob | null;
      jurisdiction: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.registerIP(
        params.title,
        params.description,
        params.category,
        params.documentHash,
        params.fileBlob,
        params.jurisdiction
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allIPs'] });
    },
  });
}

export function useFilterByOwner(owner: Principal | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<IPRecord[]>({
    queryKey: ['filterByOwner', owner?.toString()],
    queryFn: async () => {
      if (!actor || !owner) return [];
      return actor.filterByOwner(owner);
    },
    enabled: !!actor && !actorFetching && !!owner,
  });
}
