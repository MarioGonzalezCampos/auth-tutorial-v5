//Source: components/auth/login-button.tsx
'use client'

import { useRouter } from "next/navigation";

type LoginButtonProps = {
    children: React.ReactNode;
    mode?: "modal" | "redirect";
    asChild?: boolean;
};

export const LoginButon = ({ children, mode = "redirect" , asChild }: LoginButtonProps) => {

    const router = useRouter();

    const onClick = () => {
        router.push("/auth/login");
    }

    if (mode === "modal") {
        return (
            <span>
                TODO: Implementar modal
            </span>
        )
    }

    return (
        <span onClick={onClick} className="cursor-pointer">
            {children}
        </span>
    )

}