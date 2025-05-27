import { getTranslations } from "next-intl/server";
import { Input } from "@/components/ui/input"
import { SlBasket } from "react-icons/sl";
import { MdHistory } from "react-icons/md";

export default async function Home() {
  const t = await getTranslations("catalog");
  const s = await getTranslations("placeholder");

  return (
    <div className="mt-[50px] pl-[30px] pr-[30px]">
      <div className="flex items-center gap-[40px]">
        <h2 className="text-white text-[50px] font-bold max-w-[440px] w-full">{t('catalogTXT')}</h2>
        <div className="w-full h-full flex items-center gap-[80px]">
          <Input type="text" placeholder={s('search')} className="border-gray-400 max-w-[500px] h-[50px] placeholder:text-[15px] placeholder:font-600 text-white !text-[17px]" />
          <nav className="flex items-center gap-[40px]">
            <a href="#">
              <button className="relative flex items-center justify-center w-[40px] h-[40px] rounded-[8px] cursor-pointer">
                <span className="w-full h-full rounded-[6px] flex items-center justify-center bg-[#242423] hover:bg-black transform transition-all duration-150 ease-in-out hover:translate-x-[-0.3rem] hover:translate-y-[-0.3rem]">
                  <SlBasket size={25} color="grey" />
                </span>
                <span className="absolute inset-0 bg-gray-200 rounded-[8px] z-[-1] transform  transition-all duration-150 ease-in-out group-hover:translate-x-0 group-hover:translate-y-0" />
              </button>
            </a>
            <a href="#">
              <button className="relative flex items-center justify-center w-[40px] h-[40px] rounded-[8px] cursor-pointer">
                <span className="w-full h-full rounded-[6px] flex items-center justify-center bg-[#242423] hover:bg-black transform transition-all duration-150 ease-in-out hover:translate-x-[-0.3rem] hover:translate-y-[-0.3rem]">
                  <MdHistory size={25} color="grey" />
                </span>
                <span className="absolute inset-0 bg-gray-200 rounded-[8px] z-[-1] transform  transition-all duration-150 ease-in-out group-hover:translate-x-0 group-hover:translate-y-0" />
              </button>
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
}
