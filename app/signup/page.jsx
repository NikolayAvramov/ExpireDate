"use client";
// pages/register.js
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContect";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();
    const { onRegister } = useAuth();
    const [serverError, setServerError] = useState(""); // State for server-side errors
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const { mutate, isLoading } = useMutation({
        mutationFn: onRegister,
        onSuccess: () => {
            router.push("/");
        },
        onError: error => {
            // Capture server error message
            setServerError("An unexpected error occurred. Please try again.");
        },
    });

    const submitHandler = data => {
        if (data.password === data.confirmPassword) {
            // Clear previous errors before mutation
            setServerError("");
            mutate({
                username: data.username,
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                password: data.password,
            });
        } else {
            console.error("Passwords do not match");
        }
    };
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-green-400">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-2xl">
                <h1 className="text-4xl font-extrabold text-center text-green-600">Create Your Account</h1>
                <p className="text-center text-gray-700">Join us today and unlock exclusive features!</p>

                <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-semibold text-gray-700">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            {...register("username", {
                                required: "Username is required",
                                minLength: {
                                    value: 3,
                                    message: "Username must be at least 3 characters long",
                                },
                            })}
                            className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        />
                        {errors.username && (
                            <p className="mt-1 text-sm text-red-500 flex items-center">
                                <span className="material-icons mr-2">error</span>
                                {errors.username.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700">
                            First Name
                        </label>
                        <input
                            id="firstName"
                            type="text"
                            {...register("firstName", {
                                required: "First Name is required",
                            })}
                            className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        />
                        {errors.firstName && (
                            <p className="mt-1 text-sm text-red-500 flex items-center">
                                <span className="material-icons mr-2">error</span>
                                {errors.firstName.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700">
                            Last Name
                        </label>
                        <input
                            id="lastName"
                            type="text"
                            {...register("lastName", {
                                required: "Last Name is required",
                            })}
                            className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        />
                        {errors.lastName && (
                            <p className="mt-1 text-sm text-red-500 flex items-center">
                                <span className="material-icons mr-2">error</span>
                                {errors.lastName.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Enter a valid email address",
                                },
                            })}
                            className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-500 flex items-center">
                                <span className="material-icons mr-2">error</span>
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters long",
                                },
                            })}
                            className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-500 flex items-center">
                                <span className="material-icons mr-2">error</span>
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            {...register("confirmPassword", {
                                required: "Please confirm your password",
                                validate: value => value === watch("password") || "Passwords do not match",
                            })}
                            className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        />
                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-500 flex items-center">
                                <span className="material-icons mr-2">error</span>
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full px-4 py-3 text-white bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        disabled={isLoading}
                    >
                        {isLoading ? "Registering..." : "Register"}
                    </button>
                </form>

                {serverError && (
                    <p className="mt-4 text-sm text-red-500 flex items-center">
                        <span className="material-icons mr-2">error</span>
                        {serverError}
                    </p>
                )}
            </div>
        </div>
    );
}
