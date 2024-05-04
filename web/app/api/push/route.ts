import { createClient } from "@/utils/supabase/server";

export async function GET(req: Request, res: Response) {
  const { searchParams } = new URL(req.url);
  const supabase = createClient();
  try {
    const res = await supabase
      .from("records")
      .insert([
        {
          watt: searchParams.get("watt") as any as number,
          level: searchParams.get("level") as any as number,
          flow: searchParams.get("flow") as any as number,
        },
      ])
      .select();

    if (res.error) {
      throw new Error(res.error?.details);
    }
  } catch (err) {
    return Response.json({
      message: "ERROR",
    });
  }

  return Response.json({
    message: "OK",
  });
}
