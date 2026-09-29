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
import { setLoading, setUser } from '@/redux/authSlice'
import { Loader2, Mail, Lock, Eye, EyeOff, UserCheck, Briefcase, ArrowRight, Sparkles } from 'lucide-react'

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "student",
    });
    const [showPassword, setShowPassword] = useState(false);
    const { loading, user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const setRole = (selectedRole) => {
        setInput({ ...input, role: selectedRole });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!input.role) {
            toast.error("Please select whether you are a Candidate or Recruiter");
            return;
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                navigate("/");
                toast.success(res.data.message || "Welcome back to JobNest!");
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error(error.response?.data?.message || "Invalid credentials. Please try again.");
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
                <div className='w-full max-w-md bg-white border border-slate-200/80 rounded-3xl shadow-xl p-8 sm:p-10'>
                    {/* Header */}
                    <div className='text-center mb-8'>
                        <div className='inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-50 text-[#6A38C2] text-xs font-bold uppercase tracking-wider mb-3'>
                            <Sparkles className='w-3.5 h-3.5' />
                            <span>JobNest Portal</span>
                        </div>
                        <h1 className='text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight'>
                            Welcome Back
                        </h1>
                        <p className='text-xs sm:text-sm text-slate-500 mt-1.5'>
                            Sign in to access AI recommendations & track your applications
                        </p>
                    </div>

                    <form onSubmit={submitHandler} className='space-y-5'>
                        {/* Role Selector Pill */}
                        <div className='space-y-1.5'>
                            <Label className='text-xs font-bold text-slate-700 block'>
                                I am signing in as:
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

                        {/* Email Field */}
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
                                className='rounded-xl border-slate-200 focus-visible:ring-[#6A38C2] text-sm py-2.5'
                            />
                        </div>

                        {/* Password Field */}
                        <div className='space-y-1.5'>
                            <Label htmlFor="password" className='text-xs font-bold text-slate-700 flex items-center gap-1.5'>
                                <Lock className='w-3.5 h-3.5 text-slate-400' />
                                <span>Password</span>
                            </Label>
                            <div className='relative'>
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={input.password}
                                    name="password"
                                    required
                                    onChange={changeEventHandler}
                                    placeholder="••••••••••••"
                                    className='rounded-xl border-slate-200 focus-visible:ring-[#6A38C2] text-sm py-2.5 pr-10'
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

                        {/* Submit Button */}
                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="w-full rounded-xl bg-gradient-to-r from-[#6A38C2] to-indigo-600 hover:from-[#582da8] hover:to-indigo-700 text-white font-bold text-sm py-3 shadow-md shadow-indigo-500/20 hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
                        >
                            {loading ? (
                                <span className='flex items-center gap-2'>
                                    <Loader2 className='w-4 h-4 animate-spin' />
                                    <span>Signing in...</span>
                                </span>
                            ) : (
                                <span className='flex items-center gap-1.5'>
                                    <span>Sign In</span>
                                    <ArrowRight className='w-4 h-4' />
                                </span>
                            )}
                        </Button>

                        {/* Footer Link */}
                        <div className='text-center pt-3 text-xs text-slate-500'>
                            <span>Don't have an account? </span>
                            <Link to="/signup" className='font-bold text-[#6A38C2] hover:underline'>
                                Create Account
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

export default Login