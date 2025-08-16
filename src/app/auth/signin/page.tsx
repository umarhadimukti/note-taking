"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { signinUser } from "./signin";
import { useState } from "react";
import AuthLayout from "../AuthLayout";
import { Card, Stack, TextField, Typography, Button } from "@mui/material";
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import Link from "next/link";

export default function Signin() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const mutation = useMutation({
    mutationFn: signinUser,
    onSuccess: () => router.push("/dashboard"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ email, password });
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
                    sx={{
                        width: "100%",
                        marginBottom: 3,
                    }}
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
                            name="email"
                            label="email address"
                            variant="outlined"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{
                                backgroundColor: "black",
                                outline: "none",
                                border: "none",
                                ring: "none",
                                borderRadius: "5px",
                            }}/>
                        <TextField
                            name="password"
                            label="Password"
                            variant="outlined"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{
                                backgroundColor: "black",
                                outline: "none",
                                border: "none",
                                ring: "none",
                                borderRadius: "5px",
                            }}/>
                        {mutation.error && (
                            <Typography
                                color="error"
                                variant="body2"
                                aria-live="polite"
                                sx={{ mt: -1, mb: 3, }}>
                                {(mutation.error as Error).message}
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
                            Login
                        </Button>
                        <Stack direction="row" justifyContent="space-between" className="text-xs">
                            <Link href="/auth/signup" className="self-center">
                                Sign Up
                            </Link>
                            <Link href="/auth/forgot-password" className="self-center">
                                Forgot Password
                            </Link>

                        </Stack>
                    </Stack>
                </form>
            </Card>
        </AuthLayout>
  )
}