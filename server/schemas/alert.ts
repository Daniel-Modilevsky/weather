import { z } from "zod";

export const AlertInputSchema = z.object({
  name: z.string().min(1),
  location: z.string().min(1),
  parameter: z.enum([
    "temperature",
    "humidity",
    "windSpeed",
    "precipitationProbability",
    "visibility",
  ]),
  condition: z.enum(["greater_than", "less_than", "equal_to"]),
  threshold: z.number().min(0),
  latitude: z.number(),
  longitude: z.number(),
});

export type AlertInput = z.infer<typeof AlertInputSchema>;
