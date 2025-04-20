import MeetingsTable from './MeetingsTable';
import {MeetingsTableProps} from './types'

const MeetingsTab:React.FC<MeetingsTableProps> = ({ meetings }) => {
    return (
        <>
            <MeetingsTable meetings={meetings} />
        </>
    );
};

export default MeetingsTab;