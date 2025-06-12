"use client";

import { useState } from "react";
import { UploadDropzone } from "@/app/utils/uploadthing";
import Image from "next/image";
import Form from "next/form";
import createPost from "@/app/actions/post";


export default function AddPost() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [price, setPrice] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    return (
        <div className="max-w-xl mx-auto p-6 space-y-4">
            <UploadDropzone

                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                    if (res && res[0]?.url) {
                        setImageUrl(res[0].url);
                        alert("✅ Изображение загружено");
                    }
                }}
                onUploadError={(err) => alert(`Ошибка загрузки: ${err.message}`)}
            />

            {imageUrl && (
                <Image src={imageUrl} alt="Загруженное изображение" width={200} height={200} />
            )}

            <Form action={createPost} className="space-y-4">
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Заголовок"
                    required
                    className="w-full border p-2"
                    name="title"
                />
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Контент"
                    className="w-full border p-2"
                    name="content"
                />
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Цена"
                    required
                    className="w-full border p-2"
                    name="price"
                />
                <input type="hidden" name="imageUrl" value={imageUrl} />
                <button type="submit" className="bg-black text-white px-4 py-2 rounded">
                    Создать пост
                </button>
            </Form>
        </div>
    );
}
