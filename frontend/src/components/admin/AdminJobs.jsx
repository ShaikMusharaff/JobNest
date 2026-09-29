import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button' 
import { useNavigate } from 'react-router-dom' 
import { useDispatch } from 'react-redux' 
import AdminJobsTable from './AdminJobsTable'
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs'
import { setSearchJobByText } from '@/redux/jobSlice'
import { Briefcase, Plus, Search } from 'lucide-react'

const AdminJobs = () => {
    useGetAllAdminJobs();
    const [input, setInput] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setSearchJobByText(input));
    }, [input, dispatch]);

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            <Navbar />
            
            <div className='max-w-6xl mx-auto px-4 md:px-8 py-10'>
                {/* Header Banner */}
                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-slate-200/80'>
                    <div>
                        <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200/60 text-[#6A38C2] text-xs font-bold uppercase tracking-wider mb-2'>
                            <Briefcase className='w-3.5 h-3.5' />
                            <span>Recruitment Management</span>
                        </div>
                        <h1 className='text-3xl font-extrabold text-slate-900 tracking-tight'>
                            Posted Jobs
                        </h1>
                        <p className='text-sm text-slate-500 mt-1'>
                            Track live job openings, screen submitted candidate applications, and evaluate compatibility.
                        </p>
                    </div>

                    <Button 
                        onClick={() => navigate("/admin/jobs/create")}
                        className="rounded-2xl bg-gradient-to-r from-[#6A38C2] to-indigo-600 hover:from-[#582da8] hover:to-indigo-700 text-white font-bold text-xs px-5 py-2.5 shadow-md shadow-indigo-500/20 cursor-pointer flex items-center gap-2 self-start sm:self-auto hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Post New Job</span>
                    </Button>
                </div>

                {/* Filter Bar */}
                <div className='mb-6'>
                    <div className='relative max-w-sm'>
                        <Search className='w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2' />
                        <Input
                            className="pl-10 rounded-2xl bg-white border-slate-200 focus-visible:ring-[#6A38C2] text-xs sm:text-sm shadow-2xs"
                            placeholder="Filter jobs by title, company..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                    </div>
                </div>

                {/* Admin Jobs Table */}
                <AdminJobsTable />
            </div>
        </div>
    )
}

export default AdminJobs