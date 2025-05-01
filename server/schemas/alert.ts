import { z } from "zod";

export const AlertInputSchema = z.object({
  title: z.string().min(1),
  metric: z.enum([
    "temperature",
    "humidity",
    "windSpeed",
    "precipitationProbability",
    "visibility",
  ]),
  condition: z.enum(["greater_than", "less_than", "equal_to"]),
  threshold: z.number().min(0),
  name: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
  parameter: z.string(),
});

export type AlertInput = z.infer<typeof AlertInputSchema>;
