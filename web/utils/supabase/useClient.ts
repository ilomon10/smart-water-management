"use client";

import React from "react";
import { createClient } from "./client";
import { User } from "@supabase/supabase-js";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface UseClientResult {
  user: User | null;
  isConnected: boolean;
  isLoading: boolean;
}

export const useClient = (): UseClientResult => {
  const supabase = createClient();

  const { data, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const resUser = await supabase.auth.getUser();
      return {
        user: resUser.data.user,
      };
    },
  });

  const isConnected = !data?.user ? false : true;

  return {
    user: data?.user || null,
    isConnected,
    isLoading,
  };
};
