import {CredentialResponse, GoogleLogin} from "@react-oauth/google";
import {googleAuth} from '../../services/user/AuthServices'
import Store from "../../store/store";
import useShowToast from '../../customHook/showToaster'
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const GoogleAuth = () => {
    const { setUser } = Store();
    const navigate=useNavigate()
    const Toast=useShowToast()
    const handleGoogle = async (userCredential:CredentialResponse) => {
        if(userCredential.credential){
            
            const user = jwtDecode(userCredential.credential)
            console.log("user : ",user)
            const userData= await googleAuth(user)
            console.log(userData)
         if(userData?.message){
            setUser(userData.userObject);
            Toast(userData.message,'success',true)
            setTimeout(() => navigate("/"), 1000);
         }
        }
      };
    return (
        <GoogleLogin
        onSuccess={handleGoogle}
        onError={() => {
         Toast('Something went wrong please try again later','error',true)
        }}
      />
    );
}

export default GoogleAuth;
