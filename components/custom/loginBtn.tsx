'use client'
import { useSession, signIn, signOut } from "next-auth/react"

export default function LoginBtn() {
    const { data: session } = useSession()

    if (session) {
        return (
            <>
                <button onClick={() => signOut()} className="text-[18px] text-white cursor-pointer rounded-[9999px] bg-[] hover:border-[0.0625rem] hover:border-solid hover:bg-[] pt-[12px] pb-[12px] pl-[20px] pr-[20px] font-700">Sign out</button>
            </>
        )
    }
    return (
        <>
            <button onClick={() => signIn()} className="text-[18px] text-white cursor-pointer rounded-[9999px] bg-[] hover:border-[0.0625rem] hover:border-solid hover:bg-[] pt-[12px] pb-[12px] pl-[20px] pr-[20px] font-700">Sign in</button>
        </>
    )
}