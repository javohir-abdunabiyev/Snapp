"use server";

export async function updatePost(postId: string, formData: FormData) {
    const title = formData.get("title")?.toString();
    const content = formData.get("content")?.toString() || "";
    const price = Number(formData.get("price"));

    if (!title || !price) return;

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, price }),
    });

    if (!res.ok) {
        throw new Error("Ошибка при обновлении поста");
    }

    return await res.json();
}
