import {CredentialResponse, GoogleLogin} from "@react-oauth/google";
import {googleAuth} from '../../services/user/AuthServices'
import useShowToast from '../../customHook/showToaster'
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface GoogleAuthProps{
  role: 'user'| 'advisor'
}

const GoogleAuth:React.FC<GoogleAuthProps> = ({role}) => {
    const navigate=useNavigate()
    const Toast=useShowToast()
    const handleGoogle = async (userCredential:CredentialResponse) => {
        if(userCredential.credential){
            const user = jwtDecode(userCredential.credential)
            console.log("user : ",user)
            const userData= await googleAuth(user)
            console.log("userData : ",userData)
         if(userData?.message){
          if(role==='advisor'){
            Toast(userData.message,'success',true)
            setTimeout(()=>navigate("/advisor"),1000)
          }else{
            Toast(userData.message,'success',true)
            setTimeout(() => navigate("/"), 1000);
          }
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
