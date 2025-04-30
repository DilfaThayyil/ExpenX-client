import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { acceptGroupInvite } from '@/services/user/groupServices'

const AcceptInvite = () => {
    console.log("Entered acceptInvite page....")
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const groupId = params.get("groupId");
    const email = params.get("email");
    console.log("groupId , email : ", groupId, " , ", email)
    useEffect(() => {
        const acceptInvite = async () => {
            if (!groupId || !email) {
                toast.error("Invalid invitation link.");
                navigate("/");
                return;
            }
            try {
                const response = await acceptGroupInvite(groupId, email);
                const { status, redirectTo } = response.data;

                if (status === "redirect") {
                    window.location.href = redirectTo;
                    return;
                }

                toast.success("You’ve been added to the group!");
                navigate(`/groups`);

            } catch (err) {
                console.error(err);
                toast.error("Invalid or expired invite link.");
                navigate("/");
            }
        };

        acceptInvite();
    }, [groupId, email]);

    return <p>Processing your invite...</p>;
};

export default AcceptInvite;
