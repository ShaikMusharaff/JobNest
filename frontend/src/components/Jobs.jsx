import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job';
import Footer from './shared/Footer';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Search, Sparkles, X } from 'lucide-react';
import { setSearchedQuery } from '@/redux/jobSlice';

const Jobs = () => {
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);
    const dispatch = useDispatch();

    useEffect(() => {
        if (searchedQuery) {
            const filteredJobs = allJobs.filter((job) => {
                const query = searchedQuery.toLowerCase();
                const titleMatch = job.title?.toLowerCase().includes(query);
                const descMatch = job.description?.toLowerCase().includes(query);
                const locMatch = job.location?.toLowerCase().includes(query);
                const companyMatch = job.company?.name?.toLowerCase().includes(query);
                return titleMatch || descMatch || locMatch || companyMatch;
            });
            setFilterJobs(filteredJobs);
        } else {
            setFilterJobs(allJobs);
        }
    }, [allJobs, searchedQuery]);

    return (
        <div className='min-h-screen bg-slate-50/50 flex flex-col justify-between'>
            <div>
                <Navbar />
                
                {/* Page Sub-header */}
                <div className='bg-white border-b border-slate-200/70 py-8 px-4 md:px-8'>
                    <div className='max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4'>
                        <div>
                            <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#6A38C2] text-xs font-bold uppercase tracking-wider mb-2'>
                                <Sparkles className='w-3 h-3' />
                                <span>Career Explorer</span>
                            </div>
                            <h1 className='text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight'>
                                Discover Tech Roles
                            </h1>
                            <p className='text-xs sm:text-sm text-slate-500 mt-1'>
                                Showing <span className='font-bold text-slate-900'>{filterJobs?.length || 0}</span> available positions
                            </p>
                        </div>

                        {/* Active filter badge if any */}
                        {searchedQuery && (
                            <div className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-xs font-semibold text-[#6A38C2]'>
                                <span>Filter: <strong>"{searchedQuery}"</strong></span>
                                <button 
                                    onClick={() => dispatch(setSearchedQuery(''))}
                                    className='hover:text-purple-900 cursor-pointer p-0.5'
                                >
                                    <X className='w-3.5 h-3.5' />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className='max-w-7xl mx-auto px-4 md:px-8 py-8'>
                    <div className='flex flex-col lg:flex-row gap-8 items-start'>
                        {/* Sidebar Filters */}
                        <div className='w-full lg:w-72 shrink-0'>
                            <FilterCard />
                        </div>

                        {/* Job Listing Grid */}
                        <div className='flex-1 w-full'>
                            {
                                filterJobs.length <= 0 ? (
                                    <div className='text-center py-20 px-6 bg-white rounded-3xl border border-dashed border-slate-200 shadow-2xs'>
                                        <div className='w-16 h-16 rounded-2xl bg-purple-50 text-[#6A38C2] flex items-center justify-center mx-auto mb-4'>
                                            <Search className='w-8 h-8' />
                                        </div>
                                        <h3 className='font-bold text-slate-900 text-xl mb-1'>No Jobs Found</h3>
                                        <p className='text-sm text-slate-500 max-w-md mx-auto mb-5'>
                                            We couldn't find any jobs matching your current filter criteria. Try searching for different keywords or clear your filters.
                                        </p>
                                        {searchedQuery && (
                                            <button
                                                onClick={() => dispatch(setSearchedQuery(''))}
                                                className='px-5 py-2.5 rounded-xl bg-[#6A38C2] text-white text-xs font-bold hover:bg-purple-800 transition-colors cursor-pointer shadow-xs'
                                            >
                                                Clear Search Filters
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                                        <AnimatePresence>
                                            {filterJobs.map((job) => (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 15 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    transition={{ duration: 0.25 }}
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
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default Jobs