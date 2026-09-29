import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal, FileText, CheckCircle2, XCircle, Clock, Calendar, Mail, Phone, ExternalLink } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);
    const [statusMap, setStatusMap] = useState({});

    const getCandidateInitials = (name) => {
        if (!name) return "CA";
        return name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    const statusHandler = async (status, id) => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status });
            if (res.data.success) {
                toast.success(res.data.message || `Candidate marked as ${status}`);
                setStatusMap(prev => ({ ...prev, [id]: status.toLowerCase() }));
            }
        } catch (error) {
            console.error("Status update error:", error);
            toast.error(error.response?.data?.message || "Failed to update candidate status");
        }
    };

    const applications = applicants?.applications || [];

    if (applications.length === 0) {
        return (
            <div className="text-center py-16 px-4 bg-white rounded-3xl border border-dashed border-slate-200 shadow-2xs">
                <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#6A38C2] flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-1">No Applicants Yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    No candidates have applied to this role yet. When applicants submit their resume, they will appear here with contact details and skills.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-3xl border border-slate-200/80 overflow-hidden bg-white shadow-xs">
            <Table>
                <TableHeader className="bg-slate-50/80">
                    <TableRow className="border-b border-slate-200/80 hover:bg-transparent">
                        <TableHead className="font-bold text-slate-700 text-xs py-4 pl-6">Candidate</TableHead>
                        <TableHead className="font-bold text-slate-700 text-xs py-4">Contact Info</TableHead>
                        <TableHead className="font-bold text-slate-700 text-xs py-4">Skills</TableHead>
                        <TableHead className="font-bold text-slate-700 text-xs py-4">Resume</TableHead>
                        <TableHead className="font-bold text-slate-700 text-xs py-4">Applied Date</TableHead>
                        <TableHead className="font-bold text-slate-700 text-xs py-4 text-right pr-6">Status & Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {applications.map((item) => {
                        const applicant = item?.applicant;
                        const currentStatus = statusMap[item._id] || item?.status?.toLowerCase() || "pending";
                        const skills = applicant?.profile?.skills || [];

                        return (
                            <TableRow key={item._id} className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
                                {/* Candidate Profile */}
                                <TableCell className="pl-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10 rounded-2xl border border-slate-200 shadow-2xs">
                                            <AvatarImage src={applicant?.profile?.profilePhoto} alt={applicant?.fullname} />
                                            <AvatarFallback className="rounded-2xl bg-gradient-to-tr from-[#6A38C2] to-indigo-600 text-white font-bold text-xs">
                                                {getCandidateInitials(applicant?.fullname)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <span className="font-bold text-slate-900 text-sm block">
                                                {applicant?.fullname || "Anonymous Candidate"}
                                            </span>
                                            {applicant?.profile?.bio && (
                                                <p className="text-[11px] text-slate-400 line-clamp-1 max-w-[180px]">
                                                    {applicant.profile.bio}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </TableCell>

                                {/* Contact Details */}
                                <TableCell className="py-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                            <span className="truncate max-w-[160px]">{applicant?.email}</span>
                                        </div>
                                        {applicant?.phoneNumber && (
                                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                <span>{applicant.phoneNumber}</span>
                                            </div>
                                        )}
                                    </div>
                                </TableCell>

                                {/* Skills */}
                                <TableCell className="py-4">
                                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                                        {skills.length > 0 ? (
                                            skills.slice(0, 3).map((skill, idx) => (
                                                <span key={idx} className="px-2 py-0.5 rounded-md bg-purple-50 text-[#6A38C2] text-[10px] font-bold border border-purple-200/60">
                                                    {skill}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-xs text-slate-400 italic">None listed</span>
                                        )}
                                        {skills.length > 3 && (
                                            <span className="text-[10px] text-slate-400 self-center">
                                                +{skills.length - 3}
                                            </span>
                                        )}
                                    </div>
                                </TableCell>

                                {/* Resume */}
                                <TableCell className="py-4">
                                    {applicant?.profile?.resume ? (
                                        <a 
                                            href={applicant.profile.resume} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-[#6A38C2] text-xs font-bold transition-colors border border-indigo-200/60"
                                        >
                                            <FileText className="w-3.5 h-3.5" />
                                            <span>View Resume</span>
                                            <ExternalLink className="w-3 h-3 ml-0.5 text-indigo-400" />
                                        </a>
                                    ) : (
                                        <span className="text-xs text-slate-400 italic">No resume</span>
                                    )}
                                </TableCell>

                                {/* Applied Date */}
                                <TableCell className="py-4">
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                        <span>{formatDate(item?.createdAt)}</span>
                                    </div>
                                </TableCell>

                                {/* Status & Actions */}
                                <TableCell className="py-4 text-right pr-6">
                                    <div className="flex items-center justify-end gap-2">
                                        {/* Status Chip */}
                                        {currentStatus === "accepted" && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                                <span>Accepted</span>
                                            </span>
                                        )}
                                        {currentStatus === "rejected" && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                                <XCircle className="w-3 h-3 text-rose-600" />
                                                <span>Rejected</span>
                                            </span>
                                        )}
                                        {currentStatus === "pending" && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                                <Clock className="w-3 h-3 text-amber-600" />
                                                <span>Pending</span>
                                            </span>
                                        )}

                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <button className="w-8 h-8 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-40 p-2 rounded-2xl shadow-xl border-slate-200">
                                                <div className="space-y-1">
                                                    <button 
                                                        onClick={() => statusHandler("Accepted", item._id)}
                                                        className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-bold text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer text-left"
                                                    >
                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                        <span>Accept Candidate</span>
                                                    </button>
                                                    <button 
                                                        onClick={() => statusHandler("Rejected", item._id)}
                                                        className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer text-left"
                                                    >
                                                        <XCircle className="w-3.5 h-3.5" />
                                                        <span>Reject Candidate</span>
                                                    </button>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    )
}

export default ApplicantsTable