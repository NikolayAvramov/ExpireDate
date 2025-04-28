import { useAuth } from "@/context/AuthContect";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

const MarketLogin = () => {
  const { onMarketLogin } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { mutate, isLoading, isError, error } = useMutation({
    mutationFn: onMarketLogin,
    onSuccess: () => {
      router.push("/"); // Redirect to the homepage after successful login
    },
  });

  const submitHandler = (data) => {
    mutate({
      marketCode: data.marketCode,
      password: data.password,
    });
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
        Market Login
      </h2>

      {/* Display error message if login failed */}
      {isError && (
        <p className="mb-4 text-sm text-red-500">
          Login failed. {error?.message || "Please try again."}
        </p>
      )}

      <form onSubmit={handleSubmit(submitHandler)}>
        <div className="mb-4">
          <label
            htmlFor="marketCode"
            className="block text-sm font-semibold text-gray-700"
          >
            Market Code
          </label>
          <input
            id="marketCode"
            type="text"
            {...register("marketCode", {
              required: "Market Code is required",
              pattern: {
                value: /^[a-zA-Z0-9]{10}$/,
                message:
                  "Market Code must be a 10-character alphanumeric string",
              },
            })}
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.marketCode && (
            <p className="mt-1 text-sm text-red-500">
              {errors.marketCode.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-gray-700"
          >
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
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        >
          {/* Display a loading spinner if the login is in progress */}
          {isLoading ? (
            <div className="flex justify-center items-center space-x-2">
              <div className="w-4 h-4 border-4 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
              <span>Logging in...</span>
            </div>
          ) : (
            "Login"
          )}
        </button>
      </form>
    </div>
  );
};

export default MarketLogin;
