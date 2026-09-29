import React, { useState } from 'react'
import { Button } from './ui/button'
import { Bookmark, MapPin, Building2, Clock, ArrowRight, Check } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const Job = ({ job }) => {
    const navigate = useNavigate();
    const [isSaved, setIsSaved] = useState(false);

    const daysAgoFunction = (mongodbTime) => {
        if (!mongodbTime) return "Recent";
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const diffDays = Math.floor((currentTime - createdAt) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "1 day ago";
        return `${diffDays} days ago`;
    };

    const getCompanyInitials = (name) => {
        if (!name) return "CO";
        return name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
    };

    const toggleSaveJob = (e) => {
        e.stopPropagation();
        setIsSaved(!isSaved);
        if (!isSaved) {
            toast.success("Job bookmarked for later review!");
        } else {
            toast.info("Job removed from bookmarks");
        }
    };
    
    return (
        <div className='group p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-2xl hover:border-indigo-300 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1'>
            <div>
                {/* Top Meta Bar */}
                <div className='flex items-center justify-between gap-2 mb-4'>
                    <span className='inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-100'>
                        <Clock className='w-3 h-3 text-slate-400' />
                        <span>{daysAgoFunction(job?.createdAt)}</span>
                    </span>

                    <button 
                        onClick={toggleSaveJob}
                        aria-label="Bookmark job"
                        className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                            isSaved 
                                ? 'bg-amber-500 border-amber-500 text-white shadow-xs' 
                                : 'bg-white border-slate-200 text-slate-400 hover:text-amber-500 hover:border-amber-300 hover:bg-amber-50/50'
                        }`}
                    >
                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
                    </button>
                </div>

                {/* Company Info */}
                <div className='flex items-center gap-3.5 my-2'>
                    <Avatar className='h-12 w-12 rounded-2xl border border-slate-100 shadow-2xs group-hover:scale-105 transition-transform'>
                        <AvatarImage src={job?.company?.logo} alt={job?.company?.name} />
                        <AvatarFallback className='rounded-2xl bg-gradient-to-tr from-[#6A38C2] to-indigo-600 text-white font-bold text-xs'>
                            {getCompanyInitials(job?.company?.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className='overflow-hidden'>
                        <h4 className='font-bold text-base text-slate-800 group-hover:text-[#6A38C2] transition-colors truncate'>
                            {job?.company?.name || "Premier Tech Corp"}
                        </h4>
                        <div className='flex items-center gap-1 text-slate-400 text-xs font-medium mt-0.5'>
                            <MapPin className='w-3.5 h-3.5 text-slate-400 shrink-0' />
                            <span className='truncate'>{job?.location || "India / Remote"}</span>
                        </div>
                    </div>
                </div>

                {/* Job Title & Details */}
                <div className='my-4'>
                    <h3 
                        onClick={() => navigate(`/description/${job?._id}`)}
                        className='font-extrabold text-lg text-slate-900 group-hover:text-[#6A38C2] transition-colors leading-snug cursor-pointer line-clamp-1'
                    >
                        {job?.title}
                    </h3>
                    <p className='text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed'>
                        {job?.description || "Great role with an agile product team building modern scalable systems."}
                    </p>
                </div>

                {/* Badges */}
                <div className='flex flex-wrap items-center gap-2 mt-3'>
                    <Badge variant="outline" className='bg-blue-50/80 border-blue-200/80 text-blue-700 font-semibold text-xs px-2.5 py-0.5 rounded-lg'>
                        {job?.position ? `${job.position} Openings` : "Multiple Positions"}
                    </Badge>
                    <Badge variant="outline" className='bg-purple-50/80 border-purple-200/80 text-[#6A38C2] font-semibold text-xs px-2.5 py-0.5 rounded-lg'>
                        {job?.jobType || "Full Time"}
                    </Badge>
                    <Badge variant="outline" className='bg-emerald-50/80 border-emerald-200/80 text-emerald-700 font-semibold text-xs px-2.5 py-0.5 rounded-lg'>
                        ₹{job?.salary} LPA
                    </Badge>
                </div>
            </div>

            {/* Action Buttons */}
            <div className='flex items-center gap-3 mt-6 pt-4 border-t border-slate-100'>
                <Button 
                    onClick={() => navigate(`/description/${job?._id}`)} 
                    variant="outline"
                    className="flex-1 rounded-xl border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/60 text-slate-700 hover:text-[#6A38C2] font-bold text-xs py-2.5 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                    <span>View Details</span>
                    <ArrowRight className='w-3.5 h-3.5' />
                </Button>

                <Button 
                    onClick={toggleSaveJob}
                    className={`rounded-xl font-bold text-xs py-2.5 px-4 cursor-pointer transition-all ${
                        isSaved 
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                            : 'bg-slate-900 hover:bg-[#6A38C2] text-white shadow-xs'
                    }`}
                >
                    {isSaved ? (
                        <span className='flex items-center gap-1'>
                            <Check className='w-3.5 h-3.5' /> Saved
                        </span>
                    ) : (
                        "Save"
                    )}
                </Button>
            </div>
        </div>
    )
}

export default Job