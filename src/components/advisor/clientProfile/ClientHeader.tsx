import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { MessageSquare, Phone } from 'lucide-react';

export interface MeetingType {
    date: string;
};

export interface ClientType {
    username: string;
    email: string;
    phone: string;
    profilePic?: string;
};

export interface ClientHeaderProps {
    client: ClientType | null;
    lastMeeting?: MeetingType | null;
    nextMeeting?: MeetingType | null;
}

const ClientHeader: React.FC<ClientHeaderProps> = ({ client, lastMeeting, nextMeeting }) => {
    // Financial health score (0-100)
    // const healthScore = 78;
    // const getHealthColor = (score) => {
    //     if (score < 41) return 'bg-red-500';
    //     if (score < 71) return 'bg-orange-500';
    //     return 'bg-green-500';
    // };
    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <div className="w-full mb-6 bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80">
            <div className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="relative">
                    <Avatar className="h-24 w-24 rounded-xl border-4 border-white dark:border-slate-700 shadow-lg">
                        <img src={client ? client.profilePic : "/api/placeholder/150/150"} alt="Client profile" className="object-cover rounded-xl" />
                    </Avatar>
                    {/* <div className={`absolute -bottom-2 -right-2 h-8 w-8 rounded-full ${getHealthColor(healthScore)} flex items-center justify-center text-white font-bold border-2 border-white dark:border-slate-700`}>
                        {healthScore}
                    </div> */}
                </div>

                <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{client?.username}</h1>
                            <div className="text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row sm:gap-4 mt-1">
                                <span className="flex items-center gap-1">
                                    <MessageSquare size={16} />
                                    {client?.email}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Phone size={16} />
                                    {client?.phone}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center text-sm text-slate-600 dark:text-slate-300">
                        <div className="flex-1">
                            <span className="text-slate-500 dark:text-slate-400">Last Meeting: </span>{lastMeeting ? formatDate(lastMeeting.date) : "N/A"}
                        </div>
                        <Separator orientation="vertical" className="h-4 mx-4" />
                        <div className="flex-1">
                            <span className="text-slate-500 dark:text-slate-400">Next Meeting:</span>
                            <span className="text-blue-600 dark:text-blue-400 font-medium ml-1">{nextMeeting ? formatDate(nextMeeting.date) : "No upcoming Meeting"}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientHeader;