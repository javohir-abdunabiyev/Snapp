"use client";

import { useEffect, useState } from "react";
import { SlBasket } from "react-icons/sl";
import { FaTrash } from "react-icons/fa";
import Link from "next/link";

type Product = {
    id: string;
    title: string;
    content: string | null;
    price: number;
    imageUrl: string;
};

type Translations = {
    back: string;
    noDescription: string;
    registerPrompt: string;
    addToBasket: string;
    removeFromBasket: string;
};

export default function ProductPage({
    id,
    isAuth,
    translations,
}: {
    id: string;
    isAuth: boolean;
    translations: Translations;
}) {
    const [product, setProduct] = useState<Product | null>(null);
    const [inBasket, setInBasket] = useState(false);
    const [basketItemId, setBasketItemId] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            const res = await fetch(`/api/product/${id}`);
            if (!res.ok) return;
            const data = await res.json();
            setProduct(data.product);
        };

        const checkBasket = async () => {
            const res = await fetch("/api/basket/items", {
                cache: "no-store",
                credentials: "include",
            });

            const data = await res.json();
            const found = data.items.find((item: any) => item.postId === id);

            if (found) {
                setInBasket(true);
                setBasketItemId(found.id);
            } else {
                setInBasket(false);
                setBasketItemId(null);
            }
        };

        fetchProduct();
        if (isAuth) checkBasket();
    }, [id, isAuth]);

    const addToBasket = async () => {
        if (!product) return;

        const res = await fetch("/api/basket/add", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ postId: product.id }),
        });

        if (res.ok) {
            const data = await res.json();
            setInBasket(true);
            setBasketItemId(data.basketItemId);
        }
    };

    const removeFromBasket = async () => {
        if (!basketItemId) return;

        const res = await fetch("/api/basket/delete-item", {
            method: "DELETE",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ itemId: basketItemId }),
        });

        if (res.ok) {
            setInBasket(false);
            setBasketItemId(null);
        }
    };

    if (!product) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#111] py-10 px-4">
            <div className="max-w-6xl mx-auto">
                <Link
                    href="/"
                    className="inline-block mb-6 text-sm text-pink-500 hover:text-pink-600 transition"
                >
                    ← {translations.back}
                </Link>

                <div className="flex flex-col md:flex-row gap-10 items-center bg-[#1c1c1e] p-6 md:p-10 rounded-2xl shadow-lg border border-gray-700">
                    <div className="flex-shrink-0 w-full md:w-[400px]">
                        <img
                            src={product.imageUrl}
                            alt={product.title}
                            draggable="false"
                            className="w-full h-[300px] object-contain rounded-md"
                        />
                    </div>

                    <div className="flex-1 flex flex-col">
                        <div className="flex-grow">
                            <h1 className="text-3xl font-bold text-white mb-4">{product.title}</h1>
                            <p className="text-gray-400 text-lg max-w-[630px] break-words break-all whitespace-pre-line">
                                {product.content || translations.noDescription}
                            </p>
                        </div>

                        <div className="mt-6 space-y-4">
                            <div className="text-2xl font-bold text-pink-500">{product.price}$</div>

                            {isAuth ? (
                                inBasket ? (
                                    <button
                                        onClick={removeFromBasket}
                                        className="relative flex items-center rounded-[8px] justify-center w-full h-[40px] cursor-pointer hover:bg-red-400"
                                    >
                                        <span className="rounded-[8px] flex items-center h-[40px] justify-center bg-black text-white !w-full gap-2 transform transition-all duration-150 ease-in-out hover:translate-x-[-0.3rem] hover:translate-y-[-0.3rem]">
                                            <FaTrash /> {translations.removeFromBasket}
                                        </span>
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={addToBasket}
                                        className="relative flex items-center rounded-[8px] justify-center w-full h-[40px] cursor-pointer hover:bg-[#ff90e8]"
                                    >
                                        <span className="rounded-[8px] flex items-center h-[40px] justify-center bg-black text-white !w-full transform transition-all duration-150 ease-in-out hover:translate-x-[-0.3rem] hover:translate-y-[-0.3rem]">
                                            <SlBasket className="mr-2" /> {translations.addToBasket}
                                        </span>
                                    </button>
                                )
                            ) : (
                                <p className="text-yellow-400 text-sm">{translations.registerPrompt}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
