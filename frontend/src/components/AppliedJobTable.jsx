import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Calendar, Building2, CheckCircle2, Clock, XCircle, ArrowUpRight, Briefcase } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'

const AppliedJobTable = () => {
    const { allAppliedJobs } = useSelector(store => store.job);

    const getCompanyInitials = (name) => {
        if (!name) return "CO";
        return name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    const renderStatusBadge = (status) => {
        const s = status?.toLowerCase() || "pending";
        if (s === "accepted" || s === "selected") {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Accepted</span>
                </span>
            );
        }
        if (s === "rejected") {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Rejected</span>
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Pending Review</span>
            </span>
        );
    };

    if (!allAppliedJobs || allAppliedJobs.length === 0) {
        return (
            <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-[#6A38C2] flex items-center justify-center mx-auto mb-3">
                    <Briefcase className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm mb-1">No Applications Submitted</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                    Explore available positions on JobNest and submit your resume to start tracking application updates here.
                </p>
                <Link
                    to="/jobs"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6A38C2] hover:bg-[#582da8] text-white text-xs font-bold transition-all shadow-xs"
                >
                    <span>Browse Open Positions</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-slate-200/80 overflow-hidden bg-white shadow-2xs">
            <Table>
                <TableHeader className="bg-slate-50/80">
                    <TableRow className="border-b border-slate-200/80 hover:bg-transparent">
                        <TableHead className="font-bold text-slate-700 text-xs py-3.5 pl-6">Company</TableHead>
                        <TableHead className="font-bold text-slate-700 text-xs py-3.5">Job Role</TableHead>
                        <TableHead className="font-bold text-slate-700 text-xs py-3.5">Date Applied</TableHead>
                        <TableHead className="font-bold text-slate-700 text-xs py-3.5 text-right pr-6">Application Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {allAppliedJobs.map((appliedJob) => (
                        <TableRow key={appliedJob._id} className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
                            <TableCell className="pl-6 py-4">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-9 w-9 rounded-xl border border-slate-100 shadow-2xs">
                                        <AvatarImage src={appliedJob.job?.company?.logo} alt={appliedJob.job?.company?.name} />
                                        <AvatarFallback className="rounded-xl bg-gradient-to-tr from-[#6A38C2] to-indigo-600 text-white font-bold text-[10px]">
                                            {getCompanyInitials(appliedJob.job?.company?.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="font-bold text-slate-800 text-sm">
                                        {appliedJob.job?.company?.name || "Tech Corp"}
                                    </span>
                                </div>
                            </TableCell>

                            <TableCell className="py-4">
                                <Link 
                                    to={`/description/${appliedJob.job?._id}`}
                                    className="font-bold text-slate-900 hover:text-[#6A38C2] transition-colors text-sm flex items-center gap-1 group"
                                >
                                    <span>{appliedJob.job?.title || "Software Engineer"}</span>
                                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#6A38C2] transition-colors" />
                                </Link>
                                <span className="text-[11px] text-slate-400">
                                    {appliedJob.job?.jobType || "Full Time"} • ₹{appliedJob.job?.salary} LPA
                                </span>
                            </TableCell>

                            <TableCell className="py-4">
                                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                    <span>{formatDate(appliedJob?.createdAt)}</span>
                                </div>
                            </TableCell>

                            <TableCell className="py-4 text-right pr-6">
                                {renderStatusBadge(appliedJob?.status)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default AppliedJobTable