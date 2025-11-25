import React from 'react';
import { TextInput, PasswordInput, Button, Paper, Title, Stack, Box } from '@mantine/core';
import { useForm } from '@mantine/form';
import { loginSchema, type LoginFormValues } from '../schemas/loginSchema';
import { AuthService } from '../services/AuthService';
import { useNavigate } from "react-router-dom";
import { AuthProvider } from '../contexts/AuthContext';

export default function LoginPage() {
    const navigate = useNavigate();
    const { setAuth } = AuthProvider.useAuth();

    const form = useForm<LoginFormValues>({
        initialValues: {
            username: "",
            password: "",
        },
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const validateError = form.validate();
        if (validateError.hasErrors) return;

        const values = loginSchema.cast(form.values);
        const { username, password } = values;
        try {
            const response = await AuthService.login(username, password);

            if (response.ok) {
                console.log("Login success:", response.data);

                const { access_token, user } = response.data;
                setAuth(access_token, user);
                const rolePath = "/dashboard";
                navigate(rolePath, { replace: true });

            } else {
                form.setErrors({
                    username: " ",
                    password: response.message,
                });
            }
        } catch (err) {
            console.error("Unexpected error:", err);
            form.setErrors({
                username: " ",
                password: "Unexpected error, please try again",
            });
        }
    };

    return (
        <Box
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}
        >
            <Paper withBorder shadow="md" p={40} radius="md" style={{ width: 400 }}>
                <form onSubmit={handleLogin}>
                    <Stack>
                        <Title fw={700} mb="lg">
                            ERP System
                        </Title>

                        <TextInput
                            label="Username"
                            placeholder="you@example.com"
                            required
                            {...form.getInputProps("username")}
                        />
                        <PasswordInput
                            label="Password"
                            placeholder="Your password"
                            required
                            {...form.getInputProps("password")}
                        />
                        <Button type='submit' fullWidth mt="xl">
                            Login
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Box>
    );
}