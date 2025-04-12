import { useState } from 'react';
import { Upload, FileText, FileSpreadsheet, X } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { uploadDocument } from '@/services/advisor/advisorService'
import Store from '@/store/store'
import useShowToast from "@/customHook/showToaster";
import { DashboardCard } from './DocumentsTab'
import {IDocumentFile} from './types'


export const DocumentUploadCard = ({ clientId }) => {
    const advisorId = Store((state) => state.user._id)
    const [selectedFile, setSelectedFile] = useState<File | IDocumentFile | null>(null)
    const [previewURL, setPreviewURL] = useState<string | undefined>(undefined);
    const Toast = useShowToast();

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setSelectedFile(file);
        if (file.type.startsWith("image/")) {
            setPreviewURL(URL.createObjectURL(file));
        } else {
            setPreviewURL("file");
        }
    }
    const handleUpload = async () => {
        if (!selectedFile) return alert("Please select a file!");
        if (!(selectedFile instanceof File)) {
            Toast('Invalid file type','error')
            return;
        }
        const formData = new FormData();
        formData.append("document", selectedFile);
        formData.append("userId", clientId);
        formData.append("advisorId", advisorId)
        try {
            const response = await uploadDocument(formData);
            console.log("res :: ", response)
            Toast('File uploaded successfully!', 'success')
            setSelectedFile(null);
            setPreviewURL(undefined);
        } catch (error) {
            Toast('Failed to upload', 'error')
            console.error("Upload failed : ", error);
        }
    };
    const handleRemoveFile = () => {
        setSelectedFile(null);
        setPreviewURL(undefined);
    };
    return (
        <DashboardCard title="Upload Document" >
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center">
                <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.xlsx,.docx,.csv,.jpg,.png"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload size={24} className="mx-auto text-slate-400 mb-2" />
                    <p className="text-sm text-slate-500 mb-4">Drag and drop or click here to upload files</p>
                    <Button variant="destructive" size="sm" onClick={handleUpload} disabled={!selectedFile}>
                        Upload
                    </Button>
                </label>
            </div>
            {selectedFile && (
                <div className="mt-4 flex items-center justify-between border p-3 rounded-lg bg-slate-100">
                    <div className="flex items-center gap-2">
                        {previewURL === "file" ? (
                            selectedFile.name.endsWith(".pdf") ? (
                                <FileText size={24} className="text-red-500" />
                            ) : selectedFile.name.endsWith(".xlsx") || selectedFile.name.endsWith(".csv") ? (
                                <FileSpreadsheet size={24} className="text-green-500" />
                            ) : selectedFile.name.endsWith(".docx") ? (
                                <FileText size={24} className="text-blue-500" />
                            ) : (
                                <FileText size={24} className="text-gray-500" />
                            )
                        ) : (
                            <img src={previewURL} alt="Preview" className="h-10 w-10 rounded-md object-cover" />
                        )}
                        <span className="text-sm font-medium">{selectedFile.name}</span>
                    </div>
                    <button onClick={handleRemoveFile} className="text-red-500">
                        <X size={16} />
                    </button>
                </div>
            )}
            <div className="mt-6">
                <div className="text-sm font-medium mb-2">Accepted file types</div>
                <div className="flex flex-wrap gap-2">
                    <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-100">PDF</Badge>
                    <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-100">XLSX</Badge>
                    <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-100">DOCX</Badge>
                    <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-100">CSV</Badge>
                </div>
            </div>
        </DashboardCard>
    );
}