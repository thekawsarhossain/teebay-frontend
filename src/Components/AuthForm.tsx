import React from "react";
import { Form, FormField, FormInputFuncProps } from "./common/Form";
import Button from "./common/Button";
import { Link, useNavigate } from "react-router-dom";
import { UseFormReturn } from "react-hook-form";
import { useMutation } from "@apollo/client";
import ErrorMessage from "./common/ErrorMessage";
import { LOGIN_USER, REGISTER_USER } from "../graphql/mutations";

interface AuthFormProps {
    type: "login" | "signup";
}

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {

    const [loginUser, { loading: loginLoading, error: loginError }] = useMutation(LOGIN_USER);
    const [registerUser, { loading: registerLoading, error: registerError }] = useMutation(REGISTER_USER);

    const navigate = useNavigate();

    const handleSubmit = async (data: Record<string, string>, form: UseFormReturn) => {
        const { email, password, confirmPassword } = data || {};

        if (type === "login") {
            await loginUser({ variables: { email, password } }).then(({ data }) => {
                const userId = data?.loginUser?.id || "";
                if (userId) {
                    localStorage.setItem("userId", userId);
                    return navigate("/");
                }
            });
        } else if (type === "signup") {
            if (password !== confirmPassword) {
                return form.setError("confirmPassword", { type: "custom", message: "Confirm password does not match with password" });
            }
            delete data?.confirmPassword;
            await registerUser({ variables: { user: { ...data } } }).then(({ data }) => {
                const userId = data?.registerUser?.id || "";
                if (userId) {
                    localStorage.setItem("userId", userId);
                    return navigate("/");
                }
            });
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-2 md:p-0">
            <h2 className="text-2xl font-medium mb-4 uppercase text-black">
                {type === "login" ? "Sign in" : "Sign up"}
            </h2>
            <div className={`${type === "signup" ? "w-full md:w-3/5 lg:w-2/5" : "w-full md:w-2/5 lg:w-1/4"} px-4 md:px-8 py-10 border`}>
                <Form onSubmit={handleSubmit} className="flex flex-col gap-y-6">
                    {type === "signup" && (
                        <>
                            <div className="flex justify-between items-center space-x-4">
                                <FormField
                                    required
                                    name="firstName"
                                    type="text"
                                >
                                    {({ errors, ...props }: FormInputFuncProps) => (
                                        <div className="flex flex-col gap-2 w-full">
                                            <input
                                                {...props}
                                                placeholder="First Name"
                                                className={`shadow-sm block w-full px-3 py-2 border rounded-md placeholder-gray-400 sm:text-sm focus:outline-none focus:border-indigo-600 ${errors ? "border-red-600" : ""}`}
                                            />
                                            {errors && (<p className="text-xs text-error-red">{errors.message}</p>)}
                                        </div>
                                    )}
                                </FormField>
                                <FormField
                                    required
                                    name="lastName"
                                    type="text"
                                >
                                    {({ errors, ...props }: FormInputFuncProps) => (
                                        <div className="flex flex-col gap-2 w-full">
                                            <input
                                                {...props}
                                                placeholder="Last Name"
                                                className={`shadow-sm block w-full px-3 py-2 border rounded-md placeholder-gray-400 sm:text-sm focus:outline-none focus:border-indigo-600 ${errors ? "border-red-600" : ""}`}
                                            />
                                            {errors && (<p className="text-xs text-error-red">{errors.message}</p>)}
                                        </div>
                                    )}
                                </FormField>
                            </div>
                            <FormField
                                required
                                name="address"
                                type="text"
                            >
                                {({ errors, ...props }: FormInputFuncProps) => (
                                    <div className="flex flex-col gap-2">
                                        <input
                                            {...props}
                                            placeholder="Address"
                                            className={`shadow-sm block w-full px-3 py-2 border rounded-md placeholder-gray-400 sm:text-sm focus:outline-none focus:border-indigo-600 ${errors ? "border-red-600" : ""}`}
                                        />
                                        {errors && (<p className="text-xs text-error-red">{errors.message}</p>)}
                                    </div>
                                )}
                            </FormField>
                        </>
                    )}

                    <div className={`${type === "signup" ? "flex justify-between items-center space-x-4" : ""}`}>
                        <FormField
                            required
                            name="email"
                            type="email"
                        >
                            {({ errors, ...props }: FormInputFuncProps) => (
                                <div className="flex flex-col gap-2 w-full">
                                    <input
                                        {...props}
                                        autoComplete="email"
                                        placeholder="Email"
                                        className={`shadow-sm block w-full px-3 py-2 border rounded-md placeholder-gray-400 sm:text-sm focus:outline-none focus:border-indigo-600 ${errors ? "border-red-600" : ""}`}
                                    />
                                    {errors && (<p className="text-xs text-error-red">{errors.message}</p>)}
                                </div>
                            )}
                        </FormField>

                        {type === "signup" && (
                            <FormField
                                required
                                name="phone"
                                type="number"
                                minLength={11}
                            >
                                {({ errors, ...props }: FormInputFuncProps) => (
                                    <div className="flex flex-col gap-2 w-full">
                                        <input
                                            {...props}
                                            minLength={11}
                                            placeholder="Phone Number"
                                            className={`shadow-sm block w-full px-3 py-2 border rounded-md placeholder-gray-400 sm:text-sm focus:outline-none focus:border-indigo-600 ${errors ? "border-red-600" : ""}`}
                                        />
                                        {errors && (<p className="text-xs text-error-red">{errors.message}</p>)}
                                    </div>
                                )}
                            </FormField>
                        )}
                    </div>

                    <FormField
                        required
                        name="password"
                        type="password"
                        minLength={8}
                    >
                        {({ errors, ...props }: FormInputFuncProps) => (
                            <div className="flex flex-col gap-2">
                                <input
                                    {...props}
                                    minLength={8}
                                    autoComplete="password"
                                    placeholder="Password"
                                    className={`shadow-sm block w-full px-3 py-2 border rounded-md placeholder-gray-400 sm:text-sm focus:outline-none focus:border-indigo-600 ${errors ? "border-red-600" : ""}`}
                                />
                                {errors && (<p className="text-xs text-error-red">{errors.message}</p>)}
                            </div>
                        )}
                    </FormField>
                    {type === "signup" && (
                        <FormField
                            required
                            name="confirmPassword"
                            type="password"
                            minLength={8}
                        >
                            {({ errors, ...props }: FormInputFuncProps) => (
                                <div className="flex flex-col gap-2">
                                    <input
                                        {...props}
                                        minLength={8}
                                        placeholder="Confirm Password"
                                        className={`shadow-sm block w-full px-3 py-2 border rounded-md placeholder-gray-400 sm:text-sm focus:outline-none focus:border-indigo-600 ${errors ? "border-red-600" : ""}`}
                                    />
                                    {errors && (<p className="text-xs text-error-red">{errors.message}</p>)}
                                </div>
                            )}
                        </FormField>
                    )}
                    {(loginError || registerError) && <ErrorMessage error={loginError || registerError} />}
                    <Button disabled={loginLoading || registerLoading} loading={loginLoading || registerLoading} type="submit" className="max-w-fit mx-auto uppercase mt-2">
                        {type === "login" ? "Login" : "Sign Up"}
                    </Button>
                </Form>

                <div className="mt-4 text-center text-sm">
                    {type === "login" ? (
                        <>
                            Don't have an account?{" "}
                            <Link to="/signup" className="text-blue-600 hover:underline">
                                Signup
                            </Link>
                        </>
                    ) : (
                        <>
                            Already have an account?{" "}
                            <Link to="/login" className="text-blue-600 hover:underline">
                                Sign In
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthForm;
