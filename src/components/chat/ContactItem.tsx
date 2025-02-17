interface contactProps{
    contact:{ _id: string;
        username: string;
        email: string;
        profilePic: string;
    };
    active: boolean;
    onClick: ()=>void

}


export const ContactItem:React.FC<contactProps> = ({ contact, active, onClick }) => {
    return (
      <div 
        className={`flex items-center p-3 cursor-pointer hover:bg-gray-100 ${active ? 'bg-gray-100' : ''}`}
        onClick={onClick}
      >
        <div className="relative">
          <img src={contact.profilePic} alt={contact.username} className="rounded-full w-10 h-10" />
          {contact.status === 'online' && 
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          }
        </div>
        <div className="ml-3 flex-1 overflow-hidden">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold truncate">{contact.username}</h3>
            <span className="text-xs text-gray-500">{contact.time}</span>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500 truncate">{contact.lastMessage}</p>
            {contact.unread > 0 && 
              <span className="bg-green-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                {contact.unread}
              </span>
            }
          </div>
        </div>
      </div>
    );
  };
  