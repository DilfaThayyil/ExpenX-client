import {CredentialResponse, GoogleLogin} from "@react-oauth/google";
import { userGoogleAuth } from '../../services/user/AuthServices'
import { advisorGoogleAuth } from "../../services/advisor/AuthServices";
import useShowToast from '../../customHook/showToaster'
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Store from "@/store/store";

interface GoogleAuthProps{
  role: 'user'| 'advisor'
}

const GoogleAuth:React.FC<GoogleAuthProps> = ({role}) => {

    const {setUser} = Store()
    const navigate=useNavigate()
    const Toast=useShowToast()
    const handleGoogle = async (userCredential:CredentialResponse) => {
      try {
        if (userCredential.credential) {
          const user = jwtDecode<any>(userCredential.credential); 
  
          let userData;
          if (role === 'user') {
            userData = await userGoogleAuth(user); 
          } else if (role === 'advisor') {
            userData = await advisorGoogleAuth(user); 
          }
  
          if (userData?.message) {
            setUser(userData.user)
            Toast(userData.message, 'success', true);
            setTimeout(() => {
              navigate(role === 'advisor' ? "/advisor/home" : "/home");
            }, 1000);
          }
        }
      } catch (error) {
        console.error("Error during Google Auth:", error);
        Toast('Something went wrong, please try again later', 'error', true);
      }
    }
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
