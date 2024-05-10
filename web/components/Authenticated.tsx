"use client";

import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import React from "react";

export const Authenticated: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const supabase = createClient();

  const {
    data: { user },
  } = React.use(supabase.auth.getUser());



  // if (!user) {
  //   return redirect("/login");
  // }

  // if (!user) {
  //   return redirect("/login");
  // }

  return children;
};
