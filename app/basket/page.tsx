import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import QuantityController from "@/components/custom/QuantityCont";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { createOrder } from "../actions/order";
import Form from "next/form";

export default async function BasketPage() {
    const session = await getServerSession();

    if (!session?.user?.email) {
        redirect("/");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            basket: {
                include: {
                    items: true,
                },
            },
        },
    });

    const items = user?.basket?.items || [];

    return (
        <div className="p-10 text-white">
            <h1 className="text-3xl font-bold mb-6">Ваша корзина</h1>
            {items.length === 0 ? (
                <p>Корзина пуста</p>
            ) : (
                <div className="grid grid-cols-[repeat(5,300px)] gap-6">
                    {items.map((item) => (
                        <div key={item.id} className="relative max-w-[300px] rounded-[8px]">
                            <span className="w-full h-full rounded-[6px] flex flex-col justify-between p-[20px] bg-black transform transition-all duration-150 ease-in-out hover:translate-x-[-0.3rem] hover:translate-y-[-0.3rem] text-white">
                                <div className="max-w-[300px] border-b-[1px] border-y-gray-700">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.title}
                                        draggable="false"
                                        className="w-[300px] h-[200px] object-contain mb-[10px]"
                                    />
                                </div>
                                <div className="flex flex-col justify-between min-h-[140px]">
                                    <h3 className="text-[20px] font-semibold mt-[5px] mb-[10px]">{item.title}</h3>
                                    <div className="flex items-center justify-between mt-[10px]">
                                        <p>{item.price}$</p>
                                        <QuantityController itemId={item.id} quantity={item.quantity} />
                                    </div>
                                </div>
                            </span>
                            <span className="absolute inset-0 bg-gray-200 rounded-[8px] z-[-1] transform transition-all duration-150 ease-in-out group-hover:translate-x-0 group-hover:translate-y-0" />
                        </div>
                    ))}
                    {/* ORDER DIALOG */}
                    <div className="fixed bottom-[40px] right-[20px]">
                        <Dialog>
                            <DialogTrigger asChild>
                                <button className="relative flex items-center rounded-[8px] justify-center w-full h-[40px] cursor-pointer hover:bg-orange-500">
                                    <span className="rounded-[8px] p-[20px] flex items-center h-[40px] justify-center bg-[#ff90e8] text-black font-semibold !w-full transform transition-all duration-150 ease-in-out hover:translate-x-[-0.3rem] hover:translate-y-[-0.3rem]">
                                        Оформить заказ
                                    </span>
                                </button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Оформить заказ</DialogTitle>
                                    <DialogDescription>
                                        Пожалуйста, введите адрес и номер телефона (начиная с +998).
                                    </DialogDescription>
                                </DialogHeader>

                                {/* FORM */}
                                <Form action={createOrder}>
                                    <div className="mb-4">
                                        <label htmlFor="address" className="block text-sm font-medium mb-1">Ваш адрес</label>
                                        <input
                                            type="text"
                                            name="address"
                                            id="address"
                                            className="w-full p-2 rounded bg-[#1e1e1e] text-white border border-gray-500 focus:outline-none focus:border-white"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="phone" className="block text-sm font-medium mb-1">Ваш номер телефона</label>
                                        <input
                                            type="text"
                                            name="phone"
                                            id="phone"
                                            pattern="\+998\d{9}"
                                            title="+998XXXXXXXXX"
                                            className="w-full p-2 rounded bg-[#1e1e1e] text-white border border-gray-500 focus:outline-none focus:border-white"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="rounded-[8px] p-[10px] flex items-center h-[40px] justify-center bg-[#ff90e8] text-black font-semibold w-full transform transition-all duration-150 ease-in-out hover:translate-x-[-0.3rem] hover:translate-y-[-0.3rem] hover:bg-orange-500"
                                    >
                                        Подтвердить заказ
                                    </button>
                                </Form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            )}
        </div>
    );
}
