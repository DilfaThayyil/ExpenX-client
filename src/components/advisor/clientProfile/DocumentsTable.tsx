import { Upload, FileText, Share2, Download, Filter, FileSpreadsheet } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import useShowToast from "@/customHook/showToaster";
import { DashboardCard, ActionButton } from './DocumentsTab'
import { DocumentsTableProps } from './types'
import { EmptyComponent } from '@/components/empty/Empty';




export const DocumentsTable: React.FC<DocumentsTableProps> = ({ documentsData }) => {
    const Toast = useShowToast();
    const handleDownload = (fileUrl: string) => {
        window.open(fileUrl, "_blank");
    };
    const handleShare = (fileUrl: string) => {
        navigator.clipboard.writeText(fileUrl);
        Toast('File link copied to clipboard', 'info')
    };
    return (
        <DashboardCard
            title="Financial Documents"
            className="lg:col-span-2"
            actions={
                <>
                    <Button variant="outline" size="sm">
                        <Upload size={16} className="mr-1" />
                        Upload
                    </Button>
                    <Button variant="outline" size="sm">
                        <Filter size={16} className="mr-1" />
                        Filter
                    </Button>
                </>
            }
        >
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b text-slate-500 text-sm">
                            <th className="text-left py-3 px-4 font-medium">Name</th>
                            <th className="text-left py-3 px-4 font-medium">Type</th>
                            <th className="text-left py-3 px-4 font-medium">Date</th>
                            <th className="text-right py-3 px-4 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {documentsData.length > 0 ? (
                            documentsData.map((document) => (
                                <tr key={document._id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            {document.type === 'PDF' ? <FileText size={16} className="text-red-500" /> : <FileSpreadsheet size={16} className="text-green-500" />}
                                            <span className="font-medium">{document.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <Badge className={document.type === 'PDF' ? 'bg-red-100 text-red-800 hover:bg-red-100' : 'bg-green-100 text-green-800 hover:bg-green-100'}>
                                            {document.type}
                                        </Badge>
                                    </td>
                                    <td className="py-3 px-4">{new Date(document.uploadedAt).toLocaleDateString("en-GB")}</td>
                                    <td className="py-3 px-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <ActionButton icon={<Download size={16} />} onClick={() => handleDownload(document.url)} />
                                            <ActionButton icon={<Share2 size={16} />} onClick={() => handleShare(document.url)} />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5}>
                                    <EmptyComponent />
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </DashboardCard>
    );
};