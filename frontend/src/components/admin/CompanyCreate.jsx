import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setSingleCompany } from '@/redux/companySlice'
import { Building2, ArrowRight, Loader2 } from 'lucide-react'

const CompanyCreate = () => {
    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState("");
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const registerNewCompany = async (e) => {
        if (e) e.preventDefault();
        if (!companyName.trim()) {
            toast.error("Please enter a valid company name");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post(`${COMPANY_API_END_POINT}/register`, { companyName }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res?.data?.success) {
                dispatch(setSingleCompany(res.data.company));
                toast.success(res.data.message || "Company registered successfully!");
                const companyId = res?.data?.company?._id;
                navigate(`/admin/companies/${companyId}`);
            }
        } catch (error) {
            console.error("Company register error:", error);
            toast.error(error.response?.data?.message || "Failed to register company");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            <Navbar />

            <div className='max-w-2xl mx-auto px-4 sm:px-6 pt-12'>
                <div className='bg-white rounded-3xl border border-slate-200/80 shadow-xl p-8 sm:p-12'>
                    {/* Icon & Title */}
                    <div className='text-center max-w-md mx-auto mb-8'>
                        <div className='w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#6A38C2] to-indigo-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/25'>
                            <Building2 className='w-7 h-7' />
                        </div>
                        <h1 className='text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight'>
                            Register New Company
                        </h1>
                        <p className='text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed'>
                            What is the legal or public name of your organization? You can add logos, headquarters, and web links in the next step.
                        </p>
                    </div>

                    {/* Input Form */}
                    <form onSubmit={registerNewCompany} className='space-y-6 max-w-md mx-auto'>
                        <div className='space-y-2'>
                            <Label htmlFor="companyName" className='text-xs font-bold text-slate-700'>
                                Company Name
                            </Label>
                            <Input
                                id="companyName"
                                type="text"
                                value={companyName}
                                placeholder="e.g. Acme Technologies, Microsoft, Stripe"
                                onChange={(e) => setCompanyName(e.target.value)}
                                className='rounded-2xl border-slate-200 focus-visible:ring-[#6A38C2] py-5 px-4 text-sm'
                                autoFocus
                            />
                        </div>

                        {/* Buttons */}
                        <div className='flex items-center gap-3 pt-2'>
                            <Button 
                                type="button"
                                variant="outline" 
                                onClick={() => navigate("/admin/companies")}
                                className='w-1/2 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs py-2.5 cursor-pointer'
                            >
                                Cancel
                            </Button>
                            
                            <Button 
                                type="submit"
                                disabled={loading || !companyName.trim()}
                                className='w-1/2 rounded-xl bg-gradient-to-r from-[#6A38C2] to-indigo-600 hover:from-[#582da8] hover:to-indigo-700 text-white font-bold text-xs py-2.5 shadow-md shadow-indigo-500/20 cursor-pointer flex items-center justify-center gap-2'
                            >
                                {loading ? (
                                    <span className='flex items-center gap-1.5'>
                                        <Loader2 className='w-4 h-4 animate-spin' />
                                        <span>Registering...</span>
                                    </span>
                                ) : (
                                    <span className='flex items-center gap-1.5'>
                                        <span>Continue</span>
                                        <ArrowRight className='w-4 h-4' />
                                    </span>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CompanyCreate