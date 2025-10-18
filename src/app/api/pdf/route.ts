import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const pdf = (await req.formData()).get("file") as File;
  //   console.log(pdf);
}
