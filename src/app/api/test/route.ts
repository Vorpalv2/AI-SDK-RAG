import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const inputSchema = z.object({
  city: z.string(),
});

export async function POST(req: NextRequest) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // console.log(req.body);
  // // Replace '19' with actual weather data
  const validatedData = inputSchema.parse(req.body);
  const city = validatedData.city;
  const weatherData = {
    output: `Weather of ${city} is 19`,
  };
  // console.log(weatherData.output);

  return NextResponse.json(weatherData);
}
