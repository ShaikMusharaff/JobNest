import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { MapPin, ArrowRight, Building2, Clock } from 'lucide-react'

const LatestJobCards = ({ job }) => {
    const navigate = useNavigate();

    const getCompanyInitials = (name) => {
        if (!name) return "CO";
        return name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
    };

    const daysAgoFunction = (mongodbTime) => {
        if (!mongodbTime) return "Recent";
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const diffDays = Math.floor((currentTime - createdAt) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "1 day ago";
        return `${diffDays} days ago`;
    };

    return (
        <div 
            onClick={() => navigate(`/description/${job?._id}`)} 
            className='group relative p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-2xl hover:border-indigo-300 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1'
        >
            <div>
                {/* Header: Company & Relative Time */}
                <div className='flex items-center justify-between gap-3 mb-4'>
                    <div className='flex items-center gap-3'>
                        <Avatar className='h-11 w-11 rounded-2xl border border-slate-100 shadow-2xs group-hover:scale-105 transition-transform'>
                            <AvatarImage src={job?.company?.logo} alt={job?.company?.name} />
                            <AvatarFallback className='rounded-2xl bg-gradient-to-tr from-[#6A38C2] to-indigo-600 text-white font-bold text-xs'>
                                {getCompanyInitials(job?.company?.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h4 className='font-bold text-slate-800 text-sm group-hover:text-[#6A38C2] transition-colors line-clamp-1'>
                                {job?.company?.name || "Premier Tech Corp"}
                            </h4>
                            <div className='flex items-center gap-1 text-slate-400 text-xs font-medium'>
                                <MapPin className='w-3 h-3 text-slate-400' />
                                <span>{job?.location || "India / Remote"}</span>
                            </div>
                        </div>
                    </div>

                    <span className='inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100'>
                        <Clock className='w-3 h-3' />
                        {daysAgoFunction(job?.createdAt)}
                    </span>
                </div>

                {/* Job Title & Snippet */}
                <div className='my-3'>
                    <h3 className='font-extrabold text-lg text-slate-900 group-hover:text-[#6A38C2] transition-colors leading-snug line-clamp-1'>
                        {job?.title}
                    </h3>
                    <p className='text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed'>
                        {job?.description || "Exciting opportunity to build cutting-edge solutions with an innovative, high-impact team."}
                    </p>
                </div>
            </div>

            {/* Badges and Callout */}
            <div className='mt-5 pt-4 border-t border-slate-100 flex flex-col gap-3'>
                <div className='flex flex-wrap items-center gap-2'>
                    <Badge variant="outline" className='bg-blue-50/70 border-blue-200/80 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-lg'>
                        {job?.position ? `${job.position} Openings` : "Multiple Positions"}
                    </Badge>
                    <Badge variant="outline" className='bg-purple-50/70 border-purple-200/80 text-[#6A38C2] text-xs font-semibold px-2.5 py-0.5 rounded-lg'>
                        {job?.jobType || "Full Time"}
                    </Badge>
                    <Badge variant="outline" className='bg-emerald-50/70 border-emerald-200/80 text-emerald-700 text-xs font-semibold px-2.5 py-0.5 rounded-lg'>
                        ₹{job?.salary} LPA
                    </Badge>
                </div>

                <div className='flex items-center justify-between text-xs font-bold text-slate-600 group-hover:text-[#6A38C2] transition-colors pt-1'>
                    <span>View Details & Apply</span>
                    <div className='w-7 h-7 rounded-full bg-slate-50 group-hover:bg-[#6A38C2] group-hover:text-white flex items-center justify-center transition-all duration-300'>
                        <ArrowRight className='w-3.5 h-3.5' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LatestJobCards