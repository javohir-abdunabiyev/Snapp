"use client";

import { useState } from "react";

export default function QuantityController({
    itemId,
    quantity: initialQty,
}: {
    itemId: string;
    quantity: number;
}) {
    const [quantity, setQuantity] = useState(initialQty);

    const updateQuantity = async (newQty: number) => {
        const res = await fetch("/api/basket/update-quantity", {
            method: "POST",
            body: JSON.stringify({ itemId, quantity: newQty }),
        });

        if (res.ok) setQuantity(newQty);
    };

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={() => updateQuantity(quantity - 1)}
                disabled={quantity <= 1}
                className="cursor-pointer w-8 h-8 rounded bg-gray-700 text-white disabled:opacity-50"
            >
                −
            </button>
            <span>{quantity}</span>
            <button
                onClick={() => updateQuantity(quantity + 1)}
                disabled={quantity >= 10}
                className="cursor-pointer w-8 h-8 rounded bg-gray-700 text-white disabled:opacity-50"
            >
                +
            </button>
        </div>
    );
}
