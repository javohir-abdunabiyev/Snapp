"use client";

import { useRef, useState } from "react";
import { UploadDropzone } from "@/app/utils/uploadthing";
import Image from "next/image";
import Form from "next/form";
import createPost from "@/app/actions/post";


export default function AddPost() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [price, setPrice] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    const formRef = useRef<HTMLFormElement>(null);

    const handleCreateClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!imageUrl) {
            alert("❗ Загрузите изображение перед отправкой.");
            return;
        }
        formRef.current?.requestSubmit();
    };



    return (
        <div className="max-w-xl mx-auto p-6 space-y-4">

            <h2 className="text-2xl font-semibold text-white">Add a new post</h2>

            <UploadDropzone
                appearance={{
                    container: {
                        height: "200px"
                    }
                }}
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                    if (res && res[0]?.url) {
                        setImageUrl(res[0].url);
                        alert("✅ Изображение загружено");
                    }
                }}
                onUploadError={(err) => alert(`Ошибка загрузки: ${err.message}`)}
            />

            <Form
                ref={formRef}
                action={createPost}
                className="space-y-4"
            >
                <h3 className="text-[20px] font-semibold text-white">Post title</h3>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                    required
                    className="text-white placeholder:text-gray-500 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black transition"
                    name="title"
                />
                <h3 className="text-[20px] font-semibold text-white">Post content</h3>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Content"
                    className="text-white placeholder:text-gray-500 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black transition min-h-[120px]"
                    name="content"
                />
                <h3 className="text-[20px] font-semibold text-white">Post price in $ (dollar)</h3>
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Price in $ (dollar)"
                    required
                    className="text-white placeholder:text-gray-500 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black transition"
                    name="price"
                />
                {imageUrl && (
                    <Image src={imageUrl} alt="Загруженное изображение" width={200} height={200} />
                )}
                <input type="hidden" name="imageUrl" value={imageUrl} required />
                <button
                    type="button"
                    onClick={handleCreateClick}
                    className="relative flex items-center rounded-[8px] justify-center w-full h-[40px] cursor-pointer hover:bg-[#ff90e8]"
                >
                    <span className="rounded-[8px] flex items-center h-[40px] justify-center bg-black text-white !w-full transform transition-all duration-150 ease-in-out hover:translate-x-[-0.3rem] hover:translate-y-[-0.3rem]">
                        Create a post
                    </span>
                </button>
            </Form>
        </div>
    );
}