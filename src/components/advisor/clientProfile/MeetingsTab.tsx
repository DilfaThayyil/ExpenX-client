import MeetingsTable from './MeetingsTable';
import MeetingCalendar from './MeetingCalender';

const MeetingsTab = ({ meetings }) => {
    return (
        <>
            <MeetingsTable meetings={meetings} />
            <MeetingCalendar meetings={meetings} />
        </>
    );
};

export default MeetingsTab;