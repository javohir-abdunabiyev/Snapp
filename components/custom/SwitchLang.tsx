"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoLanguageSharp } from "react-icons/io5";

const SwitchLang = () => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const handleLangChange = (locale: string): void => {
        document.cookie = `locale=${locale}; path=/;`;
        router.refresh();
        setIsOpen(false);
    }

    return (
        <div className="relative text-left">
            <button
                onClick={() => setIsOpen(prev => !prev)}
                className={`relative flex items-center justify-center w-[50px] hover:bg-[#ff90e8] ${isOpen ? "bg-[#ff90e8]" : ""} h-[40px] rounded-[8px] cursor-pointer`}
            >
                <span className={`w-full h-full rounded-[8px] flex items-center justify-center bg-white transform transition-all duration-150 ease-in-out hover:translate-x-[-0.3rem] hover:translate-y-[-0.3rem] ${isOpen ? "translate-x-[-0.3rem] translate-y-[-0.3rem]" : ""}`}>
                    <IoLanguageSharp size={25} />
                </span>
                <span className="absolute inset-0 bg-gray-200 rounded-[8px] z-[-1] transform  transition-all duration-150 ease-in-out group-hover:translate-x-0 group-hover:translate-y-0" />
            </button>

            {isOpen && (
                <div className="absolute w-[50px] h-[85px] flex flex-col items-center justify-center gap-[5px] bg-[#ff90e8] border rounded-[8px] shadow-md z-10 mt-[10px]">
                    <span className="absolute h-full inset-0 bg-[#ff90e8] rounded-[8px] z-[-1] transform transition-all duration-150 ease-in-out translate-x-[0.3rem] translate-y-[0.3rem]" />
                    <span className="flex flex-col gap-[5px] w-full h-full rounded-[8px] items-center justify-center bg-white transform transition-all duration-150 ease-in-out translate-x-0 translate-y-0">
                        <button
                            onClick={() => handleLangChange("ru")}
                            className="block cursor-pointer hover:bg-gray-200 rounded-[8px] px-4 py-2 text-black w-full text-left"
                        >
                            ru
                        </button>
                        <button
                            onClick={() => handleLangChange("en")}
                            className="block cursor-pointer hover:bg-gray-200 rounded-[8px] px-4 py-2 text-black w-full text-left"
                        >
                            en
                        </button>
                    </span>
                </div>
            )}
        </div>
    )
}

export default SwitchLang;
