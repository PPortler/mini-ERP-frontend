import React from 'react';
import { TextInput, PasswordInput, Button, Paper, Title, Stack } from '@mantine/core';
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

            console.log(response)
            if (response.ok) {
                console.log("Login success:", response.data);

                const { access_token, role } = response.data;
                setAuth(access_token, role);
                const rolePath = "/dashboard";
                navigate(rolePath, { replace: true });

            } else {
                console.error("Login failed:", response.message);
                // TODO: แสดง error message ให้ user
            }
        } catch (err) {
            console.error("Unexpected error:", err);
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh', // เต็มหน้าจอแนวตั้ง
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
        </div>
    );
}