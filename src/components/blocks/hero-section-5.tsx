import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'
import { motion } from 'motion/react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/interfaces-carousel"
import type { Article } from "@/data/articles"
import ArticleCard from "@/components/ArticleCard"

interface HeroSectionProps {
  trending: Article[];
  isLoading: boolean;
}

export function HeroSection({ trending, isLoading }: HeroSectionProps) {
    const [api, setApi] = useState<CarouselApi>()
    const [isHovered, setIsHovered] = useState(false)

    // Custom autoplay effect to avoid plugin dependency issue
    useEffect(() => {
        if (!api) return
        
        const interval = setInterval(() => {
            if (!isHovered) {
                api.scrollNext()
            }
        }, 3500)
        
        return () => clearInterval(interval)
    }, [api, isHovered])

    return (
        <main className="overflow-x-hidden relative">
            <section>
                <div className="py-24 md:pb-32 lg:pb-36 lg:pt-72 relative">
                    {/* The template's content container */}
                    <div className="relative z-10 mx-auto flex max-w-7xl flex-col px-6 lg:block lg:px-12">
                        <div className="mx-auto max-w-lg text-center lg:ml-0 lg:max-w-full lg:text-left">
                            <h1 className="mt-8 max-w-2xl text-balance text-5xl md:text-6xl lg:mt-16 xl:text-7xl font-editorial-heading drop-shadow-xl text-white">
                                Malawian Heritage Meets Modern Fashion
                            </h1>
                            <p className="mt-8 max-w-2xl text-balance text-lg text-white/90 font-sans drop-shadow-lg">
                                A premium social editorial platform celebrating Malawian fashion culture, connecting creatives, designers, and enthusiasts across the country.
                            </p>

                            <div className="mt-12 flex flex-col items-center justify-center gap-2 sm:flex-row lg:justify-start">
                                <Button
                                    asChild
                                    size="lg"
                                    className="h-12 rounded-full pl-5 pr-3 text-base shadow-xl">
                                    <Link to="/archives/peak">
                                        <span className="text-nowrap">Read Latest Issue</span>
                                        <ChevronRight className="ml-1" />
                                    </Link>
                                </Button>
                                <Button
                                    key={2}
                                    asChild
                                    size="lg"
                                    variant="ghost"
                                    className="h-12 rounded-full px-5 text-base hover:bg-zinc-950/5 dark:hover:bg-white/5 backdrop-blur-sm bg-background/30 shadow-xl border border-primary/10">
                                    <Link to="/designers">
                                        <span className="text-nowrap">Discover Designers</span>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                    
                    {/* The template's exact background video container */}
                    <div className="aspect-[2/3] absolute inset-1 overflow-hidden rounded-3xl border border-black/10 sm:aspect-video lg:rounded-[3rem] dark:border-white/5 bg-black">
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="size-full object-cover opacity-70"
                            src="/fashion.mp4"></video>
                        <div className="absolute inset-0 bg-black/40 pointer-events-none" />
                    </div>
                </div>
            </section>

            {/* Trending Articles Carousel Section */}
            {trending.length > 0 && (
                <section className="bg-background pb-12 pt-8 border-t border-border mt-8 relative z-10">
                    <div className="group relative m-auto max-w-7xl px-6">
                        <div className="flex flex-col items-center">
                            <div className="w-full mb-8 text-center md:text-left md:mb-12">
                                <span className="font-sans text-xs font-medium tracking-widest uppercase text-primary">
                                    Featured Editorials
                                </span>
                                <h2 className="text-editorial-heading text-2xl md:text-3xl text-foreground mt-2">
                                    Trending Ascent
                                </h2>
                            </div>
                            <div 
                                className="w-full relative px-2 md:px-12 overflow-hidden"
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                            >
                                {/* Edge blur/fade masks */}
                                <div className="pointer-events-none absolute inset-y-0 left-0 w-8 md:w-16 bg-gradient-to-r from-background to-transparent z-10" />
                                <div className="pointer-events-none absolute inset-y-0 right-0 w-8 md:w-16 bg-gradient-to-l from-background to-transparent z-10" />
                                
                                <Carousel 
                                    setApi={setApi}
                                    orientation="horizontal" 
                                    opts={{ loop: true, align: "start" }} 
                                    className="w-full"
                                >
                                    <CarouselContent className="py-4">
                                        {trending.map((article) => (
                                            <CarouselItem key={article.id} className="md:basis-1/2 lg:basis-1/3 pl-4 md:pl-6 opacity-80 transition-opacity duration-500 hover:opacity-100 data-[active]:opacity-100">
                                                <ArticleCard article={article} />
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious className="left-2 md:left-0 z-20 bg-background/80 backdrop-blur-md shadow-md border-border w-10 h-10" />
                                    <CarouselNext className="right-2 md:right-0 z-20 bg-background/80 backdrop-blur-md shadow-md border-border w-10 h-10" />
                                </Carousel>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </main>
    )
}