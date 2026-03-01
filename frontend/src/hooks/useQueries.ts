import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { IPCategory, type IPRecord, type UserProfile, type TokenBalance } from '../backend';
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

// ── Token Balance ─────────────────────────────────────────────────────────────

export function useGetBalance(principal?: Principal) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<TokenBalance>({
    queryKey: ['balance', principal?.toString()],
    queryFn: async () => {
      if (!actor || !principal) return BigInt(0);
      return actor.getBalance(principal);
    },
    enabled: !!actor && !actorFetching && !!principal,
    refetchInterval: 30000,
  });
}

export function useGetCirculatingSupply() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['circulatingSupply'],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getCirculatingSupply();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 30000,
  });
}

export function useGetTotalBurnedTokens() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['totalBurned'],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getTotalBurnedTokens();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 30000,
  });
}

/** Convenience hook that fetches circulating supply and total burned together. */
export function useGetTokenStats() {
  const { data: circulatingSupply, isLoading: csLoading } = useGetCirculatingSupply();
  const { data: totalBurned, isLoading: tbLoading } = useGetTotalBurnedTokens();

  return {
    data:
      circulatingSupply !== undefined && totalBurned !== undefined
        ? { circulatingSupply, totalBurned }
        : undefined,
    isLoading: csLoading || tbLoading,
  };
}

export function useTransferTokens() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ to, amount }: { to: Principal; amount: TokenBalance }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.transferTokens(to, amount);
    },
    onSuccess: () => {
      if (identity) {
        queryClient.invalidateQueries({ queryKey: ['balance', identity.getPrincipal().toString()] });
      }
      queryClient.invalidateQueries({ queryKey: ['circulatingSupply'] });
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
      queryClient.invalidateQueries({ queryKey: ['totalBurned'] });
      queryClient.invalidateQueries({ queryKey: ['circulatingSupply'] });
      if (identity) {
        queryClient.invalidateQueries({ queryKey: ['balance', identity.getPrincipal().toString()] });
      }
    },
  });
}
