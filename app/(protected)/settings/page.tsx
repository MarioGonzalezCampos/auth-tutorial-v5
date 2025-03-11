
import { auth, signOut } from "@/auth"
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

const SettingsPage = async () => {

    const session = await auth();
    if (!session) redirect("/auth/login");

    return (
        <div>
            {JSON.stringify(session)}
            <form
                action={ async () => {
                    "use server";

                    await signOut({
                        redirectTo: "/auth/login"
                    });
                   
                }}
            >
                <Button 
                    type="submit"

                >
                    Sing out
                    </Button> 
            </form>
        </div>
    )
}

export default SettingsPage