"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { useRef } from "react"
import Image from "next/image";
import { ArrowRight, LogIn } from "lucide-react";
import IccLogo from "@/public/images/icclogo.jpg";

export default function HomePage() {
  const plugin = useRef(Autoplay({ delay: 1500, stopOnInteraction: false }))
  const router = useRouter();

  const handleClick = (e: React.MouseEvent, input: string) => {
    router.push("/auth/login");
  }

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-between px-6 py-2">
        <div className="flex-shrink-0">
          <Image src={IccLogo} alt="ICC Logo" className="w-12 h-12 object-contain" />
        </div>

        <div className="w-full max-w-xs md:max-w-4xl flex-shrink-0">
          <Carousel
            plugins={[plugin.current]}
            className="w-full"
            opts={{
              loop: true,
              align: "start",
              slidesToScroll: 1,
            }}
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              <CarouselItem className="pl-2 md:pl-4 md:basis-1/3">
                <img
                  src="/images/african-electrician-europe.jpg"
                  alt="Électricien africain en Europe"
                  className="w-full h-auto object-cover rounded-2xl"
                />
              </CarouselItem>
              <CarouselItem className="pl-2 md:pl-4 md:basis-1/3">
                <img
                  src="/images/african-plumber-europe.jpg"
                  alt="Plombier africain en Europe"
                  className="w-full h-auto object-cover rounded-2xl"
                />
              </CarouselItem>
              <CarouselItem className="pl-2 md:pl-4 md:basis-1/3">
                <img
                  src="/images/african-carpenter-europe.jpg"
                  alt="Menuisier africain en Europe"
                  className="w-full h-auto object-cover rounded-2xl"
                />
              </CarouselItem>
              <CarouselItem className="pl-2 md:pl-4 md:basis-1/3">
                <img
                  src="/images/african-hairdresser-europe.jpg"
                  alt="Coiffeur africain en Europe"
                  className="w-full h-auto object-cover rounded-2xl"
                />
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </div>

        <div className="text-center flex-shrink-0">
          <h1 className="text-2xl font-bold text-black leading-tight mb-3">
            Annuaire des
            <br />
            professions de l'église
          </h1>
          <p className="text-slate-900 text-base md:text-lg leading-relaxed px-2">
            Trouvez un ou plusieurs professionnels au sein de votre église locale et entrez directement en contact avec
            eux
          </p>
        </div>

        <div className="w-full max-w-sm flex-shrink-0">
          <Button
            className="w-full bg-[#E67E22] hover:bg-[#D35400] text-white font-semibold py-3 px-8 rounded-full text-base"
            size="lg"
            onClick={(e) => handleClick(e, "login")}
          >
            Commencer ici
          </Button>
        </div>

        {/* <div className="flex justify-center mt-6">
          <a
            href="/infos"
            className="inline-flex items-center bg-slate-100 hover:bg-slate-200 text-slate-800 hover:text-slate-900 font-medium py-3 px-6 rounded-full transition-all duration-300 gap-2 group border border-slate-300 hover:border-slate-400 shadow-sm hover:shadow-md transform hover:scale-105"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span>Pourquoi choisir l'annuaire ?</span>
          </a>
        </div> */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          <a href="/infos">
            <span>Pourquoi choisir l'annuaire ?</span>
          </a>
          <div className="w-12 h-1 bg-black rounded-full"></div>
        </div>
      </div>
    </div>
  )
}
