import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useSelector } from 'react-redux'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { Loader2, Briefcase, Building2, MapPin, IndianRupee, Clock, Sparkles, AlertCircle, ArrowLeft, Calendar, Users } from 'lucide-react'

const PostJob = () => {
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "Full Time",
        experience: "",
        position: 1,
        companyId: "",
        deadline: ""
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { companies } = useSelector(store => store.company);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const setPresetDeadline = (days) => {
        if (!days) {
            setInput({ ...input, deadline: "" });
            return;
        }
        const target = new Date();
        target.setDate(target.getDate() + days);
        const yyyy = target.getFullYear();
        const mm = String(target.getMonth() + 1).padStart(2, '0');
        const dd = String(target.getDate()).padStart(2, '0');
        setInput({ ...input, deadline: `${yyyy}-${mm}-${dd}` });
    };

    const selectChangeHandler = (value) => {
        const selectedCompany = companies.find((company) => company.name.toLowerCase() === value);
        if (selectedCompany) {
            setInput({ ...input, companyId: selectedCompany._id });
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!input.companyId) {
            toast.error("Please select an organization/company for this job posting");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message || "Job posted successfully!");
                navigate("/admin/jobs");
            }
        } catch (error) {
            console.error("Job posting error:", error);
            toast.error(error.response?.data?.message || "Failed to post job");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            <Navbar />

            <div className='max-w-4xl mx-auto px-4 sm:px-6 pt-8'>
                {/* Back Button */}
                <button 
                    onClick={() => navigate("/admin/jobs")} 
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-[#6A38C2] hover:border-indigo-300 font-bold text-xs shadow-2xs transition-colors mb-6 cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Posted Jobs</span>
                </button>

                {/* Form Card */}
                <div className='bg-white rounded-3xl border border-slate-200/80 shadow-xl p-6 sm:p-10'>
                    {/* Header */}
                    <div className='pb-6 border-b border-slate-100 mb-8'>
                        <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#6A38C2] text-xs font-bold uppercase tracking-wider mb-2'>
                            <Sparkles className='w-3.5 h-3.5' />
                            <span>New Opportunity</span>
                        </div>
                        <h1 className='text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight'>
                            Create Job Opening
                        </h1>
                        <p className='text-xs sm:text-sm text-slate-500 mt-1'>
                            Define role expectations, requirements, and compensation. Our AI engine uses these details for candidate compatibility scoring.
                        </p>
                    </div>

                    {companies.length === 0 && (
                        <div className='mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3 text-amber-800 text-xs font-medium'>
                            <AlertCircle className='w-5 h-5 text-amber-600 shrink-0' />
                            <span>
                                You must register a company first before publishing a job posting.{" "}
                                <button onClick={() => navigate("/admin/companies/create")} className='underline font-bold text-amber-900 cursor-pointer'>
                                    Register Company Now
                                </button>
                            </span>
                        </div>
                    )}

                    <form onSubmit={submitHandler} className='space-y-6'>
                        {/* Section 1: Role Overview */}
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                            {/* Job Title */}
                            <div className='space-y-1.5'>
                                <Label htmlFor="title" className='text-xs font-bold text-slate-700 flex items-center gap-1.5'>
                                    <Briefcase className='w-3.5 h-3.5 text-slate-400' />
                                    <span>Job Title</span>
                                </Label>
                                <Input
                                    id="title"
                                    type="text"
                                    name="title"
                                    value={input.title}
                                    onChange={changeEventHandler}
                                    required
                                    placeholder="e.g. Senior Frontend Engineer"
                                    className="rounded-xl border-slate-200 focus-visible:ring-[#6A38C2] text-sm"
                                />
                            </div>

                            {/* Company Selector */}
                            <div className='space-y-1.5'>
                                <Label className='text-xs font-bold text-slate-700 flex items-center gap-1.5'>
                                    <Building2 className='w-3.5 h-3.5 text-slate-400' />
                                    <span>Hiring Company</span>
                                </Label>
                                {companies.length > 0 ? (
                                    <Select onValueChange={selectChangeHandler}>
                                        <SelectTrigger className="w-full rounded-xl border-slate-200 focus:ring-[#6A38C2] text-sm">
                                            <SelectValue placeholder="Select hiring organization" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl shadow-xl border-slate-200">
                                            <SelectGroup>
                                                {companies.map((company) => (
                                                    <SelectItem key={company._id} value={company?.name?.toLowerCase()}>
                                                        {company.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <Input 
                                        disabled 
                                        placeholder="No registered companies available" 
                                        className="rounded-xl bg-slate-100 text-xs" 
                                    />
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div className='space-y-1.5'>
                            <Label htmlFor="description" className='text-xs font-bold text-slate-700'>
                                Role Overview & Summary
                            </Label>
                            <textarea
                                id="description"
                                name="description"
                                rows={3}
                                value={input.description}
                                onChange={changeEventHandler}
                                required
                                placeholder="Describe the team, mission, core responsibilities, and day-to-day impact..."
                                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#6A38C2] resize-none"
                            />
                        </div>

                        {/* Requirements & Skills (Crucial for AI matching) */}
                        <div className='space-y-1.5'>
                            <div className='flex items-center justify-between'>
                                <Label htmlFor="requirements" className='text-xs font-bold text-slate-700 flex items-center gap-1.5'>
                                    <Sparkles className='w-3.5 h-3.5 text-[#6A38C2]' />
                                    <span>Required Skills & Tech Stack</span>
                                </Label>
                                <span className='text-[11px] text-indigo-600 font-semibold'>Used by AI Matcher</span>
                            </div>
                            <Input
                                id="requirements"
                                type="text"
                                name="requirements"
                                value={input.requirements}
                                onChange={changeEventHandler}
                                required
                                placeholder="e.g. React, Node.js, Express, MongoDB, TypeScript, AWS, Docker"
                                className="rounded-xl border-slate-200 focus-visible:ring-[#6A38C2] text-sm"
                            />
                            <p className='text-[11px] text-slate-400'>
                                Enter comma-separated skills. Candidates will be scored against these technical tags automatically.
                            </p>
                        </div>

                        {/* Section 2: Compensation & Logistics */}
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
                            {/* Salary */}
                            <div className='space-y-1.5'>
                                <Label htmlFor="salary" className='text-xs font-bold text-slate-700 flex items-center gap-1'>
                                    <IndianRupee className='w-3.5 h-3.5 text-slate-400' />
                                    <span>Salary (LPA)</span>
                                </Label>
                                <Input
                                    id="salary"
                                    type="text"
                                    name="salary"
                                    value={input.salary}
                                    onChange={changeEventHandler}
                                    required
                                    placeholder="e.g. 12 or 15-18"
                                    className="rounded-xl border-slate-200 focus-visible:ring-[#6A38C2] text-sm"
                                />
                            </div>

                            {/* Location */}
                            <div className='space-y-1.5'>
                                <Label htmlFor="location" className='text-xs font-bold text-slate-700 flex items-center gap-1'>
                                    <MapPin className='w-3.5 h-3.5 text-slate-400' />
                                    <span>Location</span>
                                </Label>
                                <Input
                                    id="location"
                                    type="text"
                                    name="location"
                                    value={input.location}
                                    onChange={changeEventHandler}
                                    required
                                    placeholder="e.g. Bangalore, Remote"
                                    className="rounded-xl border-slate-200 focus-visible:ring-[#6A38C2] text-sm"
                                />
                            </div>

                            {/* Job Type */}
                            <div className='space-y-1.5'>
                                <Label htmlFor="jobType" className='text-xs font-bold text-slate-700 flex items-center gap-1'>
                                    <Clock className='w-3.5 h-3.5 text-slate-400' />
                                    <span>Job Type</span>
                                </Label>
                                <Input
                                    id="jobType"
                                    type="text"
                                    name="jobType"
                                    value={input.jobType}
                                    onChange={changeEventHandler}
                                    required
                                    placeholder="e.g. Full Time, Contract"
                                    className="rounded-xl border-slate-200 focus-visible:ring-[#6A38C2] text-sm"
                                />
                            </div>

                            {/* Experience Level */}
                            <div className='space-y-1.5'>
                                <Label htmlFor="experience" className='text-xs font-bold text-slate-700'>
                                    Experience
                                </Label>
                                <Input
                                    id="experience"
                                    type="text"
                                    name="experience"
                                    value={input.experience}
                                    onChange={changeEventHandler}
                                    required
                                    placeholder="e.g. 2+ Years"
                                    className="rounded-xl border-slate-200 focus-visible:ring-[#6A38C2] text-sm"
                                />
                            </div>
                        </div>

                        {/* Section: Application Deadline & Open Positions */}
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2'>
                            {/* Application Deadline */}
                            <div className='space-y-1.5'>
                                <div className='flex items-center justify-between'>
                                    <Label htmlFor="deadline" className='text-xs font-bold text-slate-700 flex items-center gap-1.5'>
                                        <Calendar className='w-3.5 h-3.5 text-[#6A38C2]' />
                                        <span>Application Deadline</span>
                                    </Label>
                                    <span className='text-[11px] text-slate-400 font-normal'>Optional</span>
                                </div>
                                <Input
                                    id="deadline"
                                    type="date"
                                    name="deadline"
                                    min={new Date().toISOString().split('T')[0]}
                                    value={input.deadline}
                                    onChange={changeEventHandler}
                                    className="rounded-xl border-slate-200 focus-visible:ring-[#6A38C2] text-sm"
                                />
                                {/* Quick Presets */}
                                <div className='flex items-center gap-1.5 pt-1 text-[11px]'>
                                    <span className='text-slate-400 font-medium'>Presets:</span>
                                    <button
                                        type="button"
                                        onClick={() => setPresetDeadline(7)}
                                        className='px-2 py-0.5 rounded-md bg-purple-50 hover:bg-purple-100 text-[#6A38C2] font-bold border border-purple-200/60 cursor-pointer transition-colors'
                                    >
                                        +7 Days
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPresetDeadline(14)}
                                        className='px-2 py-0.5 rounded-md bg-purple-50 hover:bg-purple-100 text-[#6A38C2] font-bold border border-purple-200/60 cursor-pointer transition-colors'
                                    >
                                        +14 Days
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPresetDeadline(30)}
                                        className='px-2 py-0.5 rounded-md bg-purple-50 hover:bg-purple-100 text-[#6A38C2] font-bold border border-purple-200/60 cursor-pointer transition-colors'
                                    >
                                        +30 Days
                                    </button>
                                    {input.deadline && (
                                        <button
                                            type="button"
                                            onClick={() => setPresetDeadline(null)}
                                            className='px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold cursor-pointer transition-colors'
                                        >
                                            Clear
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Open Positions Count */}
                            <div className='space-y-1.5'>
                                <Label htmlFor="position" className='text-xs font-bold text-slate-700 flex items-center gap-1.5'>
                                    <Users className='w-3.5 h-3.5 text-slate-400' />
                                    <span>Number of Open Positions</span>
                                </Label>
                                <Input
                                    id="position"
                                    type="number"
                                    min="1"
                                    name="position"
                                    value={input.position}
                                    onChange={changeEventHandler}
                                    required
                                    className="rounded-xl border-slate-200 focus-visible:ring-[#6A38C2] text-sm"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className='pt-6 border-t border-slate-100 flex items-center justify-end gap-3'>
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => navigate("/admin/jobs")}
                                className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs"
                            >
                                Cancel
                            </Button>

                            <Button 
                                type="submit" 
                                disabled={loading || companies.length === 0}
                                className="rounded-xl bg-gradient-to-r from-[#6A38C2] to-indigo-600 hover:from-[#582da8] hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 px-8 py-2.5 cursor-pointer"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-1.5">
                                        <Loader2 className='w-4 h-4 animate-spin' />
                                        <span>Publishing...</span>
                                    </span>
                                ) : (
                                    "Publish Job Opening"
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default PostJob