import { TabsContent } from '@/components/ui/tabs';
import { Upload, Badge,FileText,MoreHorizontal,Share2,Download,Filter,FileSpreadsheet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';


export const DocumentsTab = ({ documentsData }) => {
    return (
        <TabsContent value="documents" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <DocumentsTable documentsData={documentsData} />
                <DocumentUploadCard />
            </div>
        </TabsContent>
    );
};

export const DocumentsTable = ({ documentsData }) => {
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
                        {documentsData.map((document) => (
                            <tr key={document.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
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
                                <td className="py-3 px-4">{document.date}</td>
                                <td className="py-3 px-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <ActionButton icon={<Download size={16} />} />
                                        <ActionButton icon={<Share2 size={16} />} />
                                        <ActionButton icon={<MoreHorizontal size={16} />} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DashboardCard>
    );
};

export const ActionButton = ({ icon, onClick }) => {
    return (
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClick}>
        {icon}
      </Button>
    );
  };

export const DocumentUploadCard = () => {
    return (
        <DashboardCard title="Upload Document">
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center">
                <Upload size={24} className="mx-auto text-slate-400 mb-2" />
                <p className="text-sm text-slate-500 mb-4">Drag and drop files here or click to browse</p>
                <Button variant="outline" size="sm">Browse Files</Button>
            </div>
            <div className="mt-6">
                <div className="text-sm font-medium mb-2">Accepted file types</div>
                <div className="flex flex-wrap gap-2">
                    <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-100">PDF</Badge>
                    <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-100">XLSX</Badge>
                    <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-100">DOCX</Badge>
                    <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-100">CSV</Badge>
                </div>
            </div>
            <RecentUploads />
        </DashboardCard>
    );
};

export const RecentUploads = () => {
    const recentFiles = [
        { name: "Q1_Taxes.pdf", type: "pdf", time: "Just now" },
        { name: "Budget_2025.xlsx", type: "spreadsheet", time: "Yesterday" }
    ];

    return (
        <div className="mt-4">
            <div className="text-sm font-medium mb-2">Recent uploads</div>
            <div className="space-y-2">
                {recentFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            {file.type === "pdf" ? (
                                <FileText size={14} className="text-red-500" />
                            ) : (
                                <FileSpreadsheet size={14} className="text-green-500" />
                            )}
                            <span>{file.name}</span>
                        </div>
                        <span className="text-slate-500">{file.time}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const DashboardCard = ({ title, actions, children, className }) => {
    return (
        <Card className={`overflow-hidden hover:shadow-md transition-shadow ${className}`}>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{title}</CardTitle>
                    {actions && <div className="flex gap-2">{actions}</div>}
                </div>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    );
};