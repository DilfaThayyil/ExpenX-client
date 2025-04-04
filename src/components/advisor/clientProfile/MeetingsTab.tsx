import MeetingsTable from './MeetingsTable';

const MeetingsTab = ({ meetings }) => {
    return (
        <>
            <MeetingsTable meetings={meetings} />
        </>
    );
};

export default MeetingsTab;