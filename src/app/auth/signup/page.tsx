"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { signupUser } from "./signup";
import { useState } from "react";
import AuthLayout from "../AuthLayout";
import { Card, Stack, TextField, Typography, Button, CircularProgress } from "@mui/material";
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import Link from "next/link";
import { AxiosError } from "axios";

export default function Signin() {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const mutation = useMutation({
    mutationFn: signupUser,
    onSuccess: () => router.push("/auth/signin"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ name, email, password });
  };
  
  return (
    <AuthLayout>
      <Card
        sx={{
          px: { xs: 4, sm: 6, md: 8, lg: 10 },
          py: 5,
          width: "100%",
          maxWidth: "500px",
          minHeight: "300px",
          borderRadius: "2%",
          boxShadow: 3,
        }}>
        <Stack
          sx={{ width: "100%", marginBottom: 3 }}
          direction="row"
          rowGap="3px"
          alignItems="center"
          justifyContent="center">
          <EditNoteOutlinedIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".2rem",
              color: "inherit",
              textDecoration: "none",
              textTransform: "uppercase",
            }}>
            SimpleNote
          </Typography>
        </Stack>
        <form onSubmit={handleSubmit} className="w-full">
          <Stack spacing={2} className="w-full">
            <TextField
              name="name"
              label="Name"
              variant="outlined"
              type="text"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
              sx={{
                backgroundColor: "black",
                borderRadius: "5px",
              }}/>
            <TextField
              name="email"
              label="email address"
              variant="outlined"
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                backgroundColor: "black",
                borderRadius: "5px",
              }}/>
            <TextField
              name="password"
              label="Password"
              variant="outlined"
              type="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                backgroundColor: "black",
                borderRadius: "5px",
              }}/>
            {mutation.isError && (
              <Typography
                color="error"
                variant="body2"
                aria-live="polite"
                sx={{ mt: -4, mb: 3, }}>
                {mutation.error instanceof AxiosError ? mutation.error.response?.data?.error : mutation.error.message}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#19b0e0",
                '&:hover': {
                    backgroundColor: "#148fb9",
                },
                border: "none",
                outline: "none",
                ring: "none",
              }}>
              {
                mutation.isPending ? 
                <CircularProgress size={24} sx={{ color: "white" }} /> :
                "Sign up"
              }
            </Button>
            <Stack direction="row" justifyContent="space-between" className="text-xs">
              <Stack direction="row" alignItems="center" gap={1}>
                <span className="text-gray-200">Already have an account yet?</span>
                <Link href="/auth/signin" className="self-center hover:text-[#19b0e0]">
                  Sign in
                </Link>
              </Stack>
            </Stack>
          </Stack>
        </form>
      </Card>
    </AuthLayout>
  )
}