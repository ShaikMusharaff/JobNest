import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/redux/authSlice'
import { Loader2, Mail, Lock, User, Phone, UploadCloud, Eye, EyeOff, UserCheck, Briefcase, ArrowRight, Sparkles, FileText, FileCheck, X } from 'lucide-react'

const Signup = () => {
    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "student",
        file: null,
        resume: null
    });
    const [showPassword, setShowPassword] = useState(false);
    const [previewPhoto, setPreviewPhoto] = useState("");
    const { loading, user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const setRole = (selectedRole) => {
        setInput({ ...input, role: selectedRole });
    }

    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setInput({ ...input, file });
            setPreviewPhoto(URL.createObjectURL(file));
        }
    }

    const changeResumeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setInput({ ...input, resume: file });
        }
    }

    const clearResumeHandler = () => {
        setInput({ ...input, resume: null });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!input.role) {
            toast.error("Please select a role (Candidate or Recruiter)");
            return;
        }

        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);
        if (input.file) {
            formData.append("profilePhoto", input.file);
        }
        if (input.resume) {
            formData.append("resume", input.resume);
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': "multipart/form-data" },
                withCredentials: true,
            });
            if (res.data.success) {
                toast.success(res.data.message || "Account created successfully! Please sign in.");
                navigate("/login");
            }
        } catch (error) {
            console.error("Signup error:", error);
            const errorMessage = error.response?.data?.message || "Failed to create account. Please try again.";
            toast.error(errorMessage);
        } finally {
            dispatch(setLoading(false));
        }
    }

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50/50 via-white to-slate-50 flex flex-col justify-between">
            <Navbar />

            <div className='flex items-center justify-center px-4 py-12'>
                <div className='w-full max-w-lg bg-white border border-slate-200/80 rounded-3xl shadow-xl p-8 sm:p-10'>
                    {/* Header */}
                    <div className='text-center mb-8'>
                        <div className='inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-50 text-[#6A38C2] text-xs font-bold uppercase tracking-wider mb-3'>
                            <Sparkles className='w-3.5 h-3.5' />
                            <span>Create Your Account</span>
                        </div>
                        <h1 className='text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight'>
                            Join JobNest
                        </h1>
                        <p className='text-xs sm:text-sm text-slate-500 mt-1.5'>
                            Experience next-gen AI career matching and resume analysis
                        </p>
                    </div>

                    <form onSubmit={submitHandler} className='space-y-4'>
                        {/* Role Selector Pill */}
                        <div className='space-y-1.5'>
                            <Label className='text-xs font-bold text-slate-700 block'>
                                Registering as:
                            </Label>
                            <div className='grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl'>
                                <button
                                    type="button"
                                    onClick={() => setRole("student")}
                                    className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                        input.role === "student"
                                            ? "bg-white text-[#6A38C2] shadow-xs"
                                            : "text-slate-500 hover:text-slate-900"
                                    }`}
                                >
                                    <UserCheck className='w-3.5 h-3.5' />
                                    <span>Job Seeker</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole("recruiter")}
                                    className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                        input.role === "recruiter"
                                            ? "bg-white text-[#6A38C2] shadow-xs"
                                            : "text-slate-500 hover:text-slate-900"
                                    }`}
                                >
                                    <Briefcase className='w-3.5 h-3.5' />
                                    <span>Employer</span>
                                </button>
                            </div>
                        </div>

                        {/* Full Name */}
                        <div className='space-y-1.5'>
                            <Label htmlFor="fullname" className='text-xs font-bold text-slate-700 flex items-center gap-1.5'>
                                <User className='w-3.5 h-3.5 text-slate-400' />
                                <span>Full Name</span>
                            </Label>
                            <Input
                                id="fullname"
                                type="text"
                                value={input.fullname}
                                name="fullname"
                                required
                                onChange={changeEventHandler}
                                placeholder="Your full name"
                                className='rounded-xl border-slate-200 focus-visible:ring-[#6A38C2] text-sm py-2'
                            />
                        </div>

                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                            {/* Email */}
                            <div className='space-y-1.5'>
                                <Label htmlFor="email" className='text-xs font-bold text-slate-700 flex items-center gap-1.5'>
                                    <Mail className='w-3.5 h-3.5 text-slate-400' />
                                    <span>Email Address</span>
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={input.email}
                                    name="email"
                                    required
                                    onChange={changeEventHandler}
                                    placeholder="name@example.com"
                                    className='rounded-xl border-slate-200 focus-visible:ring-[#6A38C2] text-sm py-2'
                                />
                            </div>

                            {/* Phone */}
                            <div className='space-y-1.5'>
                                <Label htmlFor="phoneNumber" className='text-xs font-bold text-slate-700 flex items-center gap-1.5'>
                                    <Phone className='w-3.5 h-3.5 text-slate-400' />
                                    <span>Phone Number</span>
                                </Label>
                                <Input
                                    id="phoneNumber"
                                    type="text"
                                    value={input.phoneNumber}
                                    name="phoneNumber"
                                    required
                                    onChange={changeEventHandler}
                                    placeholder="+91 9876543210"
                                    className='rounded-xl border-slate-200 focus-visible:ring-[#6A38C2] text-sm py-2'
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className='space-y-1.5'>
                            <Label htmlFor="password" className='text-xs font-bold text-slate-700 flex items-center gap-1.5'>
                                <Lock className='w-3.5 h-3.5 text-slate-400' />
                                <span>Create Password</span>
                            </Label>
                            <div className='relative'>
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={input.password}
                                    name="password"
                                    required
                                    onChange={changeEventHandler}
                                    placeholder="Minimum 6 characters"
                                    className='rounded-xl border-slate-200 focus-visible:ring-[#6A38C2] text-sm py-2 pr-10'
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1'
                                >
                                    {showPassword ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                                </button>
                            </div>
                        </div>

                        {/* Profile Photo */}
                        <div className='space-y-1.5 pt-1'>
                            <Label htmlFor="photoUpload" className='text-xs font-bold text-slate-700 flex items-center gap-1.5'>
                                <UploadCloud className='w-3.5 h-3.5 text-slate-400' />
                                <span>Profile Avatar (Optional)</span>
                            </Label>
                            <div className='flex items-center gap-3 p-2 rounded-2xl border border-slate-200 bg-slate-50/60'>
                                {previewPhoto ? (
                                    <img src={previewPhoto} alt="Preview" className='w-9 h-9 rounded-xl object-cover border border-slate-200' />
                                ) : (
                                    <div className='w-9 h-9 rounded-xl bg-purple-50 text-[#6A38C2] flex items-center justify-center font-bold text-xs'>
                                        IMG
                                    </div>
                                )}
                                <span className='text-xs text-slate-500 truncate flex-1'>
                                    {input.file ? input.file.name : "Select an image file"}
                                </span>
                                <label 
                                    htmlFor="photoUpload"
                                    className='px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 text-[#6A38C2] text-xs font-bold shadow-2xs hover:bg-indigo-50/50 cursor-pointer transition-colors shrink-0'
                                >
                                    Browse
                                </label>
                                <input
                                    id="photoUpload"
                                    accept="image/*"
                                    type="file"
                                    onChange={changeFileHandler}
                                    className="hidden"
                                />
                            </div>
                        </div>

                        {/* Resume Upload for Job Seekers */}
                        {input.role === "student" && (
                            <div className='space-y-1.5 pt-1'>
                                <Label htmlFor="resumeUpload" className='text-xs font-bold text-slate-700 flex items-center justify-between'>
                                    <span className='flex items-center gap-1.5'>
                                        <FileText className='w-3.5 h-3.5 text-[#6A38C2]' />
                                        <span>Resume Document (PDF/DOCX)</span>
                                    </span>
                                    <span className='text-[10px] text-purple-700 bg-purple-50 border border-purple-200/60 px-2 py-0.5 rounded-full font-bold'>
                                        Recommended
                                    </span>
                                </Label>

                                <div className='p-3 rounded-2xl border border-slate-200 bg-purple-50/30 hover:bg-purple-50/50 transition-colors flex items-center justify-between gap-3'>
                                    <div className='flex items-center gap-2.5 overflow-hidden'>
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                                            input.resume ? 'bg-emerald-100 text-emerald-700' : 'bg-purple-100 text-[#6A38C2]'
                                        }`}>
                                            {input.resume ? <FileCheck className='w-4 h-4' /> : <UploadCloud className='w-4 h-4' />}
                                        </div>
                                        <div className='overflow-hidden'>
                                            <p className='text-xs font-bold text-slate-800 truncate'>
                                                {input.resume ? input.resume.name : "Upload your resume now"}
                                            </p>
                                            <p className='text-[10px] text-slate-400'>
                                                {input.resume 
                                                    ? `${(input.resume.size / 1024).toFixed(1)} KB • Auto-skill extraction ready` 
                                                    : "PDF, DOCX up to 5MB (AI auto-matches jobs)"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className='flex items-center gap-2 shrink-0'>
                                        {input.resume && (
                                            <button
                                                type="button"
                                                onClick={clearResumeHandler}
                                                className='text-slate-400 hover:text-slate-600 p-1 cursor-pointer'
                                                title="Remove file"
                                            >
                                                <X className='w-4 h-4' />
                                            </button>
                                        )}
                                        <label 
                                            htmlFor="resumeUpload"
                                            className='px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 text-[#6A38C2] text-xs font-bold shadow-2xs hover:bg-indigo-50/50 cursor-pointer transition-colors'
                                        >
                                            {input.resume ? "Change" : "Browse"}
                                        </label>
                                    </div>
                                    <input
                                        id="resumeUpload"
                                        accept="application/pdf,.pdf,.doc,.docx"
                                        type="file"
                                        onChange={changeResumeHandler}
                                        className="hidden"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="w-full rounded-xl bg-gradient-to-r from-[#6A38C2] to-indigo-600 hover:from-[#582da8] hover:to-indigo-700 text-white font-bold text-sm py-3 shadow-md shadow-indigo-500/20 hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
                        >
                            {loading ? (
                                <span className='flex items-center gap-2'>
                                    <Loader2 className='w-4 h-4 animate-spin' />
                                    <span>Registering Account...</span>
                                </span>
                            ) : (
                                <span className='flex items-center gap-1.5'>
                                    <span>Create Account</span>
                                    <ArrowRight className='w-4 h-4' />
                                </span>
                            )}
                        </Button>

                        {/* Footer Link */}
                        <div className='text-center pt-2 text-xs text-slate-500'>
                            <span>Already registered? </span>
                            <Link to="/login" className='font-bold text-[#6A38C2] hover:underline'>
                                Sign In
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

            <div className='py-6 text-center text-xs text-slate-400'>
                © {new Date().getFullYear()} JobNest Inc. All rights reserved.
            </div>
        </div>
    )
}

export default Signup