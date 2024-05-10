import React from "react";

import Body from "./Body";
import { RecordsPageProvider } from "./Context";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const supabase = createClient();
  const {error} = await supabase.auth.getUser();

  if (error) return redirect("/login");

  return (
    <RecordsPageProvider>
      <Body />
    </RecordsPageProvider>
  );
}
