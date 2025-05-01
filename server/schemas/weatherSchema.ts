import { z } from "zod";

export const WeatherQuerySchema = z.object({
  location: z.string().min(2, "location query param is required"),
});

export type WeatherQuery = z.infer<typeof WeatherQuerySchema>;
