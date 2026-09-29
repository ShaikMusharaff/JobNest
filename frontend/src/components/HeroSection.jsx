import React, { useState } from 'react'
import { Button } from './ui/button'
import { Search, Sparkles, TrendingUp, Briefcase, Building2, CheckCircle2, ArrowRight } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

const POPULAR_KEYWORDS = [
    "FullStack Developer",
    "Frontend Developer",
    "React.js",
    "Python",
    "Node.js",
    "Data Scientist",
    "Remote"
];

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = (term) => {
        const searchTerm = typeof term === 'string' ? term : query;
        if (!searchTerm.trim()) return;
        dispatch(setSearchedQuery(searchTerm));
        navigate("/browse");
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            searchJobHandler(query);
        }
    }

    return (
        <section className='relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 bg-gradient-to-b from-indigo-50/60 via-white to-slate-50/40'>
            {/* Ambient Background Glows */}
            <div className='absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-r from-purple-200/40 via-indigo-200/30 to-blue-200/40 blur-3xl -z-10 pointer-events-none rounded-full' />
            
            <div className='max-w-5xl mx-auto px-4 md:px-8 text-center'>
                {/* AI Badge */}
                <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 shadow-xs mb-6 hover:bg-indigo-100/60 transition-colors'>
                    <Sparkles className='w-4 h-4 text-[#6A38C2] animate-pulse' />
                    <span className='text-xs font-bold tracking-wide uppercase text-[#6A38C2]'>
                        AI-Powered Career & Job Matching Platform
                    </span>
                    <span className='w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping' />
                </div>

                {/* Main Headline */}
                <h1 className='text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15] mb-5'>
                    Search, Match & Land Your <br className='hidden sm:inline' />
                    <span className='bg-gradient-to-r from-[#6A38C2] via-purple-600 to-indigo-600 bg-clip-text text-transparent'>
                        Dream Career
                    </span>
                </h1>

                {/* Subtitle */}
                <p className='text-slate-600 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-normal'>
                    Connect with over 10,000+ top tech companies. Upload your resume for instant AI skill extraction, ATS scoring, and high-compatibility recommendations.
                </p>

                {/* Interactive Search Bar */}
                <div className='max-w-2xl mx-auto bg-white p-2 sm:p-2.5 rounded-2xl sm:rounded-full shadow-xl shadow-indigo-500/10 border border-slate-200/90 flex flex-col sm:flex-row items-center gap-2 transition-all hover:border-indigo-400 focus-within:border-[#6A38C2] focus-within:ring-4 focus-within:ring-indigo-100'>
                    <div className='flex items-center gap-3 w-full px-4 py-1.5'>
                        <Search className='w-5 h-5 text-slate-400 shrink-0' />
                        <input
                            type="text"
                            placeholder='Job title, skill (e.g. React, Python), or company...'
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className='w-full outline-hidden text-sm sm:text-base text-slate-800 placeholder:text-slate-400 font-medium bg-transparent'
                        />
                    </div>
                    <Button 
                        onClick={() => searchJobHandler(query)} 
                        className="w-full sm:w-auto px-7 py-3 rounded-xl sm:rounded-full bg-gradient-to-r from-[#6A38C2] to-indigo-600 hover:from-[#582da8] hover:to-indigo-700 text-white font-bold shadow-md shadow-indigo-500/25 shrink-0 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <span>Find Jobs</span>
                        <ArrowRight className='w-4 h-4' />
                    </Button>
                </div>

                {/* Popular Keywords Chips */}
                <div className='flex flex-wrap items-center justify-center gap-2 mt-6 text-xs text-slate-500'>
                    <span className='font-semibold flex items-center gap-1 text-slate-600'>
                        <TrendingUp className='w-3.5 h-3.5 text-indigo-500' />
                        Popular Searches:
                    </span>
                    {POPULAR_KEYWORDS.map((item, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                setQuery(item);
                                searchJobHandler(item);
                            }}
                            className='px-3 py-1 rounded-full bg-white hover:bg-indigo-50 hover:text-[#6A38C2] border border-slate-200/80 text-slate-600 transition-all font-medium cursor-pointer shadow-2xs hover:border-indigo-300'
                        >
                            {item}
                        </button>
                    ))}
                </div>

                {/* Trust Stats Bar */}
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-16 pt-10 border-t border-slate-200/60 max-w-4xl mx-auto'>
                    <div className='flex flex-col items-center justify-center p-3 rounded-xl bg-white/60 border border-slate-200/60 shadow-2xs'>
                        <div className='flex items-center gap-1.5 text-xl sm:text-2xl font-black text-slate-900'>
                            <Briefcase className='w-5 h-5 text-[#6A38C2]' />
                            <span>10,000+</span>
                        </div>
                        <span className='text-xs font-medium text-slate-500 mt-0.5'>Active Job Openings</span>
                    </div>

                    <div className='flex flex-col items-center justify-center p-3 rounded-xl bg-white/60 border border-slate-200/60 shadow-2xs'>
                        <div className='flex items-center gap-1.5 text-xl sm:text-2xl font-black text-slate-900'>
                            <Building2 className='w-5 h-5 text-indigo-600' />
                            <span>500+</span>
                        </div>
                        <span className='text-xs font-medium text-slate-500 mt-0.5'>Verified Tech Giants</span>
                    </div>

                    <div className='flex flex-col items-center justify-center p-3 rounded-xl bg-white/60 border border-slate-200/60 shadow-2xs'>
                        <div className='flex items-center gap-1.5 text-xl sm:text-2xl font-black text-slate-900'>
                            <Sparkles className='w-5 h-5 text-amber-500' />
                            <span>95%</span>
                        </div>
                        <span className='text-xs font-medium text-slate-500 mt-0.5'>AI Match Accuracy</span>
                    </div>

                    <div className='flex flex-col items-center justify-center p-3 rounded-xl bg-white/60 border border-slate-200/60 shadow-2xs'>
                        <div className='flex items-center gap-1.5 text-xl sm:text-2xl font-black text-slate-900'>
                            <CheckCircle2 className='w-5 h-5 text-emerald-500' />
                            <span>24 Hours</span>
                        </div>
                        <span className='text-xs font-medium text-slate-500 mt-0.5'>Avg. Recruiter Response</span>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default HeroSection