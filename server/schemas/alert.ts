import { z } from "zod";

const weatherParameters = [
  {
    name: "temperature",
    min: -50,
    max: 60,
    unit: "°C",
  },
  {
    name: "humidity",
    min: 0,
    max: 100,
    unit: "%",
  },
  {
    name: "windSpeed",
    min: 0,
    max: 200,
    unit: "km/h",
  },
  {
    name: "precipitationProbability",
    min: 0,
    max: 100,
    unit: "%",
  },
  {
    name: "visibility",
    min: 0,
    max: 50,
    unit: "km",
  },
] as const;

type WeatherParameter = (typeof weatherParameters)[number];

export const AlertInputSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(255, "Name is too long"),
    location: z
      .string()
      .min(1, "Location is required")
      .max(255, "Location is too long"),
    parameter: z.enum(
      weatherParameters.map((p) => p.name) as [string, ...string[]],
      {
        errorMap: () => ({ message: "Invalid weather parameter" }),
      }
    ),
    condition: z.enum(["greater_than", "less_than", "equal_to"], {
      errorMap: () => ({ message: "Invalid condition" }),
    }),
    threshold: z.number(),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  })
  .superRefine((data, ctx) => {
    const param = weatherParameters.find((p) => p.name === data.parameter);
    if (!param) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid weather parameter",
        path: ["parameter"],
      });
      return;
    }

    if (data.threshold < param.min || data.threshold > param.max) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${data.parameter} threshold must be between ${param.min} and ${param.max} ${param.unit}`,
        path: ["threshold"],
      });
    }
  });

export type AlertInput = z.infer<typeof AlertInputSchema>;
