import React, { useEffect } from 'react'
import Navbar from '../shared/Navbar'
import ApplicantsTable from './ApplicantsTable'
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllApplicants } from '@/redux/applicationSlice';
import { Users, ArrowLeft, Sparkles } from 'lucide-react';

const Applicants = () => {
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { applicants } = useSelector(store => store.application);

    useEffect(() => {
        const fetchAllApplicants = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`, { withCredentials: true });
                dispatch(setAllApplicants(res.data.job));
            } catch (error) {
                console.error("Fetch applicants error:", error);
            }
        }
        fetchAllApplicants();
    }, [params.id, dispatch]);

    const totalApplicants = applicants?.applications?.length || 0;

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            <Navbar />
            
            <div className='max-w-7xl mx-auto px-4 md:px-8 py-10'>
                {/* Back button */}
                <button 
                    onClick={() => navigate("/admin/jobs")} 
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-[#6A38C2] hover:border-indigo-300 font-bold text-xs shadow-2xs transition-colors mb-6 cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Posted Jobs</span>
                </button>

                {/* Header */}
                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-slate-200/80'>
                    <div>
                        <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200/60 text-[#6A38C2] text-xs font-bold uppercase tracking-wider mb-2'>
                            <Users className='w-3.5 h-3.5' />
                            <span>Candidate Pipeline</span>
                        </div>
                        <h1 className='text-3xl font-extrabold text-slate-900 tracking-tight'>
                            Applicants for {applicants?.title || "Role"}
                        </h1>
                        <p className='text-sm text-slate-500 mt-1'>
                            Review candidate credentials, inspect uploaded resumes, and update recruitment progress.
                        </p>
                    </div>

                    <div className='flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-slate-200 shadow-2xs self-start sm:self-auto'>
                        <span className='text-xs font-bold text-slate-500'>Total Candidates:</span>
                        <span className='px-2 py-0.5 rounded-full bg-[#6A38C2] text-white text-xs font-extrabold'>
                            {totalApplicants}
                        </span>
                    </div>
                </div>

                {/* Applicants Table */}
                <ApplicantsTable />
            </div>
        </div>
    )
}

export default Applicants