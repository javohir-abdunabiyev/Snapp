import BasketPage from "@/components/custom/BasketPage";

export const metadata = {
    title: 'Basket — Snapp',
    robots: {
        index: false,
        follow: true,
    },
    icons: {
        icon: '/images/faviconWeb.png',
    },
};

export default function Page() {
    return <BasketPage />;
}
