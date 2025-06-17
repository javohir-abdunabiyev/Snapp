import { getTranslations } from "next-intl/server";
import { Input } from "@/components/ui/input"
import { SlBasket } from "react-icons/sl";
import { MdHistory } from "react-icons/md";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";

export default async function Home() {
  const t = await getTranslations("catalog");
  const s = await getTranslations("placeholder");

  const posts = await prisma.post.findMany({
    where: {
      published: true,
    }
  });

  const sereverSession = await getServerSession();

  return (
    <div className="mt-[50px] pl-[30px] pr-[30px]">
      <div className="flex items-center gap-[40px]">
        <h2 className="text-white text-[50px] font-bold max-w-[440px] w-full">{t('catalogTXT')}</h2>
        <div className="w-full h-full flex items-center gap-[80px]">
          <Input type="text" placeholder={s('search')} className="border-gray-400 max-w-[500px] h-[50px] placeholder:text-[15px] placeholder:font-600 text-white !text-[17px]" />
          {sereverSession ? (
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
          ) : ""}
        </div>
      </div>
      <div className="grid grid-cols-4 mt-[30px] gap-4">
        {posts.map((post) => (
          <div key={post.id} className="relative max-w-[400px] rounded-[8px] cursor-pointer">
            <span className="w-full h-full rounded-[6px] flex flex-col justify-between p-[20px] bg-black transform transition-all duration-150 ease-in-out hover:translate-x-[-0.3rem] hover:translate-y-[-0.3rem] text-white">
              <div className="border-b-[1px] border-y-gray-700">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full max-h-[160px] object-contain mb-[20px]"
                  draggable="false"
                />
              </div>
              <div className="flex flex-col justify-between min-h-[140px]">
                <h3 className="text-[20px] font-semibold mt-[5px] mb-[10px]">{post.title}</h3>
                <p className="line-clamp-2 text-gray-400 break-words break-all">
                  {post.content ? post.content : "(There is no content for this post)"}
                </p>
                <div className="flex items-center justify-between mt-[10px]">
                  <p>{post.price}$</p>
                </div>
              </div>
            </span>
            <span className="absolute inset-0 bg-gray-200 rounded-[8px] z-[-1] transform transition-all duration-150 ease-in-out group-hover:translate-x-0 group-hover:translate-y-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
