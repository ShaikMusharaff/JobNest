import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job';
import Footer from './shared/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { Search, Compass, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Browse = () => {
    useGetAllJobs();
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const [localQuery, setLocalQuery] = useState(searchedQuery || "");
    const dispatch = useDispatch();

    useEffect(() => {
        setLocalQuery(searchedQuery || "");
    }, [searchedQuery]);

    useEffect(() => {
        return () => {
            dispatch(setSearchedQuery(""));
        }
    }, [dispatch]);

    const handleSearch = (e) => {
        e.preventDefault();
        dispatch(setSearchedQuery(localQuery));
    };

    const clearSearch = () => {
        setLocalQuery("");
        dispatch(setSearchedQuery(""));
    };

    // Filter jobs by searchedQuery if present
    const filteredJobs = allJobs.filter((job) => {
        if (!searchedQuery) return true;
        const q = searchedQuery.toLowerCase();
        return (
            job?.title?.toLowerCase().includes(q) ||
            job?.description?.toLowerCase().includes(q) ||
            job?.location?.toLowerCase().includes(q) ||
            job?.company?.name?.toLowerCase().includes(q)
        );
    });

    return (
        <div className='min-h-screen bg-slate-50/50 flex flex-col justify-between'>
            <div>
                <Navbar />

                {/* Browse Header & Search Banner */}
                <div className='bg-white border-b border-slate-200/80 py-10 px-4 md:px-8'>
                    <div className='max-w-7xl mx-auto'>
                        <div className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
                            <div>
                                <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/60 text-[#6A38C2] text-xs font-bold uppercase tracking-wider mb-2'>
                                    <Compass className='w-3.5 h-3.5' />
                                    <span>Browse Catalog</span>
                                </div>
                                <h1 className='text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight'>
                                    Search All Available Positions
                                </h1>
                                <p className='text-sm text-slate-500 mt-1'>
                                    Showing <span className='font-bold text-slate-900'>{filteredJobs.length}</span> positions available across all verified companies
                                </p>
                            </div>

                            {/* Search Form */}
                            <form onSubmit={handleSearch} className='w-full md:w-96 flex items-center bg-slate-50 border border-slate-200 rounded-2xl p-1.5 focus-within:border-[#6A38C2] focus-within:ring-2 focus-within:ring-indigo-100 transition-all'>
                                <Search className='w-4 h-4 text-slate-400 ml-2.5 shrink-0' />
                                <input
                                    type="text"
                                    placeholder="Search by title, skill, or city..."
                                    value={localQuery}
                                    onChange={(e) => setLocalQuery(e.target.value)}
                                    className='w-full bg-transparent px-2.5 py-1.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-hidden font-medium'
                                />
                                {localQuery && (
                                    <button 
                                        type="button" 
                                        onClick={clearSearch} 
                                        className='text-slate-400 hover:text-slate-600 p-1 mr-1 cursor-pointer'
                                    >
                                        <X className='w-4 h-4' />
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    className='px-4 py-2 bg-[#6A38C2] hover:bg-[#582da8] text-white text-xs font-bold rounded-xl transition-colors shrink-0 cursor-pointer shadow-xs'
                                >
                                    Search
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Jobs Grid Container */}
                <div className='max-w-7xl mx-auto px-4 md:px-8 py-10'>
                    {
                        filteredJobs.length <= 0 ? (
                            <div className='text-center py-20 px-6 bg-white rounded-3xl border border-dashed border-slate-200 shadow-2xs'>
                                <div className='w-16 h-16 rounded-2xl bg-purple-50 text-[#6A38C2] flex items-center justify-center mx-auto mb-4'>
                                    <Compass className='w-8 h-8' />
                                </div>
                                <h3 className='font-bold text-slate-900 text-xl mb-1'>No Matching Jobs Found</h3>
                                <p className='text-sm text-slate-500 max-w-md mx-auto mb-5'>
                                    {searchedQuery 
                                        ? `We couldn't find any opportunities matching "${searchedQuery}". Try another keyword or browse all jobs.`
                                        : "There are currently no active job postings in the catalog."}
                                </p>
                                {searchedQuery && (
                                    <button
                                        onClick={clearSearch}
                                        className='px-5 py-2.5 rounded-xl bg-[#6A38C2] text-white text-xs font-bold hover:bg-purple-800 transition-colors cursor-pointer shadow-xs'
                                    >
                                        View All Jobs
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                                <AnimatePresence>
                                    {filteredJobs.map((job) => (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.96 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            key={job?._id}
                                        >
                                            <Job job={job} />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )
                    }
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default Browse