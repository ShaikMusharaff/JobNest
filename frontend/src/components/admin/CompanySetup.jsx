import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Button } from '../ui/button'
import { ArrowLeft, Loader2, Building2, Globe, MapPin, FileText, UploadCloud, CheckCircle2 } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import useGetCompanyById from '@/hooks/useGetCompanyById'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'

const CompanySetup = () => {
    const params = useParams();
    useGetCompanyById(params.id);
    const [input, setInput] = useState({
        name: "",
        description: "",
        website: "",
        location: "",
        file: null
    });
    const { singleCompany } = useSelector(store => store.company);
    const [loading, setLoading] = useState(false);
    const [previewLogo, setPreviewLogo] = useState("");
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setInput({ ...input, file });
            setPreviewLogo(URL.createObjectURL(file));
        }
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", input.name);
        formData.append("description", input.description);
        formData.append("website", input.website);
        formData.append("location", input.location);
        if (input.file) {
            formData.append("file", input.file);
        }
        try {
            setLoading(true);
            const res = await axios.put(`${COMPANY_API_END_POINT}/update/${params.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message || "Company profile updated successfully!");
                navigate("/admin/companies");
            }
        } catch (error) {
            console.error("Company update error:", error);
            toast.error(error.response?.data?.message || "Failed to update company");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (singleCompany) {
            setInput({
                name: singleCompany.name || "",
                description: singleCompany.description || "",
                website: singleCompany.website || "",
                location: singleCompany.location || "",
                file: null
            });
            if (singleCompany.logo) {
                setPreviewLogo(singleCompany.logo);
            }
        }
    }, [singleCompany]);

    const getCompanyInitials = (name) => {
        if (!name) return "CO";
        return name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
    };

    return (
        <div className="min-h-screen bg-slate-50/50 pb-16">
            <Navbar />
            
            <div className='max-w-3xl mx-auto px-4 sm:px-6 pt-8'>
                {/* Back Nav */}
                <button 
                    onClick={() => navigate("/admin/companies")} 
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-[#6A38C2] hover:border-indigo-300 font-bold text-xs shadow-2xs transition-colors mb-6 cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Companies</span>
                </button>

                {/* Form Card */}
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-6 sm:p-10">
                    <div className="flex items-center gap-4 pb-6 border-b border-slate-100 mb-8">
                        <Avatar className="h-16 w-16 rounded-2xl border-2 border-indigo-100 shadow-sm">
                            <AvatarImage src={previewLogo || singleCompany?.logo} alt={input.name} />
                            <AvatarFallback className="rounded-2xl bg-gradient-to-tr from-[#6A38C2] to-indigo-600 text-white font-extrabold text-lg">
                                {getCompanyInitials(input.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className='text-2xl font-extrabold text-slate-900'>Company Profile Setup</h1>
                            <p className='text-xs text-slate-500 mt-0.5'>
                                Customize your company identity, branding assets, and recruiter contact info.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={submitHandler} className="space-y-6">
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                            {/* Company Name */}
                            <div className="space-y-1.5">
                                <Label htmlFor="name" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                                    <span>Company Name</span>
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={input.name}
                                    onChange={changeEventHandler}
                                    required
                                    placeholder="e.g. Acme Corp, Google"
                                    className="rounded-xl border-slate-200 focus-visible:ring-[#6A38C2] text-sm"
                                />
                            </div>

                            {/* Location */}
                            <div className="space-y-1.5">
                                <Label htmlFor="location" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                    <span>Headquarters Location</span>
                                </Label>
                                <Input
                                    id="location"
                                    type="text"
                                    name="location"
                                    value={input.location}
                                    onChange={changeEventHandler}
                                    placeholder="e.g. Bangalore, India or Remote"
                                    className="rounded-xl border-slate-200 focus-visible:ring-[#6A38C2] text-sm"
                                />
                            </div>
                        </div>

                        {/* Website */}
                        <div className="space-y-1.5">
                            <Label htmlFor="website" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                <Globe className="w-3.5 h-3.5 text-slate-400" />
                                <span>Official Website URL</span>
                            </Label>
                            <Input
                                id="website"
                                type="url"
                                name="website"
                                value={input.website}
                                onChange={changeEventHandler}
                                placeholder="https://example.com"
                                className="rounded-xl border-slate-200 focus-visible:ring-[#6A38C2] text-sm"
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5">
                            <Label htmlFor="description" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5 text-slate-400" />
                                <span>About the Company</span>
                            </Label>
                            <textarea
                                id="description"
                                name="description"
                                rows={3}
                                value={input.description}
                                onChange={changeEventHandler}
                                placeholder="Provide a summary of your mission, engineering culture, and industry..."
                                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#6A38C2] resize-none"
                            />
                        </div>

                        {/* Logo Upload Box */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                <UploadCloud className="w-3.5 h-3.5 text-slate-400" />
                                <span>Brand Logo Image</span>
                            </Label>
                            
                            <div className="border border-dashed border-slate-300 rounded-2xl p-5 bg-slate-50/60 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-12 w-12 rounded-xl border border-slate-200">
                                        <AvatarImage src={previewLogo} alt="Preview" />
                                        <AvatarFallback className="bg-white text-slate-400 text-xs font-bold">
                                            LOGO
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-xs font-bold text-slate-800">
                                            {input.file?.name || (previewLogo ? "Logo currently active" : "No logo selected")}
                                        </p>
                                        <p className="text-[11px] text-slate-400">PNG, JPG, SVG up to 2MB (recommended square 1:1)</p>
                                    </div>
                                </div>

                                <label 
                                    htmlFor="companyLogo"
                                    className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 text-[#6A38C2] text-xs font-bold shadow-2xs hover:bg-indigo-50/50 cursor-pointer shrink-0 transition-colors"
                                >
                                    Browse Logo
                                </label>
                                <input
                                    id="companyLogo"
                                    type="file"
                                    accept="image/*"
                                    onChange={changeFileHandler}
                                    className="hidden"
                                />
                            </div>
                        </div>

                        {/* Submit Action */}
                        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate("/admin/companies")}
                                className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs"
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={loading}
                                className="rounded-xl bg-gradient-to-r from-[#6A38C2] to-indigo-600 hover:from-[#582da8] hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 px-8 cursor-pointer"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-1.5">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Saving...</span>
                                    </span>
                                ) : (
                                    "Save Company Profile"
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CompanySetup