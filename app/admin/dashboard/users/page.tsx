import ClientBanButton from "@/components/custom/ClientBanButton";
import prisma from "@/lib/prisma";

export default async function User() {
    const users = await prisma.user.findMany({
        include: {
            basket: {
                include: {
                    items: true,
                },
            },
            orders: true,
        },
    });



    return (
        <div className="grid grid-cols-4 mt-[30px] gap-4">
            {users.map((user) => (
                <div
                    key={user.id}
                    className="relative max-w-[400px] h-[200px] rounded-[8px]"
                >
                    <span className="w-full h-full rounded-[6px] flex justify-between p-[20px] bg-black transform transition-all duration-150 ease-in-out hover:translate-x-[-0.3rem] hover:translate-y-[-0.3rem] text-white">
                        <div className="flex flex-col justify-between">
                            <div>
                                <h2 className="text-[30px] font-medium truncate max-w-[200px] overflow-hidden whitespace-nowrap">
                                    {user.name}
                                </h2>
                                <p className="text-sm text-gray-400">{user.email}</p>
                            </div>
                            <div>
                                <ClientBanButton userId={user.id} isBanned={user.ban} />
                            </div>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                            <img
                                src="/images/userIcon.png"
                                alt=""
                                draggable="false"
                                className="!max-w-[100px] !max-h-[100px] rounded-full"
                            />
                            <div className="text-sm mt-1 font-bold text-right">
                                <p>🛒 Basket: {user.basket?.items.length ?? 0}</p>
                                <p>📦 Orders: {user.orders.length}</p>
                            </div>
                        </div>
                    </span>
                    <span className="absolute inset-0 bg-gray-200 rounded-[8px] z-[-1] transform transition-all duration-150 ease-in-out group-hover:translate-x-0 group-hover:translate-y-0" />
                </div>
            ))}
        </div>
    );
}
