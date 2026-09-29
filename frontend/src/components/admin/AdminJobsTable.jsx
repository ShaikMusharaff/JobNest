import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Eye, MoreHorizontal, Calendar, Briefcase, PlusCircle, Users } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Badge } from '../ui/badge'

const AdminJobsTable = () => { 
    const { allAdminJobs, searchJobByText } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allAdminJobs);
    const navigate = useNavigate();

    useEffect(() => { 
        const filteredJobs = allAdminJobs?.filter((job) => {
            if (!searchJobByText) return true;
            return job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) || 
                   job?.company?.name?.toLowerCase().includes(searchJobByText.toLowerCase());
        });
        setFilterJobs(filteredJobs || []);
    }, [allAdminJobs, searchJobByText]);

    const getCompanyInitials = (name) => {
        if (!name) return "CO";
        return name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    const renderDeadlineStatus = (deadline) => {
        if (!deadline) {
            return (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-50 border border-slate-200/60 px-2.5 py-0.5 rounded-full">
                    No Deadline
                </span>
            );
        }
        const targetDate = new Date(deadline);
        const now = new Date();
        const isExpired = now > targetDate;
        const diffDays = Math.ceil((targetDate - now) / (1000 * 60 * 60 * 24));

        if (isExpired) {
            return (
                <div className="space-y-0.5">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                        Closed (Expired)
                    </span>
                    <span className="text-[10px] text-slate-400 block">{formatDate(deadline)}</span>
                </div>
            );
        }

        if (diffDays <= 3) {
            return (
                <div className="space-y-0.5">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                        Ends in {diffDays <= 0 ? "Today" : `${diffDays}d`}
                    </span>
                    <span className="text-[10px] text-slate-400 block">{formatDate(deadline)}</span>
                </div>
            );
        }

        return (
            <div className="space-y-0.5">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Active ({diffDays}d left)
                </span>
                <span className="text-[10px] text-slate-400 block">{formatDate(deadline)}</span>
            </div>
        );
    };

    if (!filterJobs || filterJobs.length === 0) {
        return (
            <div className="text-center py-16 px-4 bg-white rounded-3xl border border-dashed border-slate-200 shadow-2xs">
                <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#6A38C2] flex items-center justify-center mx-auto mb-3">
                    <Briefcase className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-1">No Jobs Posted Yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5">
                    {searchJobByText
                        ? `No job postings match "${searchJobByText}". Try searching for another role.`
                        : "You haven't posted any job openings yet. Create a posting to start attracting applicants."}
                </p>
                <button
                    onClick={() => navigate("/admin/jobs/create")}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6A38C2] to-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-500/20 hover:from-[#582da8] hover:to-indigo-700 transition-all cursor-pointer"
                >
                    <PlusCircle className="w-4 h-4" />
                    <span>Post Your First Job</span>
                </button>
            </div>
        );
    }

    return (
        <div className="rounded-3xl border border-slate-200/80 overflow-hidden bg-white shadow-xs">
            <Table>
                <TableHeader className="bg-slate-50/80">
                    <TableRow className="border-b border-slate-200/80 hover:bg-transparent">
                        <TableHead className="font-bold text-slate-700 text-xs py-4 pl-6">Company</TableHead>
                        <TableHead className="font-bold text-slate-700 text-xs py-4">Job Role</TableHead>
                        <TableHead className="font-bold text-slate-700 text-xs py-4">Type & Compensation</TableHead>
                        <TableHead className="font-bold text-slate-700 text-xs py-4">Application Deadline</TableHead>
                        <TableHead className="font-bold text-slate-700 text-xs py-4 text-right pr-6">Applications</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filterJobs.map((job) => (
                        <TableRow key={job._id} className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
                            <TableCell className="pl-6 py-4">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-9 w-9 rounded-xl border border-slate-100 shadow-2xs">
                                        <AvatarImage src={job?.company?.logo} alt={job?.company?.name} />
                                        <AvatarFallback className="rounded-xl bg-gradient-to-tr from-[#6A38C2] to-indigo-600 text-white font-bold text-[10px]">
                                            {getCompanyInitials(job?.company?.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="font-bold text-slate-900 text-sm">
                                        {job?.company?.name || "Tech Corp"}
                                    </span>
                                </div>
                            </TableCell>

                            <TableCell className="py-4 font-bold text-slate-800 text-sm">
                                {job?.title}
                            </TableCell>

                            <TableCell className="py-4">
                                <div className="flex items-center gap-1.5">
                                    <Badge variant="outline" className="bg-purple-50 text-[#6A38C2] border-purple-200 text-[10px] font-semibold">
                                        {job?.jobType || "Full Time"}
                                    </Badge>
                                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-semibold">
                                        ₹{job?.salary} LPA
                                    </Badge>
                                </div>
                            </TableCell>

                            <TableCell className="py-4">
                                {renderDeadlineStatus(job?.deadline)}
                            </TableCell>

                            <TableCell className="py-4 text-right pr-6">
                                <div className="flex items-center justify-end gap-2">
                                    <button
                                        onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-[#6A38C2] font-bold text-xs transition-colors cursor-pointer border border-indigo-200/60"
                                    >
                                        <Users className="w-3.5 h-3.5" />
                                        <span>Applicants ({job?.applications?.length || 0})</span>
                                    </button>

                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <button className="w-8 h-8 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-40 p-2 rounded-2xl shadow-xl border-slate-200">
                                            <button 
                                                onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)} 
                                                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-[#6A38C2] transition-colors cursor-pointer text-left"
                                            >
                                                <Eye className="w-3.5 h-3.5 text-indigo-500" />
                                                <span>Review Applicants</span>
                                            </button>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default AdminJobsTable