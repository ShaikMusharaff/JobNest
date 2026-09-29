import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';
import { 
  Code2, 
  Server, 
  Database, 
  Palette, 
  Layers, 
  Cpu, 
  Smartphone, 
  ShieldCheck, 
  ArrowUpRight 
} from 'lucide-react';

const CATEGORIES = [
  {
    name: "Frontend Developer",
    icon: Code2,
    count: "1,450+ Jobs",
    color: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50/70 border-blue-200/60 text-blue-700"
  },
  {
    name: "Backend Developer",
    icon: Server,
    count: "2,120+ Jobs",
    color: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50/70 border-emerald-200/60 text-emerald-700"
  },
  {
    name: "FullStack Developer",
    icon: Layers,
    count: "3,300+ Jobs",
    color: "from-purple-500 to-[#6A38C2]",
    bg: "bg-purple-50/70 border-purple-200/60 text-purple-700"
  },
  {
    name: "Data Science & AI",
    icon: Cpu,
    count: "980+ Jobs",
    color: "from-amber-500 to-orange-600",
    bg: "bg-amber-50/70 border-amber-200/60 text-amber-700"
  },
  {
    name: "UI/UX & Graphic Designer",
    icon: Palette,
    count: "740+ Jobs",
    color: "from-rose-500 to-pink-600",
    bg: "bg-rose-50/70 border-rose-200/60 text-rose-700"
  },
  {
    name: "Mobile App Developer",
    icon: Smartphone,
    count: "860+ Jobs",
    color: "from-indigo-500 to-cyan-600",
    bg: "bg-cyan-50/70 border-cyan-200/60 text-cyan-700"
  },
  {
    name: "Cloud & DevOps",
    icon: Database,
    count: "1,150+ Jobs",
    color: "from-violet-500 to-purple-600",
    bg: "bg-violet-50/70 border-violet-200/60 text-violet-700"
  },
  {
    name: "Cybersecurity",
    icon: ShieldCheck,
    count: "520+ Jobs",
    color: "from-slate-700 to-slate-900",
    bg: "bg-slate-50/70 border-slate-200/60 text-slate-700"
  },
];

const CategoryCarousel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = (query) => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };

  return (
    <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Explore Roles</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Browse Jobs by <span className="bg-gradient-to-r from-[#6A38C2] to-indigo-600 bg-clip-text text-transparent">Discipline</span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Discover thousands of career opportunities curated across premier technical domains.
          </p>
        </div>
      </div>

      <Carousel className="w-full relative">
        <CarouselContent className="-ml-3">
          {CATEGORIES.map((cat, index) => {
            const IconComponent = cat.icon;
            return (
              <CarouselItem
                key={index}
                className="pl-3 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <div
                  onClick={() => searchJobHandler(cat.name)}
                  className="group relative p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-indigo-300 transition-all duration-300 cursor-pointer flex flex-col justify-between h-[150px] overflow-hidden hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${cat.bg} group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-[#6A38C2] group-hover:text-white text-slate-400 flex items-center justify-center transition-colors">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-[#6A38C2] transition-colors line-clamp-1">
                      {cat.name}
                    </h3>
                    <p className="text-xs font-medium text-slate-400 mt-0.5">
                      {cat.count}
                    </p>
                  </div>

                  {/* Bottom Accent line on hover */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6A38C2] to-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <div className="hidden sm:flex justify-end gap-2 mt-4">
          <CarouselPrevious className="static translate-y-0 h-9 w-9 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer" />
          <CarouselNext className="static translate-y-0 h-9 w-9 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer" />
        </div>
      </Carousel>
    </section>
  );
};

export default CategoryCarousel;
