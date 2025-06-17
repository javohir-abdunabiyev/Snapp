import prisma from "@/lib/prisma";

export default async function AddPost() {
    return (
        <div className="text-center">
            <div className="flex justify-center bg-white mt-[30px]">
                <img src="/images/orderpagebg.svg" alt="" draggable="false" className="w-full" />
            </div>
            <p className="text-white text-[20px] font-semibold mt-[10px]">You don't have orders</p>
        </div>
    )
}