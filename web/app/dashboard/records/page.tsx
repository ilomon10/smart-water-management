import React from "react";

import Body from "./Body";
import { RecordsPageProvider } from "./Context";

export default function Page() {
  return (
    <RecordsPageProvider>
      <Body />
    </RecordsPageProvider>
  );
}
