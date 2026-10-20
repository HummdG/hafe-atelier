"use client";

import { useRouter } from "next/navigation";
import { CustomiseForm } from "@/components/CustomiseForm";
import { useBag } from "@/components/RequestBagProvider";
import { SCRATCH_NAME } from "@/lib/request-schema";

export function BespokeBrief() {
  const router = useRouter();
  const { add } = useBag();
  return (
    <CustomiseForm
      defaultValues={{ changes: "" }}
      submitLabel="Add my brief to the request bag"
      onSubmit={(customisation) => {
        add({ pieceSlug: null, pieceName: SCRATCH_NAME, customisation });
        router.push("/request");
      }}
    />
  );
}
