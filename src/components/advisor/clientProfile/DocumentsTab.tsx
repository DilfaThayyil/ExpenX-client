import { useState, useEffect } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getDocuments } from '@/services/advisor/advisorService'
import Store from '@/store/store'
import { DocumentsTable } from './DocumentsTable'
import { DocumentUploadCard } from './DocumentUpload'
import {DocumentsTabProps,ActionButtonProps,DashboardCardProps} from './types'


export const DocumentsTab: React.FC<DocumentsTabProps> = ({ clientId }) => {
    const advisorId = Store((state) => state.user._id)
    const [documentsData, setDocumentsData] = useState([])

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await getDocuments(clientId, advisorId);
                setDocumentsData(response.documents);
            } catch (error) {
                console.error("Error fetching documents", error);
            }
        };
        fetchDocuments();
    }, [clientId]);
    return (
        <TabsContent value="documents" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <DocumentsTable documentsData={documentsData} />
                <DocumentUploadCard clientId={clientId} />
            </div>
        </TabsContent>
    );
};

export const ActionButton = ({ icon, onClick }:ActionButtonProps) => {
    return (
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClick}>
            {icon}
        </Button>
    );
};

export const DashboardCard = ({ title, actions, children, className }:DashboardCardProps) => {
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