import styled from "styled-components";
import { Card } from "@mui/material";

export const FormWrapper = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

export const FormCard = styled(Card)`
  padding: 1.5rem;
`;

export const FormRow = styled.div`
  margin-bottom: 1.5rem;
`;

export const SliderLabel = styled.div`
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

export const ErrorText = styled.p`
  color: red;
  font-size: 0.8rem;
`;

export const FormFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
`;
