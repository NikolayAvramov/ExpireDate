import { useAuth } from "@/context/AuthContect";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";

const UserLogin = () => {
    const router = useRouter();

    const { onLogin } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const { mutate, isLoading, isError } = useMutation({
        mutationFn: onLogin,
        onSuccess: () => {
            router.push("/");
        },
    });

    const submitHandler = data => {
        mutate({
            username: data.username,
            password: data.password,
        });
    };

    return (
        <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Market Sign In</h2>
            {isError && <p className="mb-4 text-sm text-red-500">Login failed. Please try again.{isError}</p>}
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
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username.message}</p>}
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
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
                </div>

                <button
                    type="submit"
                    className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                >
                    {isLoading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
};

export default UserLogin;
