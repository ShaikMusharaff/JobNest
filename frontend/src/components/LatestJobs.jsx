import React from 'react'
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux'; 
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Briefcase } from 'lucide-react';

const LatestJobs = () => {
    const { allJobs } = useSelector(store => store.job);
    const navigate = useNavigate();
   
    return (
        <section className='max-w-7xl mx-auto px-4 md:px-8 py-16'>
            {/* Header */}
            <div className='flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10'>
                <div>
                    <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200/60 text-[#6A38C2] text-xs font-bold uppercase tracking-wider mb-2'>
                        <Sparkles className='w-3.5 h-3.5' />
                        <span>Featured Roles</span>
                    </div>
                    <h2 className='text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight'>
                        Latest & Top <span className='bg-gradient-to-r from-[#6A38C2] to-indigo-600 bg-clip-text text-transparent'>Job Openings</span>
                    </h2>
                    <p className='text-sm text-slate-500 mt-1 max-w-xl'>
                        Explore verified career opportunities fresh from fast-growing startups and industry-leading enterprises.
                    </p>
                </div>

                {allJobs?.length > 0 && (
                    <Button 
                        onClick={() => navigate("/jobs")} 
                        variant="outline"
                        className='self-start sm:self-auto rounded-xl border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/60 text-slate-700 hover:text-[#6A38C2] font-bold text-xs flex items-center gap-2 px-4 py-2 cursor-pointer transition-all'
                    >
                        <span>Explore All Jobs</span>
                        <ArrowRight className='w-3.5 h-3.5' />
                    </Button>
                )}
            </div>

            {/* Jobs Grid */}
            {
                !allJobs || allJobs.length <= 0 ? (
                    <div className='text-center py-16 px-4 bg-slate-50 rounded-3xl border border-dashed border-slate-200'>
                        <div className='w-14 h-14 rounded-2xl bg-white shadow-xs border border-slate-200 flex items-center justify-center text-slate-400 mx-auto mb-3'>
                            <Briefcase className='w-6 h-6' />
                        </div>
                        <h3 className='font-bold text-slate-800 text-lg mb-1'>No Jobs Available Right Now</h3>
                        <p className='text-sm text-slate-500 max-w-md mx-auto'>
                            Check back soon as top employers post new job opportunities daily.
                        </p>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {allJobs.slice(0, 6).map((job) => (
                            <LatestJobCards key={job._id} job={job} />
                        ))}
                    </div>
                )
            }
        </section>
    )
}

export default LatestJobs