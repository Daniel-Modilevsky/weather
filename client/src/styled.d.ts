import "styled-components";
import { Theme as MuiTheme } from "@mui/material/styles";

// Re-export MUI Theme as DefaultTheme
declare module "styled-components" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends MuiTheme {}
}
