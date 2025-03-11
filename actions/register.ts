'use server';

import bcrypt from "bcryptjs";
import { z } from "zod";


import { RegisterSchema } from "@/schemas";
import prisma from "@/lib/prisma";
import { getUserByEmail } from "@/data/user";

export const register = async (value: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(value);

    console.log({value})

    if (!validatedFields.success) {
        return { error: "Invalid fields" };
    }

    const { email, name, password } = validatedFields.data;
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = getUserByEmail(email);

    if (await existingUser) {
        return { error: "Email already in use" };
    }

    await prisma.user.create({
        data: {
            email,
            name,
            password: hashedPassword,
        }
    });

    // TODO: Send verification token email

    return { success: "User created!" };
}