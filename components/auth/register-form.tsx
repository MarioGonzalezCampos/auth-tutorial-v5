'use client'

import * as z from "zod";
import { CardWrapper } from "./card-wrapper"
import { useForm } from "react-hook-form"
import { RegisterSchema } from "@/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { useState, useTransition } from "react";
import { register } from "@/actions/register";

export const RegisterForm = ( ) => {

    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");

    const [isPendieng, startTransition] = useTransition()

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: "",
            name: "",
            password: "",
        }
    })

    const onSubmit = ( value: z.infer<typeof RegisterSchema>) => {

        setError("");
        setSuccess("");

        startTransition(() => {
            register(value)
                .then((data) => {
                    setError(data.error);
                    setSuccess(data.success);
                })
        })
    }

    return (
        <CardWrapper
            headerLabel="Create an account"
            backButtonLabel="Already have an account?"
            backButtonHref="/auth/login"
            showSocial
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            disabled={isPendieng}
                                            placeholder="john.doe@examle.com"
                                            type="email"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>name</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            disabled={isPendieng}
                                            placeholder="john doe"
                                            type="text"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            disabled={isPendieng}
                                            placeholder="*******"
                                            type="password"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>
                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <Button
                        disabled={isPendieng}
                        type="submit"
                        className="w-full"
                    >
                        Create account
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}